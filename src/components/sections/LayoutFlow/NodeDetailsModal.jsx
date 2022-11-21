import { useState } from "react";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Textarea,
  Space,
  Text,
  TextArea,
  Checkbox,
  Title,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";

import { IconLock, IconLockOpen } from "@tabler/icons";

import { useForm, Controller } from "react-hook-form";

import { nodeTypes } from "../../nodes/index.jsx";

import * as LoadedNode from "../../nodes/LoadedNode.jsx";

function getFieldsForNodeType(type) {
  if (type == null) type = "default";
  var fields = LoadedNode.editableFields(type);
  //console.log(fields);
  if (!fields) fields = [];
  return fields;
}

function LockIcon({ isLocked, handleClick }) {
  return (
    <a onClick={handleClick}>{isLocked ? <IconLock /> : <IconLockOpen />}</a>
  );
}

export default function NodeDetailsModal({
  opened,
  activeNode,
  onClose,
  onDelete,
  onSubmit,
  handleActiveNodeLockToggle,
}) {
  const [title, setTitle] = useState(activeNode.data.label);

  const id = activeNode.id || "";

  const editTitle = (event) => {
    //console.log(event.target.value);
    setTitle(event.target.value);
  };

  const { control, register, handleSubmit } = useForm();
  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //   {
  //     control, // control props comes from useForm (optional: if you are using FormContext)
  //     name: "nodeinfo", // unique name for your Field Array
  //   }
  // );

  const fieldsToDisplay = getFieldsForNodeType(activeNode.type);

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={<Title order={2}>Edit Node</Title>}
      >
        {/* This is a {activeNode.type} Node */}
        {/* {JSON.stringify(activeNode)} */}
        {/* {JSON.stringify(getFieldsForNodeType(activeNode.type))} */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {fieldsToDisplay.map((displayField, index) => {
            if (displayField.type === "input") {
              return (
                <div key={displayField.id}>
                  <Controller
                    name={displayField.id}
                    control={control}
                    rules={{ required: true }}
                    defaultValue={activeNode.data[displayField.id] || ""}
                    render={({ field, fieldState }) => (
                      <TextInput
                        {...field}
                        name="textinput"
                        label={displayField.label}
                        placeholder={displayField.placeHolder}
                        error={
                          fieldState.error != undefined
                            ? fieldState.error.type
                            : false
                        }
                      />
                    )}
                  />
                  <Space h="md" />
                </div>
              );
            } else if (displayField.type === "textarea") {
              return (
                <div key={displayField.id}>
                  <Controller
                    key={displayField.id}
                    name={displayField.id}
                    control={control}
                    rules={{ required: true }}
                    defaultValue={activeNode.data[displayField.id] || ""}
                    render={({ field, fieldState }) => (
                      /*console.log(fieldState.error) ||*/ <Textarea
                        {...field}
                        name="textinput"
                        label={displayField.label}
                        placeholder={displayField.placeHolder}
                        description={displayField.description}
                        autosize
                        minRows={3}
                        maxRows={8}
                        error={
                          fieldState.error != undefined
                            ? fieldState.error.type
                            : false
                        }
                      />
                    )}
                  />{" "}
                  <Space h="md" />
                </div>
              );
            }
          })}
          <Space h="md" />
          <Group position="right">
            <LockIcon
              isLocked={activeNode.isLocked}
              handleClick={handleActiveNodeLockToggle}
            />
            <Button color="red" onClick={onDelete}>
              Delete
            </Button>
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
