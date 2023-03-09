import json
import jinja2schema
import jinja2
from jinja2 import Template, meta

if __name__ == "__main__":
    template = """
{# Notary Document #}

I, {{ notary_name }}, a notary public in and for the {{ jurisdiction }} jurisdiction, do hereby certify that on this {{ date }} day of {{ month }}, {{ year }}, before me personally appeared the following individuals:

{% for person in people %}
- {{ person.name }}, {{ person.gender.value }}{% if loop.last %}.{% else %};{% endif %}
{% endfor %}

Each of the foregoing individuals acknowledged to me that he or she executed the foregoing instrument for the purposes therein contained.

Given under my hand and official seal this {{ date }} day of {{ month }}, {{ year }}.

{{ notary_name }}
Notary Public
{{ jurisdiction }}

    """

    # print(template)
    # print(jinja2schema.infer(template))
    # print(jinja2schema.to_json_schema(jinja2schema.infer(template)))
    # print("-----------------", jinja2schema.parse(template))
    # print(
    #     json.dumps(jinja2schema.to_json_schema(jinja2schema.infer(template)), indent=2)
    # )
    a: Template = Template(template)
    env = jinja2.Environment()
    ast = env.parse(template)
    print(meta.find_undeclared_variables(ast))
    print(
        "-----------------",
        json.dumps(
            jinja2schema.to_json_schema(
                jinja2schema.infer(a),
                jinja2schema.core.StringJSONSchemaDraft4Encoder,
            ),
            indent=2,
        ),
    )
    print(
        "-----------------",
        json.dumps(
            jinja2schema.to_json_schema(
                jinja2schema.infer(template),
                jinja2schema.core.StringJSONSchemaDraft4Encoder,
            ),
            indent=2,
        ),
    )
    # print(
    #     "-----------------",
    #     jinja2schema.infer(template),
    # )
    # print(a.render())
