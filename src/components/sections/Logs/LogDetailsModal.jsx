import { useState, useEffect } from "react";
import { Modal, Accordion, ScrollArea } from "@mantine/core";

export default function LogDetailsModal({ opened, setOpened }) {
  const [logs, setLogs] = useState([]);

  //Load nodes from API
  useEffect(() => {
    if (opened == null) return;

    fetch("http://localhost:3001/tenant/1/executionLog/" + opened)
      .then((res) => res.json())
      .then((json) => {
        setLogs(json);
        // console.log(
        //   "Fetching execution log for run " +
        //     opened +
        //     " " +
        //     JSON.stringify(json)
        // );
      });
  }, [opened]);

  return (
    <Modal
      opened={opened != null}
      onClose={() => setOpened(null)}
      title="Run Details"
      size="xl"
    >
      <Accordion>
        {logs.map((item) => {
          return (
            <Accordion.Item key={item.id} value={String(item.id)}>
              <Accordion.Control>
                <b>{item.id}:</b> Time: {item.createdAt} Execution Time:&nbsp;
                {item.runTime}ms
                <br />
                <b>Output:</b> {item.currentState}[{item.outputPort}]→
                {item.nextState}
              </Accordion.Control>
              <Accordion.Panel>
                <ScrollArea style={{ height: 200 }} type="always">
                  {item.data}
                </ScrollArea>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Modal>
  );
}
