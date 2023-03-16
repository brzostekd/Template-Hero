import { AnythingObject } from "../types";
import { JsonSchema } from "../types/api";

type Preset = {
  name: string;
  template: string;
};

const presets: Preset[] = [
  {
    name: "TUTORIAL",
    template: `{#-
RULES AND LIMITATIONS
=====================
1. The array of objects cannot be empty.
2. All variables must be strings.
3. All variables can be left empty, which will act as a boolean value.
-#}

Example
=====================
{% if cats[0].name %}
Found {{ cats|length }} cat{%- if cats|length > 1 %}s{% endif %}.

  {%- for cat in cats %}
  - Name: {{ cat.name }}
  - Age: {{ cat.age }}
  {%- endfor %}
{%- else %}
Error 404 - no cats found.
{%- endif %}

{#-
Click the "Analyze Template" button to infer the data required by this template.
Then try the following:
- Leave every field empty and click "Render".
- Fill out fields for one (0th) cat object and click "Render" again.
- Click "Add" to add another cat object to the array, then see the result.

Important!
You can explore other presets, but be sure to click the "Use preset" button to properly overwrite the current template. This prevents any accidental loss of your current work.
-#}
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
