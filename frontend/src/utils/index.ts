import { AnythingObject } from "../types";
import { JsonSchema } from "../types/api";

type Preset = {
  name: string;
  template: string;
};

const presets: Preset[] = [
  {
    name: "TUTORIAL",
    template: `{# Welcome to the Jinja template tutorial! This template demonstrates the different features and capabilities of the Jinja templating engine. 

First, press "Analyze Tmeplate" and provide variables that will be used throughout the template. We will then demonstrate how these variables can be used and manipulated using Jinja syntax. #}
  
{# Now let's use the variables we just defined in our template. #}

Hi there, {{ name }}!

You are {{ age }} years old and your interests are:
- {% for interest in interests -%}
  {{ interest }},
{% endfor %}

{# We can also loop through a list of objects and access their properties using Jinja syntax. #}

Your friends are:
{% for friend in friends %}
- {{ friend.name }}, {{ friend.age }}
{% endfor %}

{# Finally, we can use conditional statements to display content based on certain conditions. #}

{% if age|string == "25" %}
You are 25 years old.
{% else %}
You are not 25 years old.
{% endif %}
`,
  },
  {
    name: "GOVERNMENTAL FORM",
    template: `GOVERNMENTAL FORM

Name: {{ name }}
Address: {{ address }}
Age: {{ age }}
Gender: {{ gender }}
Nationality: {{ nationality }}

{{ question }}:
{% if answer %}
- Yes
{% else %}
- No
{% endif %}

Date: {{ date }}
Signature: {{ signature }}
`,
  },
  {
    name: "MEDICAL PRESCRIPTION",
    template: `MEDICAL PRESCRIPTION

Name: {{ patient_name }}
Date: {{ date }}
Medication:
{% for medication in medications %}
- {{ medication.name }} {{ medication.dosage }} {{ medication.route }} {{ medication.frequency }}
{% endfor %}
Instructions: {{ instructions }}

Prescriber: {{ prescriber_name }}
NPI: {{ prescriber_npi }}
DEA: {{ prescriber_dea }}
`,
  },
  {
    name: "JOB APPLICATION FORM",
    template: `JOB APPLICATION FORM

Name: {{ name }}
Email: {{ email }}
Phone: {{ phone }}

Education:
{% for degree in education %}
- {{ degree.degree_type }} in {{ degree.major }} from {{ degree.institution }}{% if degree.completed %} (Completed){% endif %}
{% endfor %}

Work Experience:
{% for experience in work_experience %}
- {{ experience.job_title }} at {{ experience.company }} from {{ experience.start_date }} to {{ experience.end_date }}
  - {{ experience.job_duties }}
{% endfor %}

Skills:
{% for skill in skills %}
- {{ skill }}
{% endfor %}

{% if has_references %}
References:
{% for reference in references %}
- {{ reference.name }} - {{ reference.title }} - {{ reference.company }} - {{ reference.email }} - {{ reference.phone }}
{% endfor %}
{% endif %}

{% if has_cover_letter %}
Cover Letter:

{{ cover_letter }}
{% endif %}
`,
  },
  {
    name: "INVOICE",
    template: `INVOICE

Bill To:
{{ customer_name }}
{{ customer_address }}
{{ customer_city }}, {{ customer_state }} {{ customer_zip }}

Invoice #: {{ invoice_number }}
Invoice Date: {{ invoice_date }}
Due Date: {{ due_date }}

{% for item in items %}
{{ item.description }}
{{ item.quantity }} x {{ item.unit_price }} = {{ item.total_price }}
{% endfor %}

Subtotal: {{ subtotal }}
Tax: {{ tax }}
Total: {{ total }}

{% if paid %}
Paid on: {{ paid_on }}
{% else %}
Balance Due: {{ balance_due }}
{% endif %}
`,
  },
  {
    name: "EVENT INVITATION",
    template: `EVENT INVITATION

You are cordially invited to {{ event_name }} on {{ event_date }}.

{% if is_formal %}
Attire: Formal
{% endif %}

Location: {{ event_location }}

{% if has_special_instructions %}
Special Instructions:
{{ special_instructions }}
{% endif %}

RSVP:
{% for guest in guests %}
- {{ guest.name }}{% if guest.is_attending %} (Attending){% else %} (Not Attending){% endif %}
{% endfor %}
`,
  },
];

function getOrdinalString(num: number): string {
  const lastTwoDigits = num % 100;
  if ([11, 12, 13].includes(lastTwoDigits)) {
    return `${num}'th`;
  }

  const lastDigit = num % 10;
  switch (lastDigit) {
    case 1:
      return `${num}'st`;
    case 2:
      return `${num}'nd`;
    case 3:
      return `${num}'rd`;
    default:
      return `${num}'th`;
  }
}

function transformJsonSchemaToObject(jsonSchema: JsonSchema): AnythingObject {
  const obj: AnythingObject = {};
  if (jsonSchema.type === "object" && jsonSchema.properties) {
    for (const prop in jsonSchema.properties) {
      const propSchema = jsonSchema.properties[prop] as JsonSchema;
      if (propSchema.type === "object" && propSchema.properties) {
        obj[prop] = transformJsonSchemaToObject(propSchema);
      } else if (propSchema.type === "array" && propSchema.items) {
        if (propSchema.items.type === "object" && propSchema.items.properties) {
          obj[prop] = [
            transformJsonSchemaToObject(propSchema.items as JsonSchema),
          ];
        } else if (
          propSchema.items.type === "string" &&
          !propSchema.items.properties
        ) {
          obj[prop] = [""];
        }
      } else if (propSchema.type === "array" && propSchema.items) {
        obj[prop] = [
          transformJsonSchemaToObject(propSchema.items as JsonSchema),
        ];
      } else {
        obj[prop] = "";
      }
    }
  }
  return obj;
}

const capitalize = (str: string) =>
  str[0].toUpperCase() + str.slice(1).replaceAll("_", " ");

function getFieldName(elementName: string, parentName?: string) {
  if (isNaN(Number(elementName))) {
    return capitalize(elementName);
  } else if (parentName && parentName.endsWith("s")) {
    return capitalize(parentName).slice(0, -1);
  } else {
    return parentName || capitalize(elementName);
  }
}

export {
  transformJsonSchemaToObject,
  getOrdinalString,
  presets,
  capitalize,
  getFieldName,
};
