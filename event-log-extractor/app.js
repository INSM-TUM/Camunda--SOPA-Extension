import express from "express";
import cors from "cors";
import { run } from "./index.js";

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
    res.send(true);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
