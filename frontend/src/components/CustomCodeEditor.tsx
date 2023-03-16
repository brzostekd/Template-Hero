import { Flex, FlexProps, useToken } from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import React from "react";
type props = {
  code: string | undefined;
  setCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  backgroundColor?: string;
  fontSize?: string;
};
const CustomCodeEditor: React.FC<props & FlexProps> = ({
  code,
  setCode,
  backgroundColor = "gray.800",
  fontSize = 14,
  ...rest
}) => {
  const color = useToken("colors", backgroundColor, "black");
  return (
    <Flex
      sx={{
        ".token.punctuation, .token.attr-name, .token.attr-value": {
          color: "gray.200!",
        },
        ".token.delimiter.punctuation": { color: "#179fff!" },
        ".token.tag.keyword, .keyword": { color: "#c586c0!" },
        ".token.tag": { color: "#4ec9b0!" },
      }}
      flexGrow={1}
      overflowY={"auto"}
      {...rest}
      height="full"
    >
      <CodeEditor
        value={code}
        language="jinja2"
        data-color-mode="dark"
        placeholder="Please write your jinja template here."
        onChange={(evn) => setCode(evn.target.value)}
        style={{
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          fontSize: fontSize,
          height: "100%",
          width: "100%",
          borderRadius: "inherit",
          overflowY: "auto",
          backgroundColor: color,
        }}
      />
    </Flex>
  );
};

export { CustomCodeEditor };
