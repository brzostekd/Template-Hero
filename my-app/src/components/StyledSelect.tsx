import { Select, SelectProps } from "@chakra-ui/react";
import { forwardRef } from "react";

const StyledSelect = forwardRef<
  HTMLSelectElement,
  React.PropsWithChildren<SelectProps>
>(({ children, ...other }, forwardedRef) => {
  return (
    <Select
      variant={"filled"}
      sx={{
        ":focus-visible": {
          background: "revert !",
        },
      }}
      ref={forwardedRef}
      {...other}
    >
      {children}
    </Select>
  );
});

export { StyledSelect };
