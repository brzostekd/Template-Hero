import { Grid, Text } from "@chakra-ui/react";
import { getOrdinalString } from "../../utils";

type InputGroupProps = {
  elementName: string;
  keyName: string;
  textBackgroundColor: string;
};

const InputPanelGroup: React.FC<React.PropsWithChildren<InputGroupProps>> = ({
  children,
  elementName,
  keyName,
  textBackgroundColor,
}) => {
  const elToNumber = Number(elementName);
  return (
    <Grid
      rowGap={2}
      paddingX={2}
      paddingTop={4}
      marginTop={4}
      paddingBottom={2}
      borderWidth={"thin"}
      borderStyle={"solid"}
      borderColor={"blue.50"}
      borderRadius={"md"}
      className="myArray"
      key={`${keyName}-input-group`}
      position={"relative"}
    >
      <Text
        position={"absolute"}
        transform={"translate(0.5rem,-50%)"}
        backgroundColor={textBackgroundColor}
        paddingX={3}
        color={"blue.50"}
        fontWeight={"semibold"}
      >
        {!Number.isNaN(elToNumber)
          ? getOrdinalString(elToNumber) + " object"
          : String(elementName) + " array"}
      </Text>
      {children}
    </Grid>
  );
};

export { InputPanelGroup };
