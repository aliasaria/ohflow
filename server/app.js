const express = require("express");
var bodyParser = require("body-parser");

const { v4: uuidv4 } = require("uuid");

var cors = require("cors");

const db = require("./lib/db.js");

const JobRunner = require("./lib/JobRunner");
const InitializeDB = require("./lib/initialize-database");

var fs = require("fs");

const app = express();
const port = 3001;

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World! This is the OhFlow REST Server.");
});

//Get all available workflows
app.get("/tenant/1/workflows/", async (req, res) => {
  const workflows = await db.Workflows.findAll();
  res.send(JSON.stringify(workflows));
});

app.get("/tenant/1/workflow/1/", async (req, res) => {
  const workflow = await db.Workflows.findOne({
    where: {
      name: "New Order Workflow",
    },
  });
  res.send(workflow);
});

app.post("/tenant/1/workflow/save/", jsonParser, (req, res) => {
  // Save to file
  // console.log(req.body);
  // fs.writeFile(
  //   "./src/fake/workflow_saved.json",
  //   JSON.stringify(req.body),
  //   "utf8",
  //   function (err, data) {
  //     res.send("success");
  //   }
  // );

  //Write this workflow to the database
  db.Workflows.update(
    {
      tenantId: "1",
      uiid: uuidv4(),
      name: "New Order Workflow",
      createdAt: new Date(),
      data: JSON.stringify(req.body),
    },
    {
      where: {
        name: "New Order Workflow",
      },
    }
  );
});

//Get all available Nodes
app.get("/tenant/1/nodes/", async (req, res) => {
  const nodes = await db.Nodes.findAll();
  res.send(JSON.stringify(nodes));
});

//Get all available Nodes
app.get("/tenant/1/triggers/", async (req, res) => {
  const triggers = await db.Triggers.findAll();
  res.send(JSON.stringify(triggers));
});

//Get all available Nodes
app.get("/tenant/1/runLog/", async (req, res) => {
  const logs = await db.RunLog.findAll({ limit: 10, offset: 0 });
  res.send(JSON.stringify(logs));
});

//Get all available Nodes
app.get("/tenant/1/executionLog/:runId", async (req, res) => {
  const logs = await db.ExecutionLog.findAll({
    limit: 10,
    offset: 0,
    where: { runId: req.params.runId },
  });
  res.send(JSON.stringify(logs));
});

//Initialize DB
app.get("/debug/initializeDatabase", async (req, res) => {
  InitializeDB();
  res.send("Database is clean and fake");
});

//Process One Job
app.get("/debug/processOneJob", async (req, res) => {
  var log = await JobRunner();
  res.send(log);
});

app.get("/tenant/:tenantId/trigger/:triggerId", (req, res) => {
  var triggerId = req.params.triggerId;

  var fakeShopifyOrder = require("./fakeData/shopify-order.js");

  var newId = uuidv4();

  db.Job.create({
    name: "Job 101",
    createdAt: new Date(),
    currentTaskState: 1,
    run: newId,
    data: JSON.stringify(fakeShopifyOrder),
  });

  res.send("New Job Created: " + newId);
});

/* ************** */
/* LISTEN ******* */
/* ************** */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  InitializeDB();
});
