import { useState } from "react";
import NavbarSimple from "./Navigation";
import LayoutFlow from "./components/sections/LayoutFlow/LayoutFlow.jsx";
import Triggers from "./components/sections/Triggers/Triggers";
import WorkflowLibraryOrDetail from "./components/sections/WorkflowLibrary/WorkflowLibraryOrDetail";
import NodeLibrary from "./components/sections/NodeLibrary/NodeLibrary";
import Logs from "./components/sections/Logs/Logs";
import Debug from "./components/sections/Debug/Debug";

export default function App() {
  const [active, setActive] = useState("Workflows");

  return (
    <div style={{ display: "flex" }}>
      <NavbarSimple active={active} onChange={setActive} />
      <div style={{ flex: "1 0 auto" }}>
        {active === "Workflows" ? <LayoutFlow /> : null}
        {active === "Workflow Templates" ? <WorkflowLibraryOrDetail /> : null}
        {active === "Workflow Triggers" ? <Triggers /> : null}
        {active === "Node Library" ? <NodeLibrary /> : null}
        {active === "Logs" ? <Logs /> : null}
        {active === "Debug" ? <Debug /> : null}
      </div>
    </div>
  );
}
