This is a distribution of

       Camunda Platform v7.23.0-alpha1

visit
       http://docs.camunda.org/

The Camunda Platform is a dual-license Java-based framework.
This particular copy of the Camunda Platform is released either
under the Apache License 2.0 (Community Platform) OR a commercial
license agreement (Enterprise Platform).

License information can be found in the LICENSE file.
 
The Camunda Platform includes libraries developed by third
parties. For license and attribution notices for these libraries,
please refer to the documentation that accompanies this distribution
(see the LICENSE_BOOK-7.23.0-alpha1 file).

The packaged Apache Tomcat server is licensed under 
the Apache License v2.0 license.

==================

Contents:

  lib/
        This directory contains the java libraries for application 
        development.

  server/
        This directory contains a preconfigured distribution 
        of Apache Tomcat with Camunda Platform readily 
        installed. 

        run the
            server/apache-tomcat-10.1.30/bin/startup.{bat/sh}
        script to start up the the server.

        After starting the server, you can access the 
        following web applications:

        http://localhost:8080/camunda
        http://localhost:8080/engine-rest

  sql/
        This directory contains the create and upgrade sql script
        for the different databases.
        The engine create script contain the engine and history tables.

        Execute the current upgrade script to make the database compatible
        with the newest Camunda Platform release.

==================

Camunda Platform version: 7.23.0-alpha1
Apache Tomcat Server version: 10.1.30

=================
