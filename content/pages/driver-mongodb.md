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

## Introduction
This page provides information about the Mongock driver family for MongoDB.

**There are 3 drivers in the MongoDB family driver:**
- org.mongodb » mongodb-driver-sync(v 4.x)
- org.mongodb » mongo-java-driver(v 3.x)
- org.springframework.data » spring-data-mongodb(v 3.x)
- org.springframework.data » spring-data-mongodb(v 2.x)


**In the following sections we explain:**
- The properties configuration(ahared among all the MongoDB drivers in Mongock)
- What is needed for each MongoDB driver and how to build them.

-------------------------------------------

## Configuration
All the MongoDB drivers share the same configuration. 

<p class="tipAlt">When setting configuration via properties file, it must be prefixed by <b>mongock.mongo-db</b></p>

### Properties

| Property           | Description                                                                                  | Type                | Default value |
| -------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------|
| **writeConcern**   | Exactly the same MongoDB parameter **write concren**. For more information, visit the official MongoDB documentation for [write concern](https://docs.mongodb.com/manual/reference/write-concern/).  | Object      |{w:`majority`,<br />wTimeoutMs: null,<br />j:true} |  
| **readConcern**    | Exactly the same MongoDB parameter **read concren**. For more information, visit the official MongoDB documentation for [read concern](https://docs.mongodb.com/manual/reference/read-concern/).  | String      | `majority` |
| **readPreference** | Exactly the same MongoDB parameter **read preference**. For more information, visit the official MongoDB documentation for [read preference](https://docs.mongodb.com/manual/reference/read-preference/).  | String      | `primary` |

### Configuration with properties file
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


### Configuration with builder

```java
      driver.setWriteConcern(WriteConcern.MAJORITY.withJournal(true).withWTimeout(1000, TimeUnit.MILLISECONDS));
      driver.setReadConcern(ReadConcern.MAJORITY);
      driver.setReadPreference(ReadPreference.primary());
```

-------------------------------------------