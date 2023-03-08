import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TestApp from "./components/TaskList";
import "normalize.css";
import "./index.css";
import { DataContextProvider } from "./state";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <DataContextProvider>
      <TestApp />
    </DataContextProvider>
  </React.StrictMode>
);
