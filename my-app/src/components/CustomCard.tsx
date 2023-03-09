import { Card, StyleProps } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

const CustomCard: React.FC<PropsWithChildren<StyleProps>> = ({
  children,
  ...StyleProps
}) => {
  return (
    <Card backgroundColor={"brand.100"} variant={"outline"} {...StyleProps}>
      {children}
    </Card>
  );
};

export { CustomCard };
