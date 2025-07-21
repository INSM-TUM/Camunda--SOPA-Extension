import express from "express";
import cors from "cors";
import { run } from "./index.js";
import path from 'path';
const __dirname = path.resolve(path.dirname(''));

const app = express();
const port = 8083;

app.use(
    cors({
        origin: "http://localhost:8082",
    })
);

app.post("/performCalc", async (req, res) => {
    const processDefinitionKey = req.query.processDefinitionKey;
    console.log(processDefinitionKey);
    await run(processDefinitionKey);
    const filePath = `${__dirname}/output/${processDefinitionKey}.xes`;
    console.log(filePath)
    await res.download(filePath, `${processDefinitionKey}.xes`);
});

app.listen(port, () => {
    console.log(`Event log extractor listening on port ${port}`);
});
