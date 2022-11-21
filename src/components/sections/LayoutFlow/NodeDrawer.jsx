// import { useState } from "react";

import { Group } from "@mantine/core";

import { SpotlightProvider, openSpotlight } from "@mantine/spotlight";
// import type { SpotlightAction } from "@mantine/spotlight";
import {
  IconLock,
  IconCircleCheck,
  IconSearch,
  IconCirclePlus,
  IconCircleDot,
  IconSortAscendingLetters,
  IconMessage2,
} from "@tabler/icons";

let addNode = (name) => {};

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";

export default function NodeDrawer({ nodeTemplates, addNodeFunction }) {
  // const [anchorEl, setAnchorEl] = useState();
  // (React.useState < null) | (HTMLElement > null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  addNode = addNodeFunction;

  return (
    <SpotlightProvider
      actions={nodeTemplates.map((element) => {
        return {
          title: element.name,
          description: element.code,
          onTrigger: () => addNode(element.name),
          icon: <IconCircleDot size={18} />,
        };
      })}
      searchIcon={<IconSearch size={18} />}
      searchPlaceholder="Search..."
      shortcut="mod + shift + 1"
      nothingFoundMessage="Nothing found..."
    >
      <Group position="center">
        <IconCirclePlus onClick={openSpotlight} size={32} />
      </Group>
    </SpotlightProvider>
  );
}
