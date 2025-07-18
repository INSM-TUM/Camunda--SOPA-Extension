@echo off

set "CATALINA_HOME=%CD%\server\apache-tomcat-10.1.30"

echo "starting Camunda Platform 7.23.0-alpha1 on Apache Tomcat 10.1.30"

cd server\apache-tomcat-10.1.30\bin\
start startup.bat

ping -n 5 localhost > NULL
start http://localhost:8082/camunda-welcome/index.html
 