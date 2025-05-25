import { getCamundaData } from "./camunda-adaptor.js";
import { calculateCostDrivers } from "./olca-adaptor.js";
import { generateOutputFiles } from "./xml-generator.js";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const processDefinitionKey = args["process"];
const impactMethodName = args["method"];
const camundaUrl = args["camundaUrl"];
const olcaUrl = args["olcaUrl"];
const doAvgCostCalc = args["doAvgCostCalc"] ?? false;

const camundaData = await getCamundaData(camundaUrl, processDefinitionKey);

const data = await Promise.all(
    camundaData.map(async (data) => {
        if (!data.tasksWithParameters) {
            return { process: data.process, results: [] };
        }
        const result = await Promise.all(
            Object.keys(data.tasksWithParameters).map(async (key) => {
                const parameters = await calculateCostDrivers(
                    olcaUrl,
                    impactMethodName,
                    data.tasksWithParameters[key].parameters
                );
                return {
                    ...data.tasksWithParameters[key],
                    parameters,
                    costs: parameters.reduce(
                        (res, param) => res + param.costs,
                        0
                    ),
                };
            })
        );
        return { process: data.process, results: result };
    })
);

generateOutputFiles(data, doAvgCostCalc);
