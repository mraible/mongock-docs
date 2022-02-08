---
title: 'MongoDB Spring data' 
date: 2014-04-18 11:30:00 
permalink: /v5/driver/mongodb-springdata/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 86 
  parent: driver
  key: driver mongodb 
  title: 'MongoDB spring data'
---
[[TOC]]
## Introduction
The concept of driver and how it works is already explained in the [technical-overview](/v5/technical-overview) and [driver](/v5/driver) pages.

Here we explain how to use a driver with MongoDB and the different drivers Mongock provides.

<br />

-------------------------------------------

## MongoDB driver options and compatibility
**There are 4 drivers in the MongoDB family driver:**

|     Mongock driver      |                  Driver library              | Version compatibility |
|-------------------------|----------------------------------------------|-----------------------|
| SpringDataMongoV3Driver | org.springframework.data:spring-data-mongodb | 3.X.X                 |
| SpringDataMongoV2Driver | org.springframework.data:spring-data-mongodb | 2.X.X                 |
|    MongoSync4Driver     |        org.mongodb:mongodb-driver-sync       | 4.X.X                 |
|    MongoSync3Driver     |         org.mongodb:mongo-java-driver        | 3.X.X                 |

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

## MongoDB Springdata
Mongock offers two  drivers for MongoDB springdata. The latest, version 3.x, and the previous major version 2.x, just for those who haven't upgraded yet.

- SpringDataMongoV3Driver
- SpringDataMongoV2Driver

### Get started 
Following the [get started section](/v5/get-started#steps-to-run-mongock), this covers steps 3 and 5 and 6.
#### Add maven dependency for the driver (step 2)
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongodb-springdata-v3-driver</artifactId>
  <!--<artifactId>mongodb-springdata-v2-driver</artifactId> for MongoDB spring data v2-->
</dependency>
```

#### Build the driver (setp 5)

<p class="successAlt"><b>This step is only required for builder approach.</b> Mongock handles it for autoconfiguration.</p>

These classes provide the same two static initializers:

- **withDefaultLock**(MongoTemplate mongoTemplate)
- **withLockStrategy**(MongoTemplate mongoTemplate, long lockAcquiredForMillis, long lockQuitTryingAfterMillis, long lockTryFrequencyMillis)

```java
SpringDataMongoV3Driver driver = SpringDataMongoV3Driver.withDefaultLock(mongoTemplate);
```
#### Driver extra configuration (step 6)

##### Transactions
In order to use native transactions, Mongock only needs the `MongoTransactionManager` injected in the Spring application context and the flag `mongock.transaction-enabled` not false(it accepts null, but it's highly recommended to explicitly set a value).

_Keep in mind that your MongoDB database must allow multi-document ACID transactions_
```java
	@Bean
	public MongoTransactionManager transactionManager(MongoTemplate mongoTemplate) {
		return new MongoTransactionManager(mongoTemplate.getMongoDbFactory());
	}
```

<br />

#### Example autoconfiguration with Springboot

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

```java
@EnableMongock
@SpringBootApplication
public class QuickStartApp {

    /**
     * Be wared MongoTemplate needs to be injected
     */
    public static void main(String[] args) {
        SpringApplicationBuilder().sources(QuickStartApp.class)().run(args);
    }

    /**
     * Transaction Manager.
     * Needed to allow execution of changeSets in transaction scope.
     */
    @Bean
    public MongoTransactionManager transactionManager(MongoTemplate mongoTemplate) {
        return new MongoTransactionManager(mongoTemplate.getMongoDbFactory());
    }

}
```


#### Example with builder

```java
//this could be the SpringDataMongoV2Driver passing the same paremeter or MongoSync4Driver/MongoCore3Driver passing the MongoClient and databaseName
SpringDataMongoV3Driver driver = SpringDataMongoV3Driver.withDefaultLock(mongoTemplate);
driver.setWriteConcern(WriteConcern.MAJORITY.withJournal(true).withWTimeout(1000, TimeUnit.MILLISECONDS));
driver.setReadConcern(ReadConcern.MAJORITY);
driver.setReadPreference(ReadPreference.primary());
```
