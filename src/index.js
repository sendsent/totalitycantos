import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CantosText from "./CantosText";
import { CantoContext } from "./context/cantosReducer";
import reportWebVitals from "./reportWebVitals";
import ContextState from "./context/ContextState";

ReactDOM.render(
  <React.StrictMode>
    <ContextState>
      <CantoContext>
        <CantosText />
      </CantoContext>
    </ContextState>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
