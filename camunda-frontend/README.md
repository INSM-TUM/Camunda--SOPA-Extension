# Camunda Frontend Project

This directory (without the mentioned modifications) is part of the [Camunda 7 BPM system](https://github.com/camunda/camunda-bpm-platform).

You can find the modifications for this thesis project all in the `/ui/tasklist/client/scripts/form` folder.
The `olca-extension` folder there contains the code responsible for fetching cost drivers from openLCA.
Inside the `directives` folder you can find the `cam-tasklist-form-lca-extension` component (HTML-template and JS-code), which allows for each displayed user form to provide LCA parameters.

_Important note_:
For the code to work, you need to have a running instance of [openLCA software](https://www.openlca.org/) on your machine (on `http://localhost:8081`), otherwise the cost drivers are not fetched. You are of course free to modify the code to your needs.

To build the project manually, you can run `npm run build`.
