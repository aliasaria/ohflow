import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { IconPencil, IconTrash, IconList } from "@tabler/icons";

const jobColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

export default function LogList({ data, openModal }) {
  const theme = useMantineTheme();
  const rows = data.map((item) => (
    <tr key={item.id} onClick={() => openModal(item.runId)}>
      <td>
        <Group spacing="sm">
          <IconList size="30" />
          <Text size="sm" weight={500}>
            {item.runId}
          </Text>
        </Group>
      </td>

      <td>{new Date(item.createdAt).toLocaleString("en-US")}</td>
      <td>
        <Anchor size="sm" href="#" onClick={(event) => event.preventDefault()}>
          {item.workflowId}
        </Anchor>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          {item.runTime}
        </Text>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th>Run Id</th>
            <th>Started</th>
            <th>Workflow Id</th>
            <th>Time To Complete</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
