import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Center,
  ChakraBaseProvider,
  extendTheme,
  VStack,
} from "@chakra-ui/react";

const myBrandColor = {
  50: "#e7ebee",
  100: "#b6c3cb",
  200: "#869ca8",
  300: "#567485",
  400: "#254c62",
  500: "#0d3850",
  600: "#0c3248",
  700: "#071c28",
  800: "#030b10",
  900: "#010608",
};

const theme = extendTheme({
  colors: {
    brand: myBrandColor,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <Center
        alignContent={"center"}
        minW={"100vw"}
        minH={"100vh"}
        sx={{
          "*::-webkit-scrollbar": {
            width: "0.75rem",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "gray.200",
            borderRadius: "full",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "gray.300",
          },
          "*::-webkit-scrollbar-corner": {
            display: "none",
          },
        }}
      >
        <App />
      </Center>
    </ChakraBaseProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
