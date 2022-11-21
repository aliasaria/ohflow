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
} from "@mantine/core";
import { IconHeart } from "@tabler/icons";
import LogList from "./LogList";
import LogDetailsModal from "./LogDetailsModal";

import { LoremIpsum } from "react-lorem-ipsum";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  const [modalOpened, setModalOpened] = useState(null);

  //Load nodes from API
  useEffect(() => {
    fetch("http://localhost:3001/tenant/1/runLog")
      .then((res) => res.json())
      .then((json) => {
        setLogs(json);
      });
  }, []);

  return (
    <Container style={{ padding: 20 }}>
      <LogList data={logs} openModal={setModalOpened} />
      <LogDetailsModal opened={modalOpened} setOpened={setModalOpened} />
    </Container>
  );
}
