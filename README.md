# Camunda-openLCA-Extension with Environmental Costs Calculation

This project consists of 3 subprojects:

- camunda-frontend:
  - the raw codebase for the camunda frontend which can't stand alone, but allows the modification of the web interface of Camunda
  - includes the extension of Camunda fetching available cost drivers from openLCA and allowing the selection and parametrization of them for each user task inside a process instance
- event-log-extractor:
  - standalone service which takes care of fetching lca parameters provided in Camunda, creating an event log in XML-format
- tomcat-server:
  - responsible for running Camunda

Modifications inside the camunda-frontend project need to be moved to the tomcat-server project to become effective. The `deploy.sh` script takes care of that. After running it, you can go inside the tomcat-server project and run the corresponding `start-camunda` script. After that a browser with Camunda should open automatically. You can log into the Tasklist using the credentials `demo` / `demo`.

In case your tomcat server is already running, you can use a `shutdown-camunda` script to stop it.

Prerequisites to be able to use the extension: Have a running openLCA database instance under `http://localhost:8081` with the dataset mentioned in the `demo` folder; have working Java and npm installations.

The event logs extracted by the `event-log-extractor` can be compared with simulated event logs which can be generated with the tool SimuBridge (<https://github.com/INSM-TUM/SimuBridge--SOPA-Extension/tree/dev>).

## Instructions to start the Camunda extension

1. `./deploy.sh`
2. `./tomcat-server/start-camunda.sh`

On Windows, you may instead call `start-camunda.bat`.

## Instructions to start the event log extractor

1. `cd .\event_log_extractor`
2. `npm run serve`

## Demo data and licences

A brief note on the demo data made available in the `demo` folder: The data provided there is not the data we used during development and demonstration of this extension, due to licence restrictions that prevent us from making that data available. However, a licence can be obtained [here](https://nexus.openlca.org/database/Environmental%20Footprints) free of charge. After obtaining the licence and importing the dataset into openLCA, end users can develop corresponding product systems for concrete cost drivers accordingly.
