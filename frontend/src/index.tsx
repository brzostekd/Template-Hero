import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import {
  Box,
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
  initialColorMode: "dark",
  useSystemColorMode: false,
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
      <Box
        maxW={"100vw"}
        maxH={"100vh"}
        overflow="hidden"
        sx={{
          "*::-webkit-scrollbar": {
            width: "0.5rem",
            height: "0.5rem",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "gray.500",
            borderRadius: "full",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "gray.400",
          },
          "*::-webkit-scrollbar-corner": {
            display: "none",
          },
        }}
      >
        <App />
      </Box>
    </ChakraBaseProvider>
  </React.StrictMode>
);
reportWebVitals();
