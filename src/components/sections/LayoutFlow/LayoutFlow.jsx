import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import ReactFlow, {
  Background,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Controls,
  updateEdge,
  ControlButton,
  applyEdgeChanges,
  applyNodeChanges,
} from "react-flow-renderer";

import {
  Button,
  Title,
  Modal,
  JsonInput,
  Group,
  Space,
  Text,
  ActionIcon,
} from "@mantine/core";

import dagre from "dagre";

import { nodeTypes, loadedNodesTable } from "../../nodes/index.jsx";

import NodeDetailsModal from "./NodeDetailsModal.jsx";

import NodeDrawer from "./NodeDrawer.jsx";

import { v4 as uuidv4 } from "uuid";

//import HTMLReactParser from "html-react-parser";
import { IconHierarchy3, IconCode, IconArrowLeft } from "@tabler/icons";

import "./../../../index.css";

import ReactPrismjs from "@uiw/react-prismjs";
import "prismjs/components/prism-json";

const getNodeId = () => uuidv4();

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// const nodeWidth = 172;
// const nodeHeight = 50;

// This function lays out the nodes using the dagre
// layout engine
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "longest-path", //network-simplex, tight-tree or longest-path
    ranksep: 50,
  });

  nodes.forEach((node) => {
    if (
      (node.hasOwnProperty("draggable") && node.draggable == false) ||
      (node.hasOwnProperty("autoMove") && node.autoMove == false)
    ) {
      // do nothing
    } else {
      dagreGraph.setNode(node.id, { width: node.width, height: node.height });
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    if (typeof nodeWithPosition !== "undefined") {
      node.position = {
        x: nodeWithPosition.x - node.width / 2,
        y: nodeWithPosition.y - node.height / 2,
      };
    }

    return node;
  });

  return { nodes, edges };
};

let initialEdges = [];
let initialNodes = [];

const readWorkflow = (w) => {
  initialEdges = [];
  initialNodes = [];
  for (const n of w) {
    const l = initialNodes.push({
      id: n.id,
      data: n.data,
      position: n.position || { x: 0, y: 0 },
      style: n.style,
      type: n.type,
      draggable: n.hasOwnProperty("draggable") ? n.draggable : true,
      autoMove: n.hasOwnProperty("autoMove") ? n.autoMove : true,
    });

    //edit the new node to allow for HTML formatting in the label object
    //initialNodes[l - 1].data.label = HTMLReactParser(n.data.label);

    if (n.hasOwnProperty("out")) {
      if (n.out.length == 1) {
        initialEdges.push({
          id: getNodeId(),
          source: n.id,
          target: n.out[0],
          type: "default",
          animated: true,
        });
      }

      //This is a true false node
      if (n.out.length == 2) {
        initialEdges.push(
          {
            id: getNodeId() + "a",
            source: n.id,
            target: n.out[0],
            sourceHandle: "a",
            type: "default",
            animated: true,
          },
          {
            id: getNodeId() + "b",
            source: n.id,
            target: n.out[1],
            sourceHandle: "b",
            type: "default",
            animated: true,
          }
        );
      }
    }
  }
};

function convertNodesToSaveableJSON(flow) {
  let nodesToSave = [];

  //First save all the nodes, with no edges
  for (const n of flow.nodes) {
    //console.log(n);

    const l = nodesToSave.push({
      id: n.id,
      data: n.data,
      position: n.position || { x: 0, y: 0 },
      style: n.style,
      type: n.type,
      draggable: n.hasOwnProperty("draggable") ? n.draggable : true,
      autoMove: n.hasOwnProperty("autoMove") ? n.autoMove : true,
      out: [],
    });
  }

  // Now insert the edges into the right places on each node
  for (const e of flow.edges) {
    //console.log(e);

    //find the node that this edge is starting from
    var nodeIndex = nodesToSave.findIndex(({ id }) => id == e.source);

    //first check is this is a dual output node, then handle differently:
    if (e.hasOwnProperty("sourceHandle")) {
      if (e.sourceHandle == "a") {
        nodesToSave[nodeIndex].out[0] = e.target;
      } else if (e.sourceHandle == "b") {
        nodesToSave[nodeIndex].out[1] = e.target;
      }
    } else {
      //it is a single output node and we map the target to the ports.out field
      nodesToSave[nodeIndex].out[0] = e.target;
    }
  }

  return nodesToSave;
}

function saveToAPI(flow) {
  let nodesToSave = convertNodesToSaveableJSON(flow);
  //We will use this array to store the nodes in a format that we can save

  // console.log(nodesToSave);

  fetch("http://localhost:3001/tenant/1/workflow/save/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nodesToSave),
  });
}

function doesSourceNodeAlreadyHaveTarget(
  source,
  sourceHandle,
  target,
  targetHandle,
  edges
) {
  //count the number of edges coming out of
  // console.log(source);
  // console.log("is connecting to");
  // console.log(target);
  // console.log(edges);

  let count = 0;
  edges.forEach((edge) => {
    if (edge.source == source) {
      if (edge.hasOwnProperty("sourceHandle")) {
        if (edge.sourceHandle == sourceHandle) {
          count++;
        }
      } else {
        count++;
      }
    }
  });

  // console.log(count);

  if (count > 0) return true;
  else return false;
}

//readWorkflow(workflowNodes);
//console.log(initialNodes)
// const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//   initialNodes,
//   initialEdges
// );

const LayoutFlow = ({ displayOnly = false }) => {
  const edgeUpdateSuccessful = useRef(true);

  const [activeNode, setActiveNode] = useState(null);

  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [nodeTemplates, setNodeTemplates] = useState([]);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(
    (changes) => {
      // console.log("node change");
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => {
      return setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );
  const [rfInstance, setRfInstance] = useState(null);

  //Set true to display the Code modal
  const [codeIsDisplayed, setCodeIsDisplayed] = useState(false);

  //Displays "usaved changes" to the screen when set to true
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      // console.log(JSON.stringify(flow));
      saveToAPI(flow);
    }
    setUnsavedChanges(false);
  }, [rfInstance]);

  //Called when you try to connect two nodes with an edge
  const onConnect = useCallback(
    (params) => {
      if (
        doesSourceNodeAlreadyHaveTarget(
          params.source,
          params.sourceHandle,
          params.target,
          params.targetHandle,
          rfInstance.getEdges()
        )
      )
        return; //this quits before the new edges is drawn, preventing the edges
      setEdges((eds) => {
        setUnsavedChanges(true);

        return addEdge(
          { ...params, type: ConnectionLineType.Bezier, animated: true },
          eds
        );
      });
    },
    [rfInstance]
  );

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      setUnsavedChanges(true);
    },
    [nodes, edges]
  );

  const onAdd = useCallback(
    (type) => {
      const newNode = {
        id: getNodeId(),
        data: { label: type, code: loadedNodesTable[type].code },
        position: {
          x: 0,
          y: 0,
        },
        type: type,
        style: {},
        autoMove: false,
      };
      setNodes((nds) => nds.concat(newNode));
      setUnsavedChanges(true);
    },
    [setNodes]
  );

  const onNodeDelete = (params) => {
    setNodes((nds) => nds.filter((node) => node.id !== activeNode.id));
    setUnsavedChanges(true);
    onModalClose();
  };

  const onEditActiveNode = (event) => {
    console.log(event);
    // event.preventDefault(event);
    let newTitle = event.label;
    //console.log(newTitle);
    //activeNode.data.label = "ha";
    setNodes((nds) =>
      nds.map((node) => {
        //console.log(node.id);
        if (node.id === activeNode.id) {
          // as per https://reactflow.dev/docs/examples/nodes/update-node/ we must
          // create a new data object or the update doesn't get triggered
          node.data = {
            ...node.data,
            ...event,
          };
        }

        return node;
      })
    );
    setUnsavedChanges(true);
    onModalClose();
  };

  const handleActiveNodeLockToggle = () => {
    setNodes((nds) =>
      nds.map((node) => {
        //console.log(node.id);
        if (node.id === activeNode.id) {
          // as per https://reactflow.dev/docs/examples/nodes/update-node/ we must
          // create a new data object or the update doesn't get triggered
          node.isLocked = !node.isLocked;
          activeNode.isLocked = node.isLocked;
          //console.log(node);
        }
        setUnsavedChanges(true);

        return node;
      })
    );
  };

  //Load nodes and workflows from API
  useEffect(() => {
    fetch("http://localhost:3001/tenant/1/workflow/1/")
      .then((res) => res.json())
      .then((json) => {
        readWorkflow(JSON.parse(json.data));
        //console.log(json.data);
        // const { nodes: layoutedNodes, edges: layoutedEdges } =
        //   getLayoutedElements(initialNodes, initialEdges);
        setNodes([...initialNodes]);
        setEdges([...initialEdges]);
        //Note: this will get called twice in dev if React.Strict mode is turned on
        console.log(
          "Loading workflow from API http://localhost:3001/tenant/1/workflow/1/"
        );
      });

    fetch("http://localhost:3001/tenant/1/nodes/")
      .then((res) => res.json())
      .then((json) => {
        //console.log(json);
        setNodeTemplates(json);
        //Note: this will get called twice in dev if React.Strict mode is turned on
        console.log(
          "Loading nodes from API http://localhost:3001/tenant/1/nodes"
        );
      });
  }, []);

  const onNodeClick = (event, node) => {
    //console.log(node);
    //console.log("set current node to: " + node.id);
    setActiveNode(node);
  };

  const onModalClose = () => {
    setActiveNode(null);
  };

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;

      //console.log(newConnection);
      if (
        doesSourceNodeAlreadyHaveTarget(
          newConnection.source,
          newConnection.sourceHandle,
          newConnection.target,
          newConnection.targetHandle,
          rfInstance.getEdges()
        )
      ) {
        edgeUpdateSuccessful.current = false; //marking this will delete the original edge you were dragging
        return;
      }

      setEdges((els) => updateEdge(oldEdge, newConnection, els));
      setUnsavedChanges(true);
    },
    [rfInstance]
  );

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      setUnsavedChanges(true);
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const getAllNodesAsHTML = () => {
    if (rfInstance) {
      let html = JSON.stringify(
        convertNodesToSaveableJSON(rfInstance.toObject()),
        null,
        3
      );
      return html;
    } else {
      return "";
    }
  };

  return (
    <div className="layoutflow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={onNodeClick}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onInit={setRfInstance}
        // connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background color="#666" gap={16} />
        {displayOnly ? null : (
          <div style={{ padding: 8 }}>
            <Title style={{ padding: 8 }}>
              <ActionIcon
                size="md"
                color="dark"
                style={{ display: "inline", zIndex: 1000 }}
                onClick={() => console.log("back")}
              >
                <IconArrowLeft />
              </ActionIcon>
              &nbsp; New Order Workflow
            </Title>
            <Text
              size="sm"
              color="dimmed"
              style={{ paddingLeft: 69, marginTop: -8 }}
            >
              {unsavedChanges ? " unsaved changes..." : ""}
            </Text>
          </div>
        )}

        {displayOnly ? null : (
          <Controls>
            <ControlButton onClick={() => onLayout("TB")}>
              <IconHierarchy3 />
            </ControlButton>
            <ControlButton onClick={() => setCodeIsDisplayed(true)}>
              <IconCode />
            </ControlButton>
          </Controls>
        )}
        <div className="mui-controls" style={{ zIndex: 1000 }}>
          {displayOnly ? null : (
            <NodeDrawer nodeTemplates={nodeTemplates} addNodeFunction={onAdd} />
          )}
        </div>
      </ReactFlow>
      <div className="controls">
        {displayOnly ? null : <Button onClick={onSave}>Save</Button>}
      </div>
      {activeNode ? (
        <NodeDetailsModal
          opened={activeNode != null}
          activeNode={activeNode}
          onClose={onModalClose}
          onDelete={onNodeDelete}
          onSubmit={onEditActiveNode}
          handleActiveNodeLockToggle={handleActiveNodeLockToggle}
        />
      ) : null}
      <Modal
        opened={codeIsDisplayed}
        onClose={() => setCodeIsDisplayed(false)}
        title="JSON Workflow Data"
        overflow="inside"
        size="xl"
      >
        <ReactPrismjs language="json" source={getAllNodesAsHTML()} />
        <Space h="md" />
        <Group position="right">
          <Button type="submit" disabled>
            Save
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default LayoutFlow;
