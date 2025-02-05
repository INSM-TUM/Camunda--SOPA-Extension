# Camunda-openLCA-Extension with Environmental Costs Calculation

This project consists of 3 subprojects:

-   camunda-frontend:
    -   the raw codebase for the camunda frontend which can't stand alone, but allows the modification of the web interface of Camunda
    -   includes the extension of Camunda fetching available cost drivers from openLCA and allowing the selection and parametrization of them for each user task inside a process instance
-   event-log-extractor:
    -   standalone service which takes care of fetching lca parameters provided in Camunda, sending them to openLCA to perform environmental cost calculations and outputting them in XML-format
-   tomcat-server:
    -   responsible for running Camunda

Modifications inside the camunda-frontend project need to be moved to the tomcat-server project to become effective. The `deploy.sh` script takes care of that. After running it, you can go inside the tomcat-server project and run the corresponding `start-camunda` script.

In case your tomcat server is already running, you can use a `shutdown-camunda` script to stop it.
