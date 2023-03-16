import axios from "axios";
import {
  APIValidationError,
  HTTPValidationError,
  JsonSchema,
  RenderBody,
  TemplateBody,
} from "../types/api";
let BASEURL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000/"
      : "https://backend-1-j6216561.deta.app/",
  TIMEOUT = 1000 * 5;

const Api = axios.create({
  baseURL: BASEURL,
  timeout: TIMEOUT,
});

function typeCheckResponseError(
  err: unknown
): APIValidationError | HTTPValidationError | undefined {
  if (
    !!err &&
    typeof err === "object" &&
    "detail" in err &&
    !!err.detail &&
    typeof err.detail === "object"
  ) {
    if (Array.isArray(err.detail)) {
      return err as HTTPValidationError;
    } else {
      return err as APIValidationError;
    }
  }
  return undefined;
}

function extractScheme(template: string) {
  const body: TemplateBody = {
    template,
  };

  return Api.post("/extract-schema/", {
    template,
  })
    .then(({ data }) => {
      return data as JsonSchema;
    })
    .catch((err) => {
      const data = err.response.data;

      const typedError = typeCheckResponseError(data);
      if (!typedError) {
        throw err;
      } else throw typedError;
    });
}
function render(template: string, input: object) {
  const body: RenderBody = { template, input };
  return Api.post("/render/", body)
    .then(({ data }) => {
      return data as string;
    })
    .catch((err) => {
      const data = err.response.data;

      const typedError = typeCheckResponseError(data);
      if (!typedError) {
        throw err;
      } else throw typedError;
    });
}

export default { extractScheme, render };
