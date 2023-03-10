import React, { useEffect, useRef, useState } from "react";
import { Button, CardProps, Grid } from "@chakra-ui/react";
import { Field, FieldArray, Formik, FormikProps, FormikValues } from "formik";
import { StyledTextarea } from "../../components/StyledTextarea";
import { AnythingObject } from "../../types";
import { JsonSchema } from "../../types/api";
import { getFieldName, transformJsonSchemaToObject } from "../../utils";
import { InputPanelGroup } from "./InputPanelGroup";
import { BasicCard } from "../../components/BasicCard";

interface RenderFieldsProps {
  values: AnythingObject;
  textBackgroundColor: string;
  parentName?: string;
}

function renderFields({
  values,
  parentName,
  textBackgroundColor,
}: RenderFieldsProps) {
  return Object.entries(values).flatMap(([elementName, value]) => {
    const keyName = `${parentName ?? ""}${
      parentName ? "." + elementName : elementName
    }`;

    if (Array.isArray(value)) {
      return [
        <InputPanelGroup
          key={`${keyName}-input-group`}
          elementName={elementName}
          keyName={keyName}
          textBackgroundColor={textBackgroundColor}
        >
          <FieldArray name={keyName}>
            {(arrayHelpers) => (
              <Grid rowGap={2} width={"full"}>
                {renderFields({
                  values: value,
                  parentName: keyName,
                  isParentAnArray: Array.isArray(value),
                  textBackgroundColor,
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
                    colorScheme={"blackAlpha"}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      if (value.length > 1)
                        arrayHelpers.remove(value.length - 1);
                    }}
                    isDisabled={value.length <= 1}
                    colorScheme={"blackAlpha"}
                  >
                    Removed
                  </Button>
                </Grid>
              </Grid>
            )}
          </FieldArray>
        </InputPanelGroup>,
      ];
    } else if (typeof value === "object" && value !== null) {
      return [
        <InputPanelGroup
          key={`${keyName}-input-group`}
          elementName={elementName}
          keyName={keyName}
          textBackgroundColor={textBackgroundColor}
        >
          {renderFields({
            values: value,
            parentName: keyName,
            isParentAnArray: Array.isArray(value),
            textBackgroundColor,
          } as unknown as RenderFieldsProps)}
        </InputPanelGroup>,
      ];
    } else if (typeof value === "string") {
      return [
        <Field
          key={keyName}
          as={StyledTextarea}
          name={keyName}
          isRequired={false}
          placeholder={getFieldName(elementName, parentName)}
        />,
      ];
    }

    return [];
  });
}

type props = {
  onSubmit: (values: any) => any;
  heading?: string;
  inputSchema?: JsonSchema | undefined;
};
const InputPanel: React.FC<Omit<CardProps, "onSubmit"> & props> = ({
  inputSchema,
  onSubmit,
  heading,
  backgroundColor,
  bgColor,
  ...StyleProps
}) => {
  const [inputObject, setInputObject] = useState<AnythingObject | undefined>(
    undefined
  );
  heading ??= "Inputs:";
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  useEffect(() => {
    if (inputSchema) {
      setInputObject(transformJsonSchemaToObject(inputSchema));
    } else setInputObject(undefined);
  }, [inputSchema]);
  const BGColor = backgroundColor ?? bgColor ?? "gray.700";
  return (
    <BasicCard
      heading={heading}
      backgroundColor={BGColor}
      {...StyleProps}
      footerElements={[
        <Button
          key={"Render"}
          onClick={() =>
            formikRef && formikRef.current
              ? formikRef.current.handleSubmit()
              : null
          }
        >
          Render
        </Button>,
      ]}
    >
      {inputObject ? (
        <Formik
          innerRef={formikRef}
          initialValues={inputObject}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {(props) => {
            return (
              <form
              // onSubmit={props.handleSubmit}
              >
                <Grid rowGap={2}>
                  {renderFields({
                    values: props.values,
                    textBackgroundColor: BGColor,
                  } as unknown as RenderFieldsProps)}
                </Grid>
              </form>
            );
          }}
        </Formik>
      ) : null}
    </BasicCard>
  );
};

export { InputPanel };
