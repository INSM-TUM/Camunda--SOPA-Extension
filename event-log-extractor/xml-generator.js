import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

export async function generateOutputFiles(data, doAvgCostCalc) {
    try {
        const groupedData = data.reduce((acc, result) => {
            if (!acc[result.process.processDefinitionKey]) {
                acc[result.process.processDefinitionKey] = [];
            }
            acc[result.process.processDefinitionKey].push(result);
            return acc;
        }, {});
        if (!existsSync("output")) {
            mkdirSync("output");
        }
        for (const key in groupedData) {
            const output = doAvgCostCalc
                ? generateAvgCostCalcOutput(groupedData[key])
                : generateEventLogOutput(key, groupedData[key]);
            if (!output) continue;
            const dirname = path.dirname(fileURLToPath(import.meta.url));
            const outputDir = path.join(dirname, "output");
            await writeFile(path.join(outputDir, `${key}.xml`), output);
        }
        console.log("Output files written successfully");
    } catch (error) {
        console.error("Error writing output file:", error);
    }
}

function generateAvgCostCalcOutput(data) {
    const content = generateContent(data);
    if (!content) {
        return;
    }
    return `${generateHeader()}${content}`;
}

function generateHeader() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`;
}

function generateContent(data) {
    if (!data) {
        return "";
    }
    const activityCostContent = generateActivityCost(data);
    if (!activityCostContent) {
        return "";
    }
    return `
<Sustainability_Info>
    ${generateAverageProcessInstantCost(data)}${activityCostContent}
</Sustainability_Info>`;
}

function generateAverageProcessInstantCost(data) {
    return `<Average_Process_Instance_Cost>${calculateAverageProcessInstantCost(
        data
    )}</Average_Process_Instance_Cost>`;
}

function calculateAverageProcessInstantCost(data) {
    let processCount = 0;
    const totalCost = data.reduce((acc, result) => {
        if (result.results?.length > 0) {
            processCount++;
        }
        return acc + result.results.reduce((a, b) => a + b.costs, 0);
    }, 0);
    return totalCost / processCount;
}

function generateActivityCost(data) {
    const activityCostContent = [...findAllTaskDefinitionKeys(data)]
        .map((key) => {
            return generateActivity(data, key);
        })
        .join("");
    if (!activityCostContent) {
        return "";
    }
    return `
    <Activity_Cost>${activityCostContent}
    </Activity_Cost>`;
}

function findAllTaskDefinitionKeys(data) {
    const set = data.reduce((acc, result) => {
        result.results.forEach((r) => {
            acc.add(r.task.taskDefinitionKey);
        });
        return acc;
    }, new Set());
    return set;
}

function generateActivity(data, key) {
    return `
        <Activity id="${key}">
            <Activity_Average_Cost id="${key}">${calculateActivityAverageCost(
        data,
        key
    )}</Activity_Average_Cost>
        </Activity>`;
}

function calculateActivityAverageCost(data, key) {
    let taskCount = 0;
    const totalCost = data.reduce((acc, result) => {
        const task = result.results.find(
            (r) => r.task.taskDefinitionKey === key
        );
        taskCount += task ? 1 : 0;
        return acc + (task ? task.costs : 0);
    }, 0);
    return totalCost / taskCount;
}

// Creating Event Log

function generateEventLogOutput(key, data) {
    const traceString = generateTraces(data);
    return `<?xml version="1.0" encoding="UTF-8" ?>
<log xes.version="1.0" xes.features="nested-attributes" openxes.version="1.0RC7">
    <string key="concept:name" value="${key}"/>
    ${traceString}
</log>`;
}

function generateTraces(data) {
    return data.map((d) => generateTrace(d)).join("\n    ");
}

function generateTrace(data) {
    const totalCost = data.results.reduce((cost, result) => {
        return (cost += result.costs);
    }, 0);
    return `<trace>
        <string key="concept:name" value="${data.process.id}"/>
        <string key="cost:Process_Instance" value="${totalCost}"/>
${generateEventLogActivities(data)}
    </trace>`;
}

function generateEventLogActivities(data) {
    return data.results
        ?.map((activity) => generateEventLogActivity(activity))
        .join("\n");
}

function generateEventLogActivity(activity) {
    return `${generateEvent(activity, true)}
${generateEvent(activity, false)}`;
}

function generateEvent(activity, isStartEvent) {
    if (isStartEvent) {
        return `            <event>
                <string key="concept:name" value="${activity.task?.name}"/>
                <string key="lifecycle:transition" value="start"/>
                <date key="time:timestamp" value="${activity.task?.startTime}"/>
            </event>`; 
    } else {
        return `            <event>
                <string key="concept:name" value="${activity.task?.name}"/>
                ${generateCostDrivers(activity)}
                <string key="lifecycle:transition" value="complete"/>
                <date key="time:timestamp" value="${activity.task?.endTime}"/>
                ${generateActivityCostForEvent(activity)}
            </event>`;
        }
}

function generateActivityCostForEvent(activity) {
    return `<string key="cost:activity" value="${activity.costs}"/>`;
}

function generateCostDrivers(activity) {
    return activity.parameters.map((p) => generateCostDriver(p)).join("\n                ");
}

function generateCostDriver(parameter) {
    return `<string key="cost:driver" value="${parameter.abstractCostDriver}(${parameter.concreteCostDriver}): ${parameter.costs}"/>`;
}
