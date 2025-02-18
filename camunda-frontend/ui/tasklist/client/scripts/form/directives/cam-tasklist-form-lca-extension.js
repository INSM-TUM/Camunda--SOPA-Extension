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

'use strict';

var template = require('./cam-tasklist-form-lca-extension.html?raw');

var olcaController = require('../olca-extension/olca-controller');

module.exports = [
  '$http',
  'Uri',
  function($http, Uri) {
    return {
      restrict: 'A',

      require: '^camTasklistForm',

      scope: true,

      template: template,

      link: function($scope, $element, attrs, formController) {
        /// lca setup

        $scope.abstractCostDrivers = [];
        $scope.costDrivers = [];
        $scope.currentAbstractCostDriver = '';
        $scope.currentConcreteCostDriver = '';
        $scope.targetAmount = 0;
        $scope.selectedCostDrivers = [];
        $scope.oldParamNames = [];

        $scope.addCostDriver = function(
          concreteCostDriver,
          targetAmount,
          costDrivers
        ) {
          const costDriver = costDrivers.find(
            costDriver => costDriver.concreteCostDriver === concreteCostDriver
          );
          $scope.selectedCostDrivers.push({
            ...costDriver,
            targetAmount,
            saved: false
          });
          $scope.currentAbstractCostDriver = '';
          $scope.currentConcreteCostDriver = '';
          $scope.targetAmount = 0;
        };

        $scope.removeCostDriver = function(index) {
          $scope.selectedCostDrivers.splice(index, 1);
          $scope.$apply();
        };

        $scope.getAbstractCostDrivers = function() {
          return $scope.abstractCostDrivers.filter(
            abstractCostDriver =>
              !$scope.selectedCostDrivers.find(
                costDriver =>
                  costDriver.abstractCostDriver === abstractCostDriver
              )
          );
        };

        $scope.getConcreteCostDrivers = function(abstractCostDriver) {
          return $scope.costDrivers
            .filter(
              costDriver => costDriver.abstractCostDriver === abstractCostDriver
            )
            .map(costDriver => costDriver.concreteCostDriver);
        };

        $scope.getCurrentUnit = function(concreteCostDriver, costDrivers) {
          if (!concreteCostDriver || !costDrivers) {
            return '';
          }
          return costDrivers.find(
            costDriver => costDriver.concreteCostDriver === concreteCostDriver
          ).unit;
        };

        $scope.submit = async function(selectedCostDrivers) {
          await deleteParameters();
          await Promise.all(
            selectedCostDrivers.map(costDriver => {
              var data = {
                value: JSON.stringify({
                  ...costDriver,
                  taskId: formController.getParams().taskId
                }),
                type: 'String',
                valueInfo: {}
              };
              var config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              };
              return $http.put(
                Uri.appUri(
                  'engine://engine/:engine/task/' +
                    formController.getParams().taskId +
                    '/variables/lca_' +
                    costDriver.concreteCostDriver +
                    '_' +
                    formController.getParams().taskId
                ),
                data,
                config
              );
            })
          );
          await loadParameters();
          $scope.$apply();
        };

        // load cost drivers ////////////////////////////////////////////////////

        olcaController
          .getAll('http://localhost:8081/', 'ProductSystem')
          .then(function(costDrivers) {
            $scope.abstractCostDrivers = costDrivers
              .map(costDriver => costDriver.abstractCostDriver)
              .filter((value, index, self) => self.indexOf(value) === index);
            $scope.costDrivers = costDrivers;
            $scope.$apply();
            loadParameters();
          });

        // load existing parameters /////////////////////////////////////////////
        const loadParameters = () => {
          return $http
            .get(
              Uri.appUri(
                'engine://engine/:engine/task/' +
                  formController.getParams().taskId +
                  '/variables'
              )
            )
            .then(function(response) {
              const variables = response.data;
              const fetchedParams = Object.keys(variables)
                .filter(key => key.startsWith('lca_'))
                .map(key => {
                  const costDriver = JSON.parse(variables[key].value);
                  return {
                    ...costDriver,
                    saved: true
                  };
                })
                .filter(costDriver => {
                  return (
                    costDriver.taskId === formController.getParams().taskId
                  );
                });
              $scope.selectedCostDrivers = fetchedParams ?? [];
              $scope.oldParamNames =
                Object.keys(variables).filter(
                  key =>
                    key.startsWith('lca_') &&
                    key.endsWith(formController.getParams().taskId)
                ) ?? [];
            });
        };

        const deleteParameters = () => {
          return Promise.all(
            $scope.oldParamNames.map(name => {
              return $http.delete(
                Uri.appUri(
                  'engine://engine/:engine/task/' +
                    formController.getParams().taskId +
                    '/variables/' +
                    name
                )
              );
            })
          );
        };
      }
    };
  }
];
