import React from "react";
import ReactDOM from "react-dom";
import { CSSReset, theme, ThemeProvider } from "@chakra-ui/core";
import App from "./App";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CSSReset />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
