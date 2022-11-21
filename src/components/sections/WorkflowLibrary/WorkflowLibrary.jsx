import { useState, useEffect } from "react";
import {
  MantineProvider,
  Container,
  SimpleGrid,
  Card,
  Group,
  Text,
  Button,
  ActionIcon,
  Image,
  Paper,
  Space,
} from "@mantine/core";
import { IconHeart } from "@tabler/icons";
import LayoutFlow from "../LayoutFlow/LayoutFlow.jsx";

import { LoremIpsum } from "react-lorem-ipsum";

export default function WorkflowLibrary() {
  const [workflows, setWorkflows] = useState([]);

  //Load nodes from API
  useEffect(() => {
    fetch("http://localhost:3001/tenant/1/workflows")
      .then((res) => res.json())
      .then((json) => {
        const names = json.map((x) => x.name);
        setWorkflows(names);
      });
  }, []);

  function WorkflowList({ names }) {
    return names.map((name) => (
      <Card withBorder radius="md" p="md" key={name} style={{ padding: 40 }}>
        <Card.Section style={{ height: 180 }}>
          <LayoutFlow displayOnly="true" />
        </Card.Section>

        <Card.Section mt="md">
          <Group position="apart">
            <Text size="lg" weight={500}>
              {name}
            </Text>
          </Group>
          <Text size="sm" mt="xs">
            <LoremIpsum p={1} avgSentencesPerParagraph={2} />
          </Text>
        </Card.Section>

        <Card.Section mt="md">
          <Group mt="xs">
            <Button radius="md" style={{ flex: 1 }}>
              Show details
            </Button>
            <ActionIcon variant="default" radius="md" size={36}>
              <IconHeart size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Card.Section>
      </Card>
    ));
  }

  return (
    <Container style={{ padding: 20 }}>
      <Group position="right">
        <Button>New Workflow</Button>
      </Group>
      <Space h="md" />
      <SimpleGrid cols={3}>
        <WorkflowList names={workflows} />
      </SimpleGrid>
    </Container>
  );
}
