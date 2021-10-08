---
title: Driver
date: Last Modified 
permalink: /driver/index.html
eleventyNavigation:
  key: driver 
  title: Driver
  order: 70
---

1. [Introduction](#introduction)
2. [Configuration](#configuration)
3. [How it works](#how-it-works)


## Introduction

To understand the concept of the driver within the Mongock architecture, visit the [technical overview page](/technical-overview#main/components). There you can see the driver is one of the 3 main components in the Mongock architecture, understand its role as well as how the drivers are organized in families of drivers to provide support for different database technologies.

Thw two main responsabilities of the driver are:
- Persisting the change history.
- Persisting the distributed lock.

<!---------------------------------------------
## Driver options
Currently, we only 
- [MongoDB](/driver/mongodb)
- [Elasticsearch](/driver/elasticsearch)
- [SQL](/driver/sql)
- [CosmosDB](/driver/cosmosdb)
- [DocumentDB](/driver/documentdb)-->

-------------------------------------------

## Configuration

Although each family of driver may provide some additional configuration that you can see inthe specific driver page(for example in MongoDB, you can configure the writeConcern, readConcern, etc.), all of drivers share the following properties:

| Property                            | Description                                                                                  | Type                | Default value |
| ------------------------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------:|
| **migrationRepositoryName**         | Repository name where the change entries are persisted in database. It replaces the deprecated property **changeLogRepositoryName**.<br /> If you need to migrate from another changeLogCollection or from another legacy migration framework, visit the [legacy migration page](/legacy-migration) for more information.  | String | `mongockChangeLog`|
| **lockRepositoryName**              | Repository name where the lock is persisted in database. It's important that all the Mongock executions that need to be synchronised(different services or instances using the same MongoDB database) use the same lockCollection | String | `mongockLock`| 
| **lockAcquiredForMillis**           | The period the lock will be reserved once acquired. If the migration finishes before, the lock will be released. If the process takes longer thant this period, it will automatically extended. When using the builder approach, this is applied in the driver. Minimum value is 3 seconds| long | 1 minute|
| **lockQuitTryingAfterMillis**       | The time after what Mongock will quit trying to acquire the lock, in case it's acquired by another process. When using the builder approach, this is applied in the driver. Minimum value is 0, which means won't wait whatsoever | long |  3 minutes|
| **lockTryFrequencyMillis**          | In case the lock is held by another process, it indicates the frequency trying to acquire it. Regardless of this value, the longest Mongock will wait is until the current lock's expiration. When using the builder approach, this is applied in the driver. Minimum 500 milliseconds| long | 1 second|
| **indexCreation**                   | If false, Mongock won't create the necessary index. However it will check that they are already created, failing otherwise. Default true | String |`true`|

-------------------------------------------

## How it works

The driver is a mandatory parameter that must be injected to the builder. As explained in the [runner page](#runner#build), this can be done manually with the builder or automatically with annotations(if using a framework like Springboot that supports this kind of mechanisms).

When using the builder approach, you need to create the driver(by fllowing the instructions in the specific driver page, under the driver section) and use the `setDriver(driver)` in the builder to inject it.

Similarly to the runners, all the drivers provide a class with two static methods
- **withDefaultLock** which takes as parameters just what's required for the driver to work(database url, template, etc.)
- **withLockConfiguration**, which takes the same parameters as the `withDefaultLock` method, plus the three basic parameters to configure the lock(`lockAcquiredForMillis`, `lockQuitTryingAfterMillis` and `lockTryFrequencyMillis`)


<p class="tipAlt">Visit the specific driver's page to see what paramters are required.</p>


On the other hand, although this job is automatically done by Mongock, it will probably need some basic parameters, like the database, etc. Once again, please visit the concrete driver page to see what's required.


-------------------------------------------