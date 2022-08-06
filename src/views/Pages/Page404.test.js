import React from "react";
import { createRoot } from "react-dom/client";
import Page404 from "./Page404";

it("renders without crashing", () => {
  const root = createRoot(document.createElement("div"));
  root.render(<Page404 />);
  root.unmount();
});
