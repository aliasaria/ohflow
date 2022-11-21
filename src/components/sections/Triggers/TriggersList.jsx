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
import {
  IconPencil,
  IconTrash,
  IconList,
  IconArrowMoveRight,
} from "@tabler/icons";

export default function TriggersList({ data }) {
  const theme = useMantineTheme();
  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <IconArrowMoveRight size="30" />
          <Text size="sm" weight={500}>
            {item.name}
          </Text>
        </Group>
      </td>

      <td>
        <Anchor size="sm" href="#" onClick={(event) => event.preventDefault()}>
          {item.workflow}
        </Anchor>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          http://localhost:3001/tenant/1/trigger/{item.shortcode}/
        </Text>
      </td>

      <td>
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Workflow</th>
            <th>URL</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
