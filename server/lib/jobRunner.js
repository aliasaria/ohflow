const db = require("./db.js");
const { Op } = require("sequelize");
const { NodeVM, VM } = require("vm2");

var Mustache = require("mustache");

/*********
 * Fetch next job and return it
 */
async function fetchNextJob() {
  //Grab the first job in the JOBS database
  const job = await db.Job.findOne({
    where: {
      currentTaskState: {
        [Op.ne]: "_COMPLETE", //Find the first incomplete job
      },
    },
  });

  return job;
}

/*********
 * Process a specific job
 */
// Give me a job and I will execute it
async function processJob(job) {
  var obj = job.data;
  var run = job.run;

  var log = "";

  startTime = new Date();

  // console.log("Job:", JSON.stringify(job, null, 2));

  //find the corresponding node in the workflow
  n = workflow.find((x) => x.id === job.currentTaskState);
  //console.log("Node:", JSON.stringify(n, null, 2));

  log += "[*] CURRENT STATE: " + n.id + ": " + n.data.label + "\n";
  nextState = 0;

  // If we are at an ouput Node, then we are done.
  if (n.type == "output") {
    nextState = "_COMPLETE";

    db.Job.update(
      {
        currentTaskState: nextState,
        data: outputObject,
      },
      {
        where: {
          id: job.id,
        },
      }
    );

    return "Complete!"; //END FLOW HERE ===============================
  }

  var outputObject = obj;
  var outputPort = 0;

  //=======================================================
  //Step 1: Execute Logic =================================
  //=======================================================
  if (n?.data?.code !== undefined) {
    //Grab template code from Node:
    let templateCode = n.data.code;

    let codeGlobals = n.data;
    codeGlobals.obj = obj;

    var finalCode = Mustache.render(templateCode, codeGlobals);
    log += "final output code:\n";
    log += finalCode + "\n";

    //console.log("Logic to run:");
    //console.log(n.data.code);

    //Create a VM2 instance and pass the object called obj
    //and name it "obj" inside the script
    const vm = new NodeVM({
      timeout: 1000, //this should be configurable later. And handle the timeout somehow
      allowAsync: true,
      sandbox: { obj: obj },
      require: true,
      wrapper: "none",
    });

    let output = await vm.run(finalCode);

    outputObject = output.obj;
    outputPort = output.outputPort;

    //console.log(outputObject);
    log += "output port: " + outputPort + "\n";

    //=======================
    //Save the object now that it has been processed
    //=======================
    //Nah we'll do this later in the code
  }

  //=======================================================
  //Step 2: Set the desired output port ===================
  //=======================================================

  //If this has ports, then set the state to the next port
  if (n.hasOwnProperty("out")) {
    if (n.out.length == 1) {
      nextState = n.out[0];
    } else {
      //multi port node
      nextState = n.out[outputPort];
    }
  }

  log += "->NEXT STATE: " + nextState + "\n";

  db.Job.update(
    {
      currentTaskState: nextState,
      data: outputObject,
    },
    {
      where: {
        id: job.id,
      },
    }
  );

  //=======================================================
  //Step 3: Log update to Database      ===================
  //=======================================================
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  //Move the task to the next state

  //The Run is the whole run from start to finish
  //Create it once for every entire run
  await db.RunLog.findOrCreate({
    where: { runId: run },
    defaults: {
      tenantId: "1",
      workflowId: "1",
      createdAt: new Date(),
      runId: run,
      runTime: 0, //@TODO
    },
  });

  //The executionlogis the log of the invididual execustions
  //of every node
  await db.ExecutionLog.create({
    tenantId: "1",
    workflowId: "1",
    createdAt: new Date(),
    runId: run,
    data: obj,
    currentState: n.id,
    nextState: nextState,
    outputPort: outputPort,
    runTime: timeDiff,
  });

  return log;
}

// async function seeAllJobs() {
//   const jobs = await db.Job.findAll();
//   console.log("ALL JOBS:");
//   console.log(jobs);
// }

var workflow = [];

/*********
 * MAIN Function
 */
async function main() {
  var log = "";
  workflow = await db.Workflows.findOne({
    where: {
      name: "New Order Workflow",
    },
  });

  workflow = JSON.parse(workflow.data);

  //console.log(workflow);

  var job = await fetchNextJob();
  if (job == null) {
    log = "NO JOBS TO PROCESS 🙌";
    return log;
  }

  log = await processJob(job);
  return log;
  //await seeAllJobs();
}

module.exports = main;
