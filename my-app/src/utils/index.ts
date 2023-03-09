import { AnythingObject } from "../types";
import { JsonSchema } from "../types/api";

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

export { transformJsonSchemaToObject };
