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
This sections covers the Mongock implementation for Spring Data MongoDB 2.x and 3.x 

<br />

-------------------------------------------

## MongoDB driver options and compatibility

|     Mongock driver      |                  Driver library              | Version compatibility |
|------------------------------|----------------------------------------------|-----------------------|
| mongodb-springdata-v3-driver | org.springframework.data:spring-data-mongodb | 3.X.X                 |
| mongodb-springdata-v2-driver | org.springframework.data:spring-data-mongodb | 2.X.X                 |

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
  <artifactId>mongodb-springdata-v3-driver</artifactId>
  <!--<artifactId>mongodb-springdata-v2-driver</artifactId> for MongoDB spring data v2-->
</dependency>
```

#### - Build the driver (setp 5)

<p class="successAlt"><b>This step is only required for builder approach.</b> Mongock handles it for autoconfiguration.</p>

These classes provide the same two static initializers:

- **withDefaultLock**(mongoTemplate)
- **withLockStrategy**(mongoTemplate, lockAcquiredForMillis, lockQuitTryingAfterMillis, lockTryFrequencyMillis)


```java
// For mongodb-springdata-v3-driver
SpringDataMongoV3Driver driver = SpringDataMongoV3Driver.withDefaultLock(mongoTemplate);
// For mongodb-springdata-v2-driver
//SpringDataMongoV2Driver driver = SpringDataMongoV2Driver.withDefaultLock(mongoTemplate);
driver.setWriteConcern(WriteConcern.MAJORITY.withJournal(true).withWTimeout(1000, TimeUnit.MILLISECONDS));
driver.setReadConcern(ReadConcern.MAJORITY);
driver.setReadPreference(ReadPreference.primary());
```
#### - Driver extra configuration (step 6)

##### Transactions
In order to use native transactions, Mongock only needs the flag `mongock.transaction-enabled` not false(it accepts null, if the transactionManager is injected, but it's highly recommended to explicitly set a value).

_Keep in mind that your MongoDB database must allow multi-document ACID transactions_


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


}
```
<br />

-------------------------------------------

## Examples 
<p class="successAlt">Please visit our <a href="https://github.com/mongock/mongock-examples/tree/master/mongodb">example github repository</a> for more information</p>



