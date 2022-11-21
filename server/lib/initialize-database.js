const { Sequelize, DataTypes } = require("sequelize");
const db = require("./db.js");

var fs = require("fs");

var fakeShopifyOrder = require("../fakeData/shopify-order.js");

async function createNodes() {
  let notificationNodeCSS = `{
  "background": "#FEEBC8",
  "color": "#333",
  "border": "none",
  "width": 80,
  "borderRadius": 20,
  "fontSize": 10,
  "padding": 5,
  "textAlign": "center"
}`;

  let commentNodeCSS = `{
  "background": "#FEFCBF",
  "color": "#333",
  "border": "none",
  "width": 80,
  "borderRadius": 1,
  "fontSize": 8,
  "padding": 5,
  "borderTop": "3px solid #D69E2E"
}`;

  let labelField = {
    id: "label",
    label: "Title",
    type: "input",
    defaultValue: "",
    placeHolder: "Node Title",
  };
  let urlField = {
    id: "url",
    label: "URL To call",
    type: "input",
    defaultValue: "",
    placeHolder: "https://external.url/webhook",
  };
  let ifField = {
    id: "ifstatement",
    label: "If Statement",
    type: "input",
    defaultValue: "",
    placeHolder: '(obj.value == "apple")',
  };
  let codeField = {
    id: "code",
    label: "Conditional Logic",
    type: "textarea",
    defaultValue: "",
    description:
      "Javascript that returns an object and output port {obj, outputPort}",
    placeHolder: "outputPort = 0;\nreturn {obj, outputPort};",
  };

  let editableFields = [labelField, urlField];

  await db.Nodes.create({
    tenantId: "1",
    uuid: "101",
    name: "notification",
    createdAt: new Date(1980, 6, 20),
    code: "console.log('hello world');",
    css: notificationNodeCSS,
    outputNodes: '["out_0"]',
    editableFields: JSON.stringify([labelField, urlField]),
  });

  await db.Nodes.create({
    tenantId: "1",
    uuid: "102",
    name: "decision",
    createdAt: new Date(1980, 6, 20),
    code: "outputNode = 0;\n if ({{{ifstatement}}}) { outputNode = 1 } else { outputNode = 0 };\n return {obj, outputNode};",
    css: "{}",
    outputNodes: '["True","False"]',
    editableFields: JSON.stringify([labelField, ifField]),
  });

  await db.Nodes.create({
    tenantId: "1",
    uuid: "103",
    name: "default",
    createdAt: new Date(1980, 6, 20),
    code: "console.log('hello world');",
    css: "{}",
    outputNodes: '["out_0"]',
    editableFields: JSON.stringify([labelField, codeField]),
  });

  await db.Nodes.create({
    tenantId: "1",
    uuid: "104",
    name: "comment",
    createdAt: new Date(1980, 6, 20),
    code: "console.log('hello world');",
    css: commentNodeCSS,
    outputNodes: "[]",
    editableFields: JSON.stringify([
      {
        id: "label",
        label: "Comment Text",
        type: "textarea",
        placeHolder: "Insert Comment here",
        defaultValue: "",
      },
    ]),
  });
}

async function createTriggers() {
  await db.Triggers.create({
    tenantId: "1",
    uuid: "101",
    name: "New Order from Ecommerce",
    createdAt: new Date(),
    workflow: "100",
    shortcode: "1123",
  });

  await db.Triggers.create({
    tenantId: "1",
    uuid: "102",
    name: "Customer Update from Tulip",
    createdAt: new Date(),
    workflow: "101",
    shortcode: "3515",
  });

  await db.Triggers.create({
    tenantId: "1",
    uuid: "103",
    name: "New Order from Point of Sale",
    createdAt: new Date(),
    workflow: "102",
    shortcode: "aba3124",
  });

  await db.Triggers.create({
    tenantId: "1",
    uuid: "104",
    name: "Event 1",
    createdAt: new Date(),
    workflow: "103",
    shortcode: "263246",
  });

  await db.Triggers.create({
    tenantId: "1",
    uuid: "105",
    name: "Event 2",
    createdAt: new Date(),
    workflow: "104",
    shortcode: "2345sd",
  });
}

async function main() {
  await db.sequelize.sync({ force: true }); //force true drops tables if they exist, wiping everything

  // //Save one fake job
  // console.log("Create Jobs ==============");

  // const order = await db.Job.create({
  //   name: "Job 101",
  //   createdAt: new Date(),
  //   currentTaskState: 1,
  //   run: "101",
  //   data: JSON.stringify(fakeShopifyOrder),
  // });

  console.log("Create Workflows ==============");

  //Save 6 fake workflows into the database
  const workflows = [
    "New Order Workflow",
    "Returns Workflow",
    "Complex Workflow",
    "New Order Workflow 2",
    "Returns Workflow 2",
    "Complex Workflow 2",
  ];

  fs.readFile(
    "./server/fakeData/fakeWorkflow.json",
    "utf8",
    function (err, data) {
      if (err) throw err;
      workflows.map((w, index) =>
        db.Workflows.create({
          tenantId: "1",
          uiid: "10" + String(index),
          name: w,
          createdAt: new Date(),
          data: data,
        })
      );
    }
  );

  // const jobs = await db.Job.findAll();
  // console.log(jobs);

  console.log("NOW Create The Initial Nodes ==============");
  await createNodes();

  console.log("Create Triggers ==============");
  await createTriggers();
}

module.exports = main;
