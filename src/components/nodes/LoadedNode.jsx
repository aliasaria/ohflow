import { React, useCallback } from "react";
import { Handle, Position } from "react-flow-renderer";

import { loadedNodes, loadedNodesTable } from "./index.jsx";

import { Grid, Group } from "@mantine/core";

function BottomHandles({ outputNodesArray }) {
  let handles = JSON.parse(outputNodesArray);
  if (handles.length == 0) {
    return;
  }

  if (handles.length > 1) {
    return (
      <>
        <Group
          position="center"
          style={{
            paddingTop: 10,
            fontSize: 11,
            fontWeight: 300,
            paddingBottom: 0,
            marginBottom: -6,
          }}
        >
          <div style={{ color: "#2D3748", width: "30px" }}>
            {handles[0] || "True"}
          </div>
          <div style={{ color: "#2D3748", width: "30px" }}>
            {handles[1] || "False"}
          </div>
        </Group>
        <Handle
          type="source"
          position={Position.Bottom}
          id="a"
          style={{ left: "30%" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={{ left: "70%" }}
        />
      </>
    );
  } else {
    return (
      <Handle
        type="source"
        position="bottom"
        // isValidConnection={isValidConnection}
      />
    );
  }
}

function LoadedNode({ data, id, type, ...props }) {
  return (
    <div style={JSON.parse(loadedNodesTable[type].css)}>
      {type != "comment" ? (
        <Handle
          type="target"
          position="top"
          // isValidConnection={isValidConnection}
        />
      ) : (
        "" //hide the top handle if this is a comment. This shouldn't be hard coded but should be defined by the node  @TODO
      )}
      <div>{data.label}</div>

      <BottomHandles outputNodesArray={loadedNodesTable[type].outputNodes} />
    </div>
  );
}

export const editableFields = (type) => {
  var fields = [];
  if (loadedNodesTable[type]?.editableFields != undefined)
    var fields = JSON.parse(loadedNodesTable[type]?.editableFields);
  return fields;
};

export default LoadedNode;
