#!/bin/sh

export CATALINA_HOME="$(dirname "$0")/server/apache-tomcat-10.1.30"

/bin/sh "$(dirname "$0")/server/apache-tomcat-10.1.30/bin/shutdown.sh"
