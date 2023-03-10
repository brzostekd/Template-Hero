import { TextareaProps, Textarea } from "@chakra-ui/react";
import { None } from "framer-motion";
import { useRef, useEffect } from "react";

const StyledTextarea: React.FC<React.PropsWithChildren & TextareaProps> = ({
  children,
  ...other
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.style.minHeight = "50px";
    }
  }, []);
  return (
    <Textarea
      ref={ref}
      variant={"filled"}
      sx={{
        ":focus-visible": {
          background: "revert !",
        },
      }}
      {...other}
    >
      {children}
    </Textarea>
  );
};
export { StyledTextarea };
