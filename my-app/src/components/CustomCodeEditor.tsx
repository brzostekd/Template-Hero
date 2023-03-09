import { Flex, useToken } from "@chakra-ui/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import React, { useEffect, useRef } from "react";
type props = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor?: string;
  fontSize?: string;
};
const CustomCodeEditor: React.FC<props> = ({
  code,
  setCode,
  backgroundColor = "brand.900",
  fontSize = 14,
}) => {
  const color = useToken("colors", backgroundColor, "black");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      // const elements = ref.current.css
      // parentElement.querySelectorAll(
      //   ".delimiter.punctuation"
      // );
      // console.log(ref.current.parentNode);
      // console.log(elements);
      // elements.forEach((el) => {
      //   (el as HTMLSpanElement).style.color = "red";
      // });
    }
  }, []);
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
      borderRadius={"inherit"}
      overflowY={"clip"}
    >
      <CodeEditor
        value={code}
        ref={ref}
        // ref={textRef}
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
          overflowY: "scroll",
        }}
      />
    </Flex>
  );
};

export { CustomCodeEditor };
