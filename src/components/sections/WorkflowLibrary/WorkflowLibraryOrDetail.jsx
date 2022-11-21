import { useState } from "react";

import LayoutFlow from "../LayoutFlow/LayoutFlow.jsx";
import WorkflowLibrary from "./WorkflowLibrary";
//TODO make this zoom into a single workflow to support detail
export default function WorkflowLibraryOrDetail() {
  const [active, setActive] = useState("library");

  return (
    <>
      {active === "detail" ? <LayoutFlow /> : null}
      {active === "library" ? <WorkflowLibrary /> : null}
    </>
  );
}
