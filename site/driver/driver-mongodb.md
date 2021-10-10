---
title: 'Driver: MongoDB' 
date: Last Modified 
permalink: /driver/mongodb/index.html
toc: true
eleventyNavigation:
  order: 85 
  parent: driver
  key: driver mongodb 
  title: 'MongoDB'
---
[[TOC]]
## Introduction
The concept of driver and how it works is already explained in the [technical-overview](#technical-overview)] and [driver](#driver) pages.

Here we explain how to use a driver with MongoDB and they different drivers Mongock provides.

-------------------------------------------

## MongoDB driver options
**There are 4 drivers in the MongoDB family driver:**
- org.mongodb » mongodb-driver-sync (_v4.x_)
- org.mongodb » mongo-java-driver (_v3.x_)
- org.springframework.data » spring-data-mongodb (_v3.x_)
- org.springframework.data » spring-data-mongodb (_v2.x_)

-------------------------------------------

## MongoDB Configuration
All the MongoDB drivers share the same configuration. 

<p class="tipAlt">When setting configuration via properties file, it must be prefixed by <b>mongock.mongo-db</b></p>

### Properties

| Property           | Description                                                                                  | Type                | Default value |
| -------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------|
| **writeConcern**   | Exactly the same MongoDB parameter **write concren**. For more information, visit the official MongoDB documentation for [write concern](https://docs.mongodb.com/manual/reference/write-concern/).  | Object      |{w:`majority`,<br />wTimeoutMs: null,<br />j:true} |  
| **readConcern**    | Exactly the same MongoDB parameter **read concren**. For more information, visit the official MongoDB documentation for [read concern](https://docs.mongodb.com/manual/reference/read-concern/).  | String      | `majority` |
| **readPreference** | Exactly the same MongoDB parameter **read preference**. For more information, visit the official MongoDB documentation for [read preference](https://docs.mongodb.com/manual/reference/read-preference/).  | String      | `primary` |


-------------------------------------------

## MongoDB Springdata
Mongock offers two  drivers for MongoDB springdata. The latest, version 3.x, and the previous major version 2.x, just for those who haven't upgraded yet.

- SpringDataMongoV3Driver
- SpringDataMongoV2Driver

These classes provide the same two static initializers

- **withDefaultLock**(MongoTemplate mongoTemplate)
- **withLockStrategy**(MongoTemplate mongoTemplate, long lockAcquiredForMillis, long lockQuitTryingAfterMillis, long lockTryFrequencyMillis)


### Transactions
<p class="warningAlt"><b>THIS NEED TO BE FILLED</b></p>

-------------------------------------------

## MongoDB native drivers
Mongock offers two  drivers for MongoDB native drivers. The latest, version Sync 4.x, and the previous major version 3.x, just for those who haven't upgraded yet.

- MongoSync4Driver
- MongoCore3Driver

These classes provide the same two static initializers

- **withDefaultLock**(MongoClient mongoClient, String databaseName)
- **withLockStrategy**(MongoClient mongoClient, String databaseName, long lockAcquiredForMillis, long lockQuitTryingAfterMillis,long lockTryFrequencyMillis)

### Transactions
<p class="warningAlt"><b>THIS NEED TO BE FILLED</b></p>


## Examples 

#### Example automatic approach with properties file
<p class="successAlt">This approach is only possible with Springdata drivers and assumes the MongoTemplate is injected in the Spring context</p>

```yaml
mongock:
  mongo-db:
    write-concern:
      w: majority
      wTimeoutMs: 1000
      journal: true
    read-concern: majority
    read-preference: primary
```


#### Example with builder

```java
//this could be the SpringDataMongoV2Driver passing the same paremeter or MongoSync4Driver/MongoCore3Driver passing the MongoClient and databaseName
SpringDataMongoV3Driver driver = SpringDataMongoV3Driver.withDefaultLock(mongoTemplate);
driver.setWriteConcern(WriteConcern.MAJORITY.withJournal(true).withWTimeout(1000, TimeUnit.MILLISECONDS));
driver.setReadConcern(ReadConcern.MAJORITY);
driver.setReadPreference(ReadPreference.primary());
```
