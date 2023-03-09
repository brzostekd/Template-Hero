import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  StyleProps,
  ThemingProps,
} from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { CustomCard } from "./CustomCard";
type props = {
  header?: string;
  buttonText?: string;
  OnClick?: () => void;
};

const BasicCard: React.FC<
  PropsWithChildren<StyleProps & ThemingProps<"Card"> & props>
> = ({ children, header, buttonText, OnClick, ...StyleProps }) => {
  return (
    <CustomCard
      backgroundColor={"brand.100"}
      variant={"outline"}
      {...StyleProps}
    >
      {header ? (
        <CardHeader>
          <Heading size={"md"}>{header}</Heading>
        </CardHeader>
      ) : null}
      <CardBody>{children}</CardBody>
      {buttonText ? (
        <CardFooter justify={"end"}>
          <Button onClick={OnClick}>{buttonText}</Button>
        </CardFooter>
      ) : null}
    </CustomCard>
  );
};

export { BasicCard };
