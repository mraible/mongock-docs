---
title: Technical overview
date: Last Modified 
permalink: /technical-overview/index.html
eleventyNavigation:
  key: technical overview 
  title: Technical overview
  order: 5
---


1. [Main components](#main-components)
    1.1. [Migration](#migration)
    1.2. [Driver](#driver)
    1.3. [Runner](#runner)
2. [Mongock process](#mongock-process)
    2.1. [Process steps](#process-steps)
    2.2. [Architecture](#architecture)


## Main components

### Migration
A migration covers   changes and operations you want to perform in your database. We said the target system is a  _database_, but in reallity it doesn't need to be. It could be another target system where you want to apply distributed changes in a synchronosed way.

Regarding of how to implement your migration, Mongock uses the concept of **ChangeUnit**(old changeLog), which is a single migration file. 

As we already mentioned in [what it Mongock?](/what-is-mongock/), it promotes a code-first approach for migrations, this means that a changeUnit is materialized as a Java class. However, we are working to provide other formats, like database scripts.

<p class="warningAlt">Note that the <b>@ChangeLog</b> annotation is deprecated and has been replaced by the new annotation <b>@ChangeUnit</b></p>

_For more information, visit the [migration page](/migration/)_

### Driver
It represents the persistence layer. Everything that needs to be persisted is passed to the driver. It's basically used by the runner to persist and check the migration history and work with the distributed lock.

Mongock splits the drivers in _driver families_, grouped by databases. Then, within a _driver family_, it may provide multiple drivers for different connection library and versions.

For example, in the case of MongoDB, Mongock provides 4 drivers for:
- org.mongodb » mongodb-driver-sync
- org.mongodb » mongo-java-driver
- org.springframework.data » spring-data-mongodb(v 3.x)
- org.springframework.data » spring-data-mongodb(v 2.x)

The Mongock architecture is designed in such a way that allows you to combine any driver with any runner. For example, you may want to use a Mongock driver for SQL springdata with the standalone runner(no framework).

_For more information, visit the [driver page](/driver/)_


<div class="successAlt">Mongock started as a tool only for MongoDB. But it's moving to become a multidatabase tool.
<p>We are working to provide support for SQL and Elasticsearh</p>
</div>


### Runner

The runner is the orchestartor component dealing with the process logic, configuration, dependencies, framework and any environmental aspect. It’s the glue that puts together all the components as well as the decision maker. It takes the migration, driver and framework, and run the process.

Mongock provides different runner for multiple frameworks(standalone, Springboot, Micronaut...) and it can be combined with any driver

_For more information, visit the [runner page](/runner/)_

-----------------------------------------

## Mongock process

In a nutshell, the mongock migration process takes all the pending migration changes and execute them in order.

The main use of Mongock migration consists in placing the migration process in the application's startup, so when the application is deployed the code and data are alligned.

This job is initially easy, but, as always, things can go wrong. What happens if a in automated environment like Kubernetes a changeUnit fails? Let's imagine we have an clien-service that has done some change in the database. The kuberentes tries to dpeloy the service, but the application one of the changeUnits fails. What happens? Well, Mongock is designed to prevent the application to start until the entire migration process is done. This means all the changeUnits are succesfully executed. When a changeUnit fails, Mongock throws an exception and the application's staartup will abort. 

This obviously can be tricked. The [changeUnit](/migration#changeUnit) annotation actually provides a field `failFast`, which when turned to `false` tells Mongock to not throw an exceptioj when that specific changeUnit fails. This is not recommended and shouldonly be use in exceptional scenarios. Also, be ware that, although the application startup is not aborted, the change is tracked as failed in the database, so the next time Mongock is executed will try to execute it.

<p class="warningAlt">`failFast` flag in ChangeUnit annotation is not recommended</p>


### Process steps
Mongock process follows the next steps:

1. The runner loads the migration files(changeUnits)
2. The runner checks if there is pending change to execute
3. The runner acquires the distributed lock through the driver
4. The runner loops over the migration files(changeUnits)
5. Per each changeUnit, the runner executes the change
6. If it's successfully executed, it write an entry in the Mongock change history table/collection
7. If the changeUnit fails, the execution is rolled back. 

### Architecture


<img src="../content/images/technical-overview-diagram-User HLD.jpg" alt="Architecturei">
