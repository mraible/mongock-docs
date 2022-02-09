---
title: 'MongoDB Sync' 
date: 2014-04-18 11:30:00 
permalink: /v5/driver/mongodb-sync/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 85 
  parent: driver
  key: driver mongodb 
  title: 'MongoDB Sync'
---
[[TOC]]
## Introduction
This sections covers the Mongock implementation for MongoDB java Driver 3.x and 4.x 

<br />

-------------------------------------------

## MongoDB driver options and compatibility

|     Mongock driver      |                  Driver library              | Version compatibility |
|-------------------------|----------------------------------------------|-----------------------|
|  mongodb-sync-v4-driver |        org.mongodb:mongodb-driver-sync       | 4.X.X                 |
|   mongodb-v3-driver     |         org.mongodb:mongo-java-driver        | 3.X.X                 |

<br />

-------------------------------------------

## MongoDB common configuration
All the MongoDB drivers share the same configuration. 

<p class="tipAlt">When setting configuration via properties file, it must be prefixed by <b>mongock.mongo-db</b></p>

### Properties


| Property           | Description                                                                                  | Type                | Default value |
| -------------------|----------------------------------------------------------------------------------------------|---------------------|---------------|
| **writeConcern**   | Exactly the same MongoDB parameter **write concern**. For more information, visit the official MongoDB documentation for [write concern](https://docs.mongodb.com/manual/reference/write-concern/).  | Object      |{w:`majority`,<br />wTimeoutMs: null,<br />j:true} |  
| **readConcern**    | Exactly the same MongoDB parameter **read concern**. For more information, visit the official MongoDB documentation for [read concern](https://docs.mongodb.com/manual/reference/read-concern/).  | String      | `majority` |
| **readPreference** | Exactly the same MongoDB parameter **read preference**. For more information, visit the official MongoDB documentation for [read preference](https://docs.mongodb.com/manual/reference/read-preference/).  | String      | `primary` |

<br />

-------------------------------------------

### Get started 
Following the [get started section](/v5/get-started#steps-to-run-mongock), this covers steps 3 and 5 and 6.

#### - Add maven dependency for the driver (step 2)

```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongodb-sync-v4-driver</artifactId>
  <!--<artifactId>mongodb-v3-driver</artifactId> for MongoDB driver v3-->
</dependency>
```

#### - Build the driver (setps 5)
These classes provide the same two static initializers

- **withDefaultLock**(mongoClient, databaseName)
- **withLockStrategy**(mongoClient, databaseName, lockAcquiredForMillis, lockQuitTryingAfterMillis, lockTryFrequencyMillis)

```java
// For mongodb-sync-v4-driver
MongoSync4Driver driver = MongoSync4Driver.withDefaultLock(mongoClient, databaseName);
// For mongodb-v3-driver
//MongoCore3Driver driver = MongoCore3Driver.withDefaultLock(mongoClient, databaseName);
driver.setWriteConcern(WriteConcern.MAJORITY.withJournal(true).withWTimeout(1000, TimeUnit.MILLISECONDS));
driver.setReadConcern(ReadConcern.MAJORITY);
driver.setReadPreference(ReadPreference.primary());
```

#### - Driver extra configuration (step 6)

##### Transactions
Due to the MongoDB API design, to work with transactions the [ClientSession](https://mongodb.github.io/mongo-java-driver/4.3/apidocs/mongodb-driver-sync/com/mongodb/client/ClientSession.html) object is required in every MongoDB driver operation.
<br /><br />
Mongock makes this very simple. The developer only needs to specify a `ClientSession` parameter in the contructor or method of the `@ChangeUnit` and use it in the MongoDB operations. **Mongock takes care of everything else.**
<br /><br />
The following code shows how to save documents inside the transaction using the `ClientSession` object.
```java
  @Execution
  public void execution(ClientSession clientSession, MongoDatabase mongoDatabase) {
  
    mongoDatabase.getCollection(CLIENTS_COLLECTION_NAME, Client.class)
            .insertMany(clientSession, IntStream.range(0, INITIAL_CLIENTS)
                    .mapToObj(ClientInitializerChangeLog::getClient)
                    .collect(Collectors.toList()));
  }
```

<br />

-------------------------------------------

## Examples 
<p class="successAlt">Please visit our <a href="https://github.com/mongock/mongock-examples/tree/master/mongodb">example github repository</a> for more information</p>



