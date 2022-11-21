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
import { IconPencil, IconTrash, IconAtom2 } from "@tabler/icons";

const jobColors = {
  engineer: "blue",
  manager: "cyan",
  designer: "pink",
};

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + " ... " : str;
}

export default function NodeList({ data, onSelectNode }) {
  const theme = useMantineTheme();
  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <IconAtom2 size="30" />
          <Text size="sm" weight={500}>
            {item.name}
          </Text>
        </Group>
      </td>

      <td>
        <Badge
          color={jobColors[item.name.toLowerCase()]}
          variant={theme.colorScheme === "dark" ? "light" : "outline"}
        >
          {item.name}
        </Badge>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          {truncate(item.code, 20)}
        </Text>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          {truncate(item.editableFields, 20)}
        </Text>
      </td>
      <td>
        <Text size="sm" color="dimmed">
          {truncate(item.css, 20)}
        </Text>
      </td>
      <td>
        {item.name !== "default" ? (
          <Group spacing={0} position="right">
            <ActionIcon onClick={() => onSelectNode(item.name)}>
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon color="red">
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        ) : (
          ""
        )}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
        <thead>
          <tr>
            <th>Node Name</th>
            <th>Badge</th>
            <th>Code</th>
            <th>Editable Fields</th>
            <th>CSS Styling</th>

            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
