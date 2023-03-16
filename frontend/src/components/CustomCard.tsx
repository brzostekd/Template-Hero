import { Card, CardHeader, CardProps, Heading } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
type props = {
  heading?: string;
};
const CustomCard: React.FC<PropsWithChildren<CardProps> & props> = ({
  children,
  heading,
  ...StyleProps
}) => {
  return (
    <Card
      backgroundColor={"blue.800"}
      variant={"filled"}
      borderRadius={0}
      {...StyleProps}
    >
      {heading ? (
        <CardHeader>
          <Heading color={"white"}>{heading}</Heading>
        </CardHeader>
      ) : null}
      {children}
    </Card>
  );
};

export { CustomCard };
