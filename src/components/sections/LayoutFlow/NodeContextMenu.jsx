import { useState } from "react";
import { Menu, Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons";

export default function NodeContextMenu({ opened, setOpened }) {
  //   const [opened, setOpened] = useState(false);

  return (
    <Menu opened={opened} onChange={setOpened}>
      <Menu.Dropdown>
        <Menu.Item icon={<IconSearch size={14} />} disabled>
          Search
        </Menu.Item>

        {/* Other items ... */}
      </Menu.Dropdown>
    </Menu>
  );
}
