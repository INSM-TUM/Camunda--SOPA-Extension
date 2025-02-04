import axios from "axios";

async function getHistory(camundaUrl, processDefinitionKey) {
    const baseUrl = camundaUrl ?? "http://localhost:8080";
    let url = baseUrl + "/engine-rest/history/process-instance?finished=true";
    if (processDefinitionKey) {
        url += "&processDefinitionKey=" + processDefinitionKey;
    } else {
        console.log(
            "No process definition key provided, proceeding with fetching all processes"
        );
    }
    const response = await axios.get(url);
    return response.data;
}

async function getTasks(camundaUrl, processInstanceId) {
    const baseUrl = camundaUrl ?? "http://localhost:8080";
    const response = await axios.get(
        baseUrl +
            "/engine-rest/history/task?processInstanceId=" +
            processInstanceId
    );
    return response.data;
}

async function getVariables(camundaUrl, processInstanceId) {
    const baseUrl = camundaUrl ?? "http://localhost:8080";
    const response = await axios.get(
        baseUrl +
            "/engine-rest/history/variable-instance?processInstanceId=" +
            processInstanceId
    );
    return response.data;
}

function transformVariableToLCAParameter(variable) {
    return JSON.parse(variable.value);
}

export async function getCamundaData(camundaUrl, processDefinitionKey) {
    const processes = await getHistory(camundaUrl, processDefinitionKey);
    const result = await Promise.all(
        processes.map(async (process) => {
            const tasks = await getTasks(camundaUrl, process.id);
            let variables = await getVariables(camundaUrl, process.id);
            variables = variables.filter((variable) =>
                variable.name.startsWith("lca_")
            );
            const parameters = variables
                .map(transformVariableToLCAParameter)
                .filter((parameter) => parameter?.taskId);
            const result = parameters.reduce((acc, parameter) => {
                const task = tasks.find((task) => task.id === parameter.taskId);
                if (!task) {
                    return acc;
                }
                if (!acc[task.id]) {
                    acc[task.id] = { task, parameters: [] };
                }
                acc[task.id].parameters.push(parameter);
                return acc;
            }, {});
            return { process, tasksWithParameters: result };
        })
    );
    return result;
}
