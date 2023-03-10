type TemplateBody = {
  template: string;
};

interface JsonSchema extends TemplateBody {
  [key: string]: Record<string, any> | Array<string> | string | undefined;
  type: string;
  properties: Record<string, any>;
  required: Array<string>;
  title?: string;
  items?: Record<string, any>;
}

interface RenderBody extends TemplateBody {
  input: Record<string, any>;
}
type APIException = {
  msg: string;
  type: string;
};
type APIValidationError = {
  detail: APIException;
};

type HTTPValidationError = {
  detail: Array<ValidationError>;
};

type ValidationError = {
  loc: string | number;
  msg: string;
  type: string;
};

export type {
  TemplateBody,
  JsonSchema,
  RenderBody,
  APIException,
  HTTPValidationError,
  APIValidationError,
};
