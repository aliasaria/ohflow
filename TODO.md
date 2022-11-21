# Priority

- ✅ - Log at each processing step
- ✅ - Show logs with details
- ✅ - Show a list of triggers
- ✅ - Create triggers that create URLs that you can call and send objects to FAKED
- Add CRUD to triggers
- Add indexes to Tables
- ✅ -- Create a debug page where you can initialize and start
- Make back button work on workflows
- Make list of images of workflows -- actually work -- need to read docs on rendering a page with many workflows
- Start frontend and backend in one command (read article on combining react and express)
- Move express routes into separate folders
- Add tenant and user management somehow

# OLD

- ✅- Modify nodes so they have an array of outputPorts only. These can have objects representing their label name, etc. Call them OUTS
- ✅- Make job runner execute the javascript
- ✅--- Load and save Nodes

## User Interface

- ✅- Only one edge per output
- ✅- DONE Delete a line - done in UI
- ✅- DONE - Move "vertical layout" to the options buttons bar
- ✅- DONE Place new nodes in a better place
- ✅- DONE New edges should look smooth
- ✅- DONE New edges easier to draw
- ✅- DONE Allow comment nodes
- ✅- Save Workflow
- ✅ - Save position of nodes when you save
- ✅ Mark some items as non-flowable (like comments) and then don't flow them using dagre
- ✅ Hook up delete on Nodes
- ✅- Load name of workflow in LayoutFlow
- ✅ - Don't layout after load
- ✅ - Allow editing title
- ✅ - Finish saving / editing nodes using this pattern https://reactflow.dev/docs/examples/nodes/update-node/
- ✅ - Create types of nodes
- ✅- State when the workflow contains unsaved changes https://reactflow.dev/docs/api/hooks/use-store/ (current solve doesn't work for move)
- ✅- OOps when we render the node s, we are showing the nodes object, we should be showing the save object (convert to save and show that node tree, not the native react-flow tree that is missing edges)
- ✅- Remove hardcoded position on output nodes
- Allow locking of a node (done partially: i have added the parameter and icon but it does nothing)

## General

- Create a Trigger. A trigger has name, and it generates a URL for you. You have to link it to a workflow
- List all workflows properly
- Create a Node. A Node has a tag that says what type of object it works on (e.g. shopify order) and a workflow is tagged to allow specific types of nodes
- We call the out handles in some places outputNodes but we shouldn't use the term nodes. We should say outputHandles but now we have to rename things in DB

## Workflow Execution

- ✅ - Save to log on every execution
- Concept of tenants
- Concept of workflows per tenant
- Every workflow should accept objects of a restricted type "order" and all template nodes should be associated with that type or can work with all
- Log every step in execution and add the log to the object in metadata with time it took
- Use UUIDs for ids
- ✅ - Create way to start a workflow by adding an order to a workflow's queue
- A job that grabs from the queue every second

## Nodes we need:

- Send Webhook
- Fetch URL and Do Logic
- Select Location based on FSA Mapping
- Select Location based on Shortest Distance
- Estimate Shipping Cost
- Modify JSON

## Overall

- can we make this a general workflow engine for any type of object,
  not just orders? - Then we need a way of saying what type of workflow this is, and
  the base data it wants
- NPM commands to start server, initialize DB

Node has:

- ✅-- Title
- ✅-- Type
- ✅-- Code to execute to modify object
- ✅-- Code to execute to decide True or False based on the Object
- Ability to go call an external URL async
- Ability to call an external URL and wait for response
