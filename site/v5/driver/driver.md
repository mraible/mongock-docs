---
title: Driver
date: 2014-04-18 11:30:00 
permalink: /v5/driver/index.html
eleventyNavigation:
  version: v5
  root: true
  order: 50
---

[[TOC]]
## Introduction
To understand the concept of the driver within the Mongock architecture, visit the [technical overview page](/v5/technical-overview#main/components). There you can see the driver is one of the 3 main components in the Mongock architecture, understand its role as well as how the drivers are organized in families of drivers to provide support for different database technologies.

The two main responsabilities of the driver are:
- Persisting the change history.
- Persisting the distributed lock.


## Drivers available
- [MongoDB Java (3.x and 4.x)](/v5/driver/mongodb-sync)
- [MongoDB Spring data (2.x and 3.x)](/v5/driver/mongodb-springdata)
- [MongoDB Java Reactive Streams](/v5/driver/mongodb-reactive)
- [DynamoDB](/v5/driver/dynamodb)
- [CosmosDB](/v5/driver/cosmosdb)
- [DocumentDB](/v5/driver/documentdb)
- **Elasticsearch** (coming soon)
- **Cassandra** (coming soon)
- **SQL** (coming soon)

-------------------------------------------

## Configuration

Although each family of driver may provide some additional configuration that you can see in the specific driver page(for example in MongoDB, you can configure the writeConcern, readConcern, etc.), all of drivers share the following properties:

| Property                            | Description                                                                                  | Type                | Default value |
| ------------------------------------|----------------------------------------------------------------------------------------------|---------------------|---------------|
| **migrationRepositoryName**         | Repository name where the change entries are persisted in database. It replaces the deprecated property **changeLogRepositoryName**.<br /> If you need to migrate from another changeLogCollection or from another legacy migration framework, visit the [legacy migration page](/v5/features/legacy-migration) for more information. | String | `mongockChangeLog`|
| **lockRepositoryName**              | Repository name where the lock is persisted in database. It's important that all the Mongock executions that need to be synchronised(different services or instances using the same MongoDB database) use the same lockCollection. | String | `mongockLock`| 
| **lockAcquiredForMillis**           | The period the lock will be reserved once acquired. If the migration finishes before, the lock will be released. If the process takes longer thant this period, it will automatically extended. When using the builder approach, this is applied in the driver. Minimum value is 3 seconds.| long | 1 minute|
| **lockQuitTryingAfterMillis**       | The time after what Mongock will quit trying to acquire the lock, in case it's acquired by another process. When using the builder approach, this is applied in the driver. Minimum value is 0, which means won't wait whatsoever. | long |  3 minutes|
| **lockTryFrequencyMillis**          | In case the lock is held by another process, it indicates the frequency trying to acquire it. Regardless of this value, the longest Mongock will wait is until the current lock's expiration. When using the builder approach, this is applied in the driver. Minimum 500 milliseconds.| long | 1 second|
| **indexCreation**                   | If false, Mongock won't create the necessary index. However it will check that they are already created, failing otherwise. Default true. | String |`true`|

-------------------------------------------

## How it works

The driver is a mandatory parameter that must be injected to the builder. As explained in the [runner page](#runner#build), this can be done manually with the builder or automatically with autoconfiguration(if using a framework like Springboot that supports this kind of mechanisms).

When using the builder approach, you need to create the driver(by following the instructions in the specific driver page, under the driver section) and use the `setDriver(driver)` in the builder to inject it.

Similarly to the runners, all the drivers provide a class with two static methods:
- **withDefaultLock** which takes as parameters just what's required for the driver to work(database url, template, etc.).
- **withLockConfiguration**, which takes the same parameters as the `withDefaultLock` method, plus the three basic parameters to configure the lock(`lockAcquiredForMillis`, `lockQuitTryingAfterMillis` and `lockTryFrequencyMillis`).


<p class="tipAlt">Visit the specific driver's page to see what paramters are required.</p>


On the other hand, although this job is handled by Mongock, it will probably need some basic parameters, like the database, etc. Once again, please visit the concrete driver page to see what's required.


-------------------------------------------

## Disabling the index creation
Sometimes, for some reasons, you don't want Mongock to perform administration tasks such as index creations. However they are mandatory and must be created. 

In this scenarios Mongock allows you to create the indexes yourself manually by setting `index-creation` to false.


However, bear in mind that in this case, although Mongock won't create the indexes, will still check they are correctly created, so the indexes must be created prior to Mongock initialisation. Otherwise will throw an exception.

As said, to achieve this you need two things. First telling Mongock to not create the indexes by:

Properties
```yaml
mongock:
  #...
  index-creation: false
```
Builder
```java
driver.setIndexCreation(false);
```

And creating the indexes manually. The mongockChangeLog indexes should look similar to the following

```javascript
[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "my-database.mongockChangeLog"
    },
    {
        "v" : 2,
        "unique" : true,
        "key" : {
            "executionId" : 1,
            "author" : 1,
            "changeId" : 1
        },
        "name" : "executionId_1_author_1_changeId_1",
        "ns" : "my-database.mongockChangeLog"
    }
]
```

and the mongockLock indexes:
```javascript
[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "my-database.mongockLock"
    },
    {
        "v" : 2,
        "unique" : true,
        "key" : {
            "key" : 1
        },
        "name" : "key_1",
        "ns" : "my-database.mongockLock"
    }
]
```