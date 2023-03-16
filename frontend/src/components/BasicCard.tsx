import {
  CardBody,
  CardBodyProps,
  CardFooter,
  CardHeader,
  Heading,
  StyleProps,
  ThemingProps,
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { CustomCard } from "./CustomCard";
type props = {
  heading?: string;
  buttonText?: string;
  OnClick?: () => void;
  footerElements?: Array<JSX.Element>;
  cardBodyStyle?: CardBodyProps;
};

const BasicCard: React.FC<
  PropsWithChildren<StyleProps & ThemingProps<"Card"> & props>
> = ({
  children,
  heading,
  buttonText,
  OnClick,
  footerElements,
  backgroundColor,
  cardBodyStyle,
  ...StyleProps
}) => {
  backgroundColor ??= "gray.800";
  return (
    <CustomCard
      backgroundColor={backgroundColor}
      overflowY={"auto"}
      maxHeight={"full"}
      {...StyleProps}
    >
      {heading ? (
        <CardHeader>
          <Heading size={"xl"} color={"white"} userSelect="none">
            {heading}
          </Heading>
        </CardHeader>
      ) : null}
      <CardBody
        border={"thin solid"}
        borderColor={"whiteAlpha.500"}
        borderRadius="md"
        margin={2}
        overflowY={"auto"}
        // overflowY={"scroll"}
        maxHeight={"full"}
        {...(cardBodyStyle ?? null)}
      >
        {children}
      </CardBody>
      {footerElements ? (
        <CardFooter justify={"end"}>{footerElements}</CardFooter>
      ) : null}
    </CustomCard>
  );
};

export { BasicCard };
