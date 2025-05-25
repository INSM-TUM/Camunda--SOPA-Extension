# Event Log Extractor

This project is a CL tool to fetch LCA parameters from your local Camunda 7 instance, performing environmental cost calculations with your local openLCA instance and outputting the data in an XML-format in the `output` folder.

You need to have a running instance of [Camunda 7](https://github.com/camunda/camunda-bpm-platform) and [openLCA](https://www.openlca.org/) on your machine. By default this tools expects Camunda 7 to run on `http://localhost:8080` and openLCA on `http://localhost:8081`. If not provided, the tool will perform an environmental cost analysis on all finished process instances and their corresponding lca parameters and will use the first available impact method for the calculation. But you are able to pass in CL arguments to change this behavior.

Possible CL arguments:

-   `camundaUrl`: allows you to provide your own url of a running Camunda 7 instance
-   `olcaUrl`: allows you to provide your own url of a running openLCA instance
-   `process`: allows you to perform an environmental cost analysis on just one process type (you need to provide the processDefinitionKey of the Camunda process)
-   `method`: allows you to provide a name for the impact method you want to use for the calculation
-   `doAvgCostCalc`: allows you to decide whether you want to perform an avg cost calculation or you prefer just to output the event log with the associated costs

To run the project, you can use `npm run start`. In case you want to pass CL arguments, you can use for example `npm run start -- --camundaUrl=http://localhost:9000 --process=invoice`.
