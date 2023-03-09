import {
  Flex,
  HStack,
  VStack,
  Text,
  Code,
  Button,
  Input,
  ComponentWithAs,
  InputProps,
  CardBody,
  CardFooter,
  Box,
  Grid,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { Field, FieldArray } from "formik";
import { useEffect, useState } from "react";
import { CustomCard } from "./components/CustomCard";
import { CustomCodeEditor } from "./components/CustomCodeEditor";
import { AnythingObject } from "./types";
import { JsonSchema } from "./types/api";
import { transformJsonSchemaToObject } from "./utils";
import API from "./utils/api";

const styledInput: React.FC<
  React.PropsWithChildren & ComponentWithAs<"input", InputProps>
> = ({ children, ...other }) => {
  return (
    <Input variant={"filled"} {...other}>
      {children}
    </Input>
  );
};

interface RenderFieldsProps {
  values: AnythingObject;
  parentName?: string;
}
function renderFields({ values, parentName }: RenderFieldsProps) {
  return Object.entries(values).flatMap(([key, value]) => {
    const keyName = `${parentName ?? ""}${parentName ? "." + key : key}`;

    if (Array.isArray(value)) {
      return [
        <Grid
          rowGap={2}
          paddingX={1}
          marginX={1}
          paddingTop={4}
          marginTop={4}
          paddingBottom={2}
          borderWidth={"medium"}
          borderStyle={"solid"}
          borderColor={"brand.200"}
          borderRadius={"md"}
          className="myArray"
          key={`${keyName}-box`}
          // align={"start"}
          // width={"full"}
          position={"relative"}
        >
          <Text
            position={"absolute"}
            transform={"translate(0.5rem,-50%)"}
            backgroundColor={"brand.100"}
            paddingX={3}
            color={"brand.700"}
            fontWeight={"semibold"}
          >{`${String(key).toUpperCase()}${
            !Number.isNaN(Number(key)) ? "'th" : ""
          } array`}</Text>
          <FieldArray name={keyName}>
            {(arrayHelpers) => (
              <Grid rowGap={2} width={"full"}>
                {renderFields({
                  values: value,
                  parentName: keyName,
                } as unknown as RenderFieldsProps)}
                <Grid width={"full"} templateColumns={"1fr 1fr"} columnGap={2}>
                  <Button
                    onClick={() => {
                      if (value.length > 0)
                        arrayHelpers.insert(
                          value.length - 1,
                          value[value.length - 1]
                        );
                    }}
                  >
                    {" "}
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      if (value.length > 1)
                        arrayHelpers.remove(value.length - 1);
                    }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            )}
          </FieldArray>
        </Grid>,
      ];
    } else if (typeof value === "object" && value !== null) {
      return [
        <Grid
          rowGap={2}
          paddingX={1}
          marginX={1}
          paddingTop={4}
          marginTop={4}
          paddingBottom={2}
          borderWidth={"medium"}
          borderStyle={"solid"}
          borderColor={"brand.200"}
          borderRadius={"md"}
          className="myArray"
          key={`${keyName}-box`}
          // align={"start"}
          // width={"full"}
          position={"relative"}
        >
          <Text
            position={"absolute"}
            transform={"translate(0.5rem,-50%)"}
            backgroundColor={"brand.100"}
            paddingX={3}
            color={"brand.700"}
            fontWeight={"semibold"}
          >{`${String(key).toUpperCase()}${
            !Number.isNaN(Number(key)) ? "'th" : ""
          } object`}</Text>

          {renderFields({
            values: value,
            parentName: keyName,
          } as unknown as RenderFieldsProps)}
        </Grid>,
      ];
    } else if (typeof value === "string") {
      return [
        <Field
          key={keyName}
          as={Input}
          name={keyName}
          placeholder={key[0].toUpperCase() + key.slice(1).replaceAll("_", " ")}
          value={value}
          variant={"filled"}
          // onChange={(e: Event) => {
          //   // handle field change here
          // }}
        />,
      ];
    }

    return [];
  });
}

function App() {
  const [jsonSchema, setJsonSchema] = useState<JsonSchema | undefined>(
    undefined
  );
  const [formData, setFormData] = useState<AnythingObject | undefined>(
    undefined
  );
  const [res, setRes] = useState<string | undefined>(undefined);
  const [code, setCode] = useState(
    `
    NOTARY DOCUMENT

{{ title }}

This document certifies that on {{ date }}, the following individuals appeared before me, a notary public, and signed the following agreement:

{% for signer in signers %}
Signer:
Name: {{ signer.name }}
Address: {{ signer.address }}
Signature: {{ signer.signature }}
{% endfor %}

{% if witnesses %}
Witnesses:
{% for witness in witnesses %}
Name: {{ witness.name }}
Address: {{ witness.address }}
Signature: {{ witness.signature }}
{% endfor %}
{% endif %}

{% if notary %}
Notary:
Name: {{ notary.name }}
Commission Number: {{ notary.commission_number }}
{% endif %}

This agreement is binding and enforceable under the laws of {{ jurisdiction }}.

{% if additional_terms %}
Additional Terms:
{{ additional_terms }}
{% endif %}

{% if expiration_date %}
This agreement expires on {{ expiration_date }}.
{% endif %}

{{ notary_seal }}

    
`
  );

  {
    // <h1>Welcome to {{ teacher.name }}'s {{ teacher.subject }} class!</h1>
    // {% if students %}
    //   <h2>Students:</h2>
    //   <ul>
    //   {% for student in students %}
    //     <li>{{ student }}</li>
    //   {% endfor %}
    //   </ul>
    // {% else %}
    //   <p>No students in the class yet.</p>
    // {% endif %}
    // {% if classes %}
    //   <h2>Classes:</h2>
    //   <ul>
    //   {% for class in classes %}
    //     <li>{{ class.name }}:</li>
    //     {% if class.students %}
    //       <ul>
    //       {% for student in class.students %}
    //         <li>{{ student }}</li>
    //       {% endfor %}
    //       </ul>
    //     {% else %}
    //       <p>No students in this class yet.</p>
    //     {% endif %}
    //   {% endfor %}
    //   </ul>
    // {% else %}
    //   <p>No classes in the school yet.</p>
    // {% endif %}
    /* <h1>Welcome to {{ teacher.name }}'s {{ teacher.subject }} class!</h1>

{% if students %}
  <h2>Students:</h2>
  <ul>
  {% for student in students %}
    <li>{{ student }}</li>
  {% endfor %}
  </ul>
{% else %}
  <p>No students in the class yet.</p>
{% endif %}

{% if classes %}
  <h2>Classes:</h2>
  <ul>
  {% for class in classes %}
    <li>{{ class.name }}:</li>
    {% if class.students %}
      <ul>
      {% for student in class.students %}
        <li>{{ student }}</li>
      {% endfor %}
      </ul>
    {% else %}
      <p>No students in this class yet.</p>
    {% endif %}
  {% endfor %}
  </ul>
{% else %}
  <p>No classes in the school yet.</p>
{% endif %} */
  }
  useEffect(() => {
    API.extractScheme(code)
      .then((data) => {
        console.log(data);
        setJsonSchema(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    let data = {};
    if (jsonSchema) {
      setFormData(transformJsonSchemaToObject(jsonSchema));
      // setFormData({
      //   students: ["Janusz", "dupsko"],
      //   classes: [
      //     {
      //       students: [""],
      //       name: "",
      //     },
      //     {
      //       students: [""],
      //       name: "",
      //     },
      //   ],
      //   teacher: {
      //     subject: "Dupass",
      //     name: "dddup",
      //   },
      // });
    }
  }, [jsonSchema]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  function onSubmit(values: AnythingObject): void {
    console.log(values);
    API.render(code, values).then((res) => {
      console.log(res);
      setRes(res);
    });
  }
  return (
    <VStack>
      <Flex bgColor={"red"} height={"10"} width={"auto"}>
        awdawd
      </Flex>
      <HStack spacing={"2"}>
        <CustomCard width={"sm"} height={"xl"}>
          <CustomCodeEditor code={code} setCode={setCode}></CustomCodeEditor>
        </CustomCard>
        <CustomCard
          width={"sm"}
          height={"xl"}
          // header={"sadasdda"}
          // buttonText={"Click Me!"}
          // OnClick={() => {
          //   console.log("Click!");
          // }}
        >
          <CardBody
            overflowY={"scroll"}
            borderBottomWidth={"medium"}
            borderBottomStyle={"solid"}
            borderBottomColor={"brand.200"}
          >
            {formData ? (
              <Formik initialValues={formData} onSubmit={onSubmit}>
                {(props) => {
                  return (
                    <form onSubmit={props.handleSubmit}>
                      <Grid rowGap={2}>
                        {renderFields({
                          values: props.values,
                        } as unknown as RenderFieldsProps)}
                        <Button type="submit">Submit</Button>
                      </Grid>
                    </form>
                  );
                }}
              </Formik>
            ) : null}
          </CardBody>
          <CardFooter justify={"end"}>
            <Button>Hello</Button>
          </CardFooter>
        </CustomCard>
        <CustomCard width={"sm"} height={"xl"} overflowY={"auto"}>
          <Code backgroundColor={"inherit"} whiteSpace={"pre"}>
            {res}
          </Code>
        </CustomCard>
      </HStack>
    </VStack>
  );
}

export default App;
