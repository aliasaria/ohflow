import { useState, useEffect } from "react";
import { Container, Button, Code, Space } from "@mantine/core";
import { IconNorthStar, IconRun, IconPlus } from "@tabler/icons";

export default function Debug() {
  const [output, setOutput] = useState("");

  function initializeDatabase() {
    fetch("http://localhost:3001/debug/initializeDatabase/")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        console.log(data); // this will be a string
        setOutput(data);
      });
  }

  function processOneJob() {
    fetch("http://localhost:3001/debug/processOneJob/")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        console.log(data); // this will be a string
        setOutput(data);
      });
  }

  function triggerNewJob() {
    fetch("http://localhost:3001/tenant/1/trigger/1")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        console.log(data); // this will be a string
        setOutput(data);
      });
  }

  return (
    <Container style={{ padding: 20 }}>
      <Button
        leftIcon={<IconNorthStar />}
        color="green"
        onClick={initializeDatabase}
      >
        Initialize database
      </Button>
      <br />
      <br />
      <Button leftIcon={<IconPlus />} color="pink" onClick={triggerNewJob}>
        Create New Job
      </Button>
      <br />
      <br />
      <Button leftIcon={<IconRun />} onClick={processOneJob}>
        Process One Job
      </Button>
      <Space h="md" />
      Output:
      <Code block>{output}</Code>
    </Container>
  );
}
