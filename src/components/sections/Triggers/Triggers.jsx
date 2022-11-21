import { useState, useEffect } from "react";
import { Container } from "@mantine/core";
import LogList from "./TriggersList";

export default function Triggers() {
  const [triggers, settriggers] = useState([]);

  //Load Triggers from API
  useEffect(() => {
    fetch("http://localhost:3001/tenant/1/triggers/")
      .then((res) => res.json())
      .then((json) => {
        //const names = json.map((x) => x.name);
        settriggers(json);
      });
  }, []);

  return (
    <Container style={{ padding: 20 }}>
      <LogList data={triggers} />
    </Container>
  );
}
