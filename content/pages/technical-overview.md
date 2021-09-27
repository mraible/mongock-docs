---
title: Technical overview
date: Last Modified 
permalink: /technical-overview/index.html
eleventyNavigation:
  key: technical overview 
  title: Technical overview
  order: 5
---

<div class="tip">
<b>This page should cover: </b>
<ul>
  <li>Explain main concepts: migration, runner and driver</li>
  <li>Explain process(step by step) and how they interact with each other</li>
  <li>Communicate the idea that there are runner specializations(springboot, micronaut,e tc) and multiple family of driver(MongoDB, Sql...) with multiple drivers each(versions, connction libraries...)</li>
  <li>Different building approaches: Properties VS builder??? This may be better in the runner(builder section)</li>
</ul>
</div>

This section explains all the essential concepts required to understand how Mongock works and its usage. 

## Main components

### Migration
A migration is the actual changes and operations you want to perform in your database. We said the target system is a  _database_, but in reallity it doesn't need to be. It could be another target system where you want to apply distributed changes in a synchronosed way.

Regarding of how to shape your migration, Mongock use the concept of **ChangeUnit**(old changeLog), which a single migration file. 

As we already mentioned in [what it Mongock?](/what-is-mongock/), it promotes a code-first approach for migrations, this means that a changeUnit is materialize as a Java class. However, we are working to provide other formats, like database scripts.

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

### Process steps
Mongock process follows the next steps:

1. The runner loads the migration files(changeUnits)
2. The runner checks if there is pending change to execute
3. The runner acquires the distributed lock through the driver
4. The runner loops over the migration files(changeUnits)
4. Per each changeUnit, the runner executes the change
5. If it's successfully executed, it write an entry in the Mongock change history table/collection
6. If the changeUnit fails, the execution is rolled back. 

### Architecture

![Architecture](../content/images/Architecture-User-HLD.jpg)

