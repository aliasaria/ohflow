const { Sequelize, DataTypes } = require("sequelize");

let db = {};

db.sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db/database.sqlite",
  logging: false,
});

db.Job = db.sequelize.define("Job", {
  tenantId: DataTypes.STRING,
  workflowId: DataTypes.STRING,
  currentTaskState: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  run: DataTypes.STRING,
  data: DataTypes.STRING,
});

db.Workflows = db.sequelize.define("Workflows", {
  tenantId: DataTypes.STRING,
  uuid: DataTypes.STRING,
  name: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  data: DataTypes.STRING,
});

db.RunLog = db.sequelize.define("RunLog", {
  tenantId: DataTypes.STRING,
  workflowId: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  runId: DataTypes.STRING,
  runTime: DataTypes.NUMBER,
});

db.ExecutionLog = db.sequelize.define("ExecutionLog", {
  tenantId: DataTypes.STRING,
  workflowId: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  runId: DataTypes.STRING,
  runTime: DataTypes.NUMBER,
  data: DataTypes.STRING,
  currentState: DataTypes.STRING,
  nextState: DataTypes.STRING,
  outputPort: DataTypes.STRING,
});

db.Nodes = db.sequelize.define("Nodes", {
  tenantId: DataTypes.STRING,
  uuid: DataTypes.STRING,
  name: DataTypes.STRING,
  code: DataTypes.STRING,
  css: DataTypes.STRING,
  outputNodes: DataTypes.JSON,
  editableFields: DataTypes.JSON,
  createdAt: DataTypes.DATE,
});

db.Triggers = db.sequelize.define("Triggers", {
  tenantId: DataTypes.STRING,
  uuid: DataTypes.STRING,
  name: DataTypes.STRING,
  shortcode: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  workflow: DataTypes.STRING,
});

module.exports = db;
