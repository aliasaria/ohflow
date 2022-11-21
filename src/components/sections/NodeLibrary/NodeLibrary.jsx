import { useState, useEffect } from "react";
import { Container, Group, Button, Space } from "@mantine/core";
import { IconHeart } from "@tabler/icons";
import NodeList from "./NodeList";

import { LoremIpsum } from "react-lorem-ipsum";
import NodeDetailsModal from "./NodeDetailsModal";

export default function NodeLibrary() {
  const [nodeLibrary, setNodeLibrary] = useState([]);

  const [activeNode, setActiveNode] = useState(null);

  const onModalClose = () => {
    setActiveNode(null);
  };

  const onNodeDelete = (params) => {
    console.log("delete TODO");
    onModalClose();
  };

  const onEditActiveNode = (params) => {
    console.log("edit TODO");
    console.log(params);
    onModalClose();
  };

  const onSelectNode = (node) => {
    console.log(nodeLibrary);
    let foundNode = nodeLibrary.find((element) => element.name == node);
    setActiveNode(foundNode);
  };

  const newNode = () => {
    console.log("new");
    setActiveNode(1);
  };

  //Load nodes from API
  useEffect(() => {
    fetch("http://localhost:3001/tenant/1/nodes/")
      .then((res) => res.json())
      .then((json) => {
        //const names = json.map((x) => x.name);
        setNodeLibrary(json);
      });
  }, []);

  return (
    <Container style={{ padding: 20 }}>
      <Space h="md" />
      <NodeList data={nodeLibrary} onSelectNode={onSelectNode} />
      {activeNode ? (
        <NodeDetailsModal
          opened={activeNode != null}
          activeNode={activeNode}
          onClose={onModalClose}
          onDelete={onNodeDelete}
          onSubmit={onEditActiveNode}
          nodeLibrary={nodeLibrary}
        />
      ) : null}
      <Space h="lg" />

      <Group position="right">
        <Button onClick={newNode}>New Node</Button>
      </Group>
    </Container>
  );
}
