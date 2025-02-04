/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership. Camunda licenses this file to you under the Apache License,
 * Version 2.0; you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const controller = {
  getAll: (url, modelType) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 1,
        method: 'data/get/all',
        jsonrpc: '2.0',
        params: {
          '@type': modelType
        }
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const mappedCostDrivers = data.result.map(costDriver => {
          const abstractCostDriver = costDriver.category;
          return {
            title: costDriver.refProcess.name,
            abstractCostDriver: abstractCostDriver,
            concreteCostDriver: costDriver.name,
            unit: costDriver.targetUnit.name,
            targetAmount: 0
          };
        });
        return mappedCostDrivers;
      });
  }
};

module.exports = controller;
