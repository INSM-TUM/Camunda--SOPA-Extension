import * as o from "olca-ipc";

export async function calculateCostDrivers(
    olcaUrl,
    impactMethodName,
    parameters
) {
    try {
        const client = o.IpcClient.on(olcaUrl ?? "http://localhost:8081");
        const methods = await client.getAll(o.RefType.ImpactMethod);
        let method;
        if (impactMethodName) {
            method = methods.find((m) => m.name === impactMethodName);
        } else {
            method = methods.length >= 0 ? methods[0] : null;
        }
        if (!method) {
            console.log("  no LCIA method available");
        } else {
            console.log(`  using LCIA method: ${method.name}`);
        }
        const results = await Promise.all(
            parameters.map(async (parameter) => {
                return await calculateCostDriver(parameter, client, method);
            })
        );
        return results;
    } catch (error) {
        console.error("API Error:", error);
        return [];
    }
}

async function calculateCostDriver(parameter, client, method) {
    try {
        const systems = await client.getDescriptors(o.RefType.ProductSystem);
        const system = systems.find(
            (s) => s.name === parameter.concreteCostDriver
        );
        if (!system) {
            throw new Error(`Product System not found: ${parameter.name}`);
        }

        let calcSetup = o.CalculationSetup.of({
            target: system,
            impactMethod: method,
            nwSet: method.nwSets[0],
            allocation: o.AllocationType.USE_DEFAULT_ALLOCATION,
            withCosts: false,
            withRegionalization: false,
            amount: parameter.targetAmount,
            /*unit: parameter.unit,*/
        });

        const result = await client?.calculate(calcSetup);

        if (!result) {
            console.log("calculation failed: no result retrieved");
        }
        const s = await result.untilReady();
        if (s.error) {
            console.log(s.error);
        }

        const driverWeights = await result.getWeightedImpacts();

        return driverWeights
            .filter((w) => w.amount)
            .reduce((acc, w) => {
                return acc + w.amount;
            }, 0);
    } catch (error) {
        console.error("API Error:", error);
        return 0;
    }
}
