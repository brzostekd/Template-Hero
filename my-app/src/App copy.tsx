// import {
//   HStack,
//   Code,
//   Button,
//   VStack,
//   Highlight,
//   Heading,
//   useToast,
//   Accordion,
//   AccordionButton,
//   AccordionIcon,
//   AccordionItem,
//   AccordionPanel,
//   Box,
//   Flex,
//   ExpandedIndex,
//   StyleProps,
// } from "@chakra-ui/react";
// import React, {
//   ChangeEvent,
//   ChangeEventHandler,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { BasicCard } from "./components/BasicCard";
// import { CustomCodeEditor } from "./components/CustomCodeEditor";
// import { StyledSelect } from "./components/StyledSelect";
// import { InputPanel } from "./features/InputPanel";
// import { AnythingObject } from "./types";
// import {
//   APIValidationError,
//   HTTPValidationError,
//   JsonSchema,
// } from "./types/api";
// import { presets } from "./utils";
// import API from "./utils/api";

// function App() {
//   const [selectedValue, setSelectedValue] = useState<string | undefined>(
//     undefined
//   );
//   const [inputSchema, setInputSchema] = useState<JsonSchema | undefined>(
//     undefined
//   );
//   const [textEditorValue, setTextEditorValue] = useState<string | undefined>(
//     undefined
//   );
//   const [usedPresetName, setUsedPresetName] = useState<string | undefined>(
//     undefined
//   );
//   const [renderedText, setRenderedText] = useState<string | undefined>(
//     undefined
//   );
//   const selectRef = useRef<HTMLSelectElement>(null);

//   useEffect(() => {
//     if (selectRef && selectRef.current) {
//       setTextEditorValueUsingPreset(selectRef.current.value);
//     }
//   }, []);
//   useEffect(() => {
//     setRenderedText(undefined);
//   }, [inputSchema]);

//   const handleSelectChange: ChangeEventHandler<HTMLSelectElement> = (
//     event: ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedValue(event.target.value);
//   };
//   function handleUsePreset(): void {
//     if (selectedValue) {
//       setTextEditorValueUsingPreset(selectedValue);
//       setUsedPresetName(selectedValue);
//     }
//   }
//   function setTextEditorValueUsingPreset(presetName: string) {
//     const preset = presets.find((element) => element.name === presetName);
//     if (preset) setTextEditorValue(preset.template);
//   }
//   const toast = useToast();
//   function handleAnalyzeTemplate(): void {
//     if (textEditorValue) {
//       API.extractScheme(textEditorValue)
//         .then((data) => {
//           console.log(data);
//           setInputSchema(data);
//         })
//         .catch((err) => showToast(err));
//     }
//   }
//   function showToast({ detail }: APIValidationError | HTTPValidationError) {
//     let msg: string, type: string;
//     if (Array.isArray(detail)) {
//       msg = detail[0].msg;
//       type = detail[0].type;
//     } else {
//       msg = detail.msg;
//       type = detail.type;
//     }
//     toast({
//       title: `Encountered a wild ${type}!`,
//       description: msg,
//       status: "error",
//       duration: 6000,
//       isClosable: true,
//     });
//   }
//   function handleRender(values: AnythingObject): void {
//     if (textEditorValue) {
//       API.render(textEditorValue, values)
//         .then((res) => {
//           setRenderedText(res);
//         })
//         .catch((err) => showToast(err));
//     }
//   }
//   const panels: Array<{
//     heading: string;
//     element: React.ReactNode & Pick<BoxProps, "maxWidth">;
//   }> = [
//     {
//       heading: "1. Jinja template:",
//       element: (
//         <BasicCard
//           key={"1"}
//           flex={"1 1"}
//           // heading={"1. Jinja template:"}
//           footerElements={[
//             <HStack
//               key={"someKey"}
//               width={"full"}
//               justifyContent={"space-between"}
//             >
//               <HStack>
//                 <StyledSelect
//                   value={selectedValue}
//                   onChange={handleSelectChange}
//                   ref={selectRef}
//                 >
//                   {presets.map((el) => (
//                     <option key={el.name} value={el.name}>
//                       {el.name}
//                     </option>
//                   ))}
//                 </StyledSelect>
//                 <Button
//                   onClick={handleUsePreset}
//                   colorScheme={
//                     selectedValue !== usedPresetName ? "cyan" : "gray"
//                   }
//                   flexShrink={0}
//                 >
//                   Use preset
//                 </Button>
//               </HStack>
//               <Button
//                 onClick={handleAnalyzeTemplate}
//                 colorScheme={"blue"}
//                 flexShrink={0}
//               >
//                 Analyze Template
//               </Button>
//             </HStack>,
//           ]}
//           cardBodyStyle={{ padding: 0 }}
//         >
//           <CustomCodeEditor
//             code={textEditorValue}
//             setCode={setTextEditorValue}
//           ></CustomCodeEditor>
//         </BasicCard>
//       ),
//     },

//     {
//       heading: "2. Inputs:",
//       element: (
//         <InputPanel
//           key={"2"}
//           onSubmit={handleRender}
//           // heading={""}
//           inputSchema={inputSchema}
//           flex={"1 0"}
//           maxWidth={"md"}
//         ></InputPanel>
//       ),
//     },
//     {
//       heading: "3. Rendered template:",
//       element: (
//         <BasicCard key={"3"} flex={"1 1"} heading={"3. Rendered template:"}>
//           <Code
//             backgroundColor={"gray.800"}
//             color="white"
//             fontFamily={"Lato, sans-serif"}
//             whiteSpace={"pre"}
//           >
//             {renderedText}
//           </Code>
//         </BasicCard>
//       ),
//     },
//   ];
//   const [accordIndex, setAccordIndex] = useState<number>(0);
//   function handleAccordIndexChange(index: number | number[]) {
//     if (!Array.isArray(index)) {
//       setAccordIndex(index);
//       console.log(index);
//     }
//   }
//   return (
//     <VStack maxH={"inherit"} backgroundColor={"gray.900"} height={"100vh"}>
//       {/* <HStack
//         width={"full"}
//         spacing={"2"}
//         align={"stretch"}
//         justify={"start"}
//         alignItems={"center"}
//         backgroundColor={"gray.800"}
//         padding={4}
//       >
//         <Heading lineHeight="tall" color={"cyan.200"} userSelect={"none"}>
//           <Highlight
//             query="Hero"
//             styles={{
//               px: "2",
//               py: "1",
//               rounded: "xl",
//               bg: "cyan.200",
//               color: "gray.800",
//             }}
//           >
//             Template Hero
//           </Highlight>
//         </Heading>
//       </HStack>
//       <HStack
//         spacing={"2"}
//         align={"stretch"}
//         width={"full"}
//         minH={"1rem"}
//         flexGrow={"1"}
//         backgroundColor={"gray.900"}
//       >
//         {panels.map((el) => {
//           return el.element;
//         })}
//       </HStack> */}
//       <Accordion
//         as={Flex}
//         flexDirection="column"
//         spacing={"2"}
//         align={"stretch"}
//         width={"full"}
//         minH={"1rem"}
//         flexGrow={"1"}
//         defaultIndex={0}
//         onChange={handleAccordIndexChange}
//         index={accordIndex}
//       >
//         {panels.map((el, i) => {
//           el.maxWidth;
//           return (
//             <AccordionItem
//               as={Flex}
//               width={"full"}
//               // height="1rem"
//               flexDirection="column"
//               // align={"stretch"}
//               // minH={"1rem"}
//               flexGrow={accordIndex == i ? "1" : undefined}
//               flexShrink={accordIndex != i ? "0" : "1"}
//               minH="1rem"
//               // maxH={"full"}
//               // height="2rem"
//               key={String(i)}
//             >
//               <h2>
//                 <AccordionButton
//                   backgroundColor={"gray.800"}
//                   color={"white"}
//                   flexShrink={0}
//                   // sx={{
//                   //   ":hover": {
//                   //     background: "revert !",
//                   //   },
//                   // }}
//                 >
//                   <Box as="span" flex="1" textAlign="left">
//                     {el.heading}
//                   </Box>
//                   <AccordionIcon />
//                 </AccordionButton>
//               </h2>
//               <AccordionPanel height={"full"} padding={"0px !"}>
//                 {el.element}
//               </AccordionPanel>
//             </AccordionItem>
//           );
//         })}
//       </Accordion>
//     </VStack>
//   );
// }

export default {};
