import json
from typing import Any, Dict
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import jinja2 as j2
from jinja2 import exceptions as jinja2Exceptions
import jinja2schema as j2s
from jinja2schema import exceptions as jinja2SchemaExceptions
import jsonschema
from jsonschema import exceptions as JsonSchemaExceptions
from fastapi.encoders import jsonable_encoder

from http import HTTPStatus

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


class TemplateBody(BaseModel):
    template: str


class JsonSchema(BaseModel):
    type: str
    properties: Dict[str, Any]
    required: list


class RenderBody(TemplateBody):
    input: Dict[str, Any]


class APIException(BaseModel):
    msg: str
    type: str


# This workaround is only for the purpose of making the documentation work.
# With a custom exception that inherits from HTTPException,
# FastAPi complains that
# "fastapi.exceptions.FastAPIError: Invalid args for response field!
#  Hint: check that <class 'api.APIValidationError'> is a valid Pydantic field type."
# which seem like too much work for what we'll gain.
class APIValidationError(BaseModel):
    detail: APIException


def handleExceptions(e):
    message: str = ""

    # isinstance has to also be checked in order for Pylance type inference to work properly.
    # if issubclass(type(e), jinja2SchemaExceptions.InferException) or isinstance(
    #     e, jinja2SchemaExceptions.InferException
    # ):
    #     message = str(e)

    if hasattr(e, "message") and e.message and isinstance(e.message, str):
        message = e.message
    else:
        message = str(e)

    detail = jsonable_encoder(APIException(msg=message, type=e.__class__.__name__))
    raise HTTPException(
        HTTPStatus.BAD_REQUEST,
        detail,
    )


def getJsonSchema(template: str) -> Dict[str, Any]:
    return j2s.to_json_schema(
        j2s.infer(template),
        j2s.core.StringJSONSchemaDraft4Encoder,
    )


@app.post(
    "/extract-schema/",
    response_model=JsonSchema,
    responses={
        HTTPStatus.BAD_REQUEST: {
            "description": "Bad Request",
            "content": {
                "application/json": {
                    "detail": {"msg": "unexpected '}'", "type": "TemplateSyntaxError"}
                }
            },
            "model": APIValidationError,
        }
    },
)
def extract_schema(
    template: TemplateBody = TemplateBody(
        template="{# Notary Document #}\n\nI, {{ notary_name }}, a notary public in and for the {{ jurisdiction }} jurisdiction, do hereby certify that on this {{ date }} day of {{ month }}, {{ year }}, before me personally appeared the following individuals:\n\n{% for person in people %}\n- {{ person.name }}, {{ person.gender.value }}{% if loop.last %}.{% else %};{% endif %}\n{% endfor %}\n\nEach of the foregoing individuals acknowledged to me that he or she executed the foregoing instrument for the purposes therein contained.\n\nGiven under my hand and official seal this {{ date }} day of {{ month }}, {{ year }}.\n\n{{ notary_name }}\nNotary Public\n{{ jurisdiction }}"
    ),
) -> Dict[str, Any]:
    try:
        return getJsonSchema(template.template)
    except (
        jinja2Exceptions.TemplateError,
        jinja2SchemaExceptions.InferException,
    ) as e:
        handleExceptions(e)


@app.post(
    "/render/",
    responses={
        HTTPStatus.BAD_REQUEST: {
            "description": "Bad Request",
            "content": {
                "application/json": {
                    "detail": {
                        "msg": "'notary_name' is a required property",
                        "type": "ValidationError",
                    }
                },
            },
            "model": APIValidationError,
        }
    },
)
def render(render_body: RenderBody):
    try:
        template: j2.Template = j2.Template(render_body.template)
        jsonSchema = getJsonSchema(render_body.template)
        jsonschema.validate(render_body.input, jsonSchema)
        return template.render(render_body.input)
    except (
        JsonSchemaExceptions._Error,
        jinja2Exceptions.TemplateError,
        jinja2SchemaExceptions.InferException,
        TypeError,
    ) as e:
        handleExceptions(e)
