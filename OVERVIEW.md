## OhFlow

## Code

There are two components of OhFlow. The React GUI to make and modify workflows, and the server to run them

The GUI is a react app stored in /src/
You can run it by running `npm start`

The server is in /server/
You can run it by running `node /server/app.js`

## Database

The tool uses the Node.JS [Sequelize ORM](https://sequelize.org/docs/v6/) to abstract the database (see `/server/libs/db.js`). Sequelize can support many databases including MySQL and Postgres. Out of the box, the tool uses a local SQLite DB stored in the /db/ directory to hold all data.

### How it works

OhFlow processes objects (in the form of JSON) using a workflow that can be designed by the end user.

An OhFlow workflow takes a JSON object and sends it to the first node in the workflow. Each node takes the object, applies processing to it, and then passes it to the next node in the graph based on provided logic.

### Concepts

A **workflow** is a graph of nodes that process objects. Workflows themselves are saved in a JSON format and saved in the database.

![Example Workflow](/docs/img/workflow.png)

A **node** is a single processing step in a workflow. Nodes have input and output ports. Nodes can be created and added to the library of available nodes. Every node must have _execution code_ which takes in an object as a parametter. Every execution step in a node outputs two things: 1) the new object after processing 2) The output port that represents the path of the next step for the workflow to process

![Example Node](/docs/img/node.png)

When a workflow starts, it begins at the first node in the workflow. It then continues processing until it has an error or it ends in an output node.

A **run** is the execution of an entire workflow against a new input object.

A **job** is a single execution of a node's execution code. Every time a job is complete, the next job in the workflow is scheduled based on the outputNode.

A **trigger** is an incoming action which provices a new input object that starts a run. Triggers are set up to map a URL like `http://<yourserver>/trigger/1234` to a workflow. When that URL is called, and an object is provided in the body of the HTTP call, a run starts by scheduling the first job against the input node of the workflow.
