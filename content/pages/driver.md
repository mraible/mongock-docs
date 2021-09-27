---
title: Driver
date: Last Modified 
permalink: /driver/index.html
eleventyNavigation:
  key: driver 
  title: Driver
  order: 70
---
## Introduction

The **driver** is the component in charge to deal with the database. It has two main responsabilities
- Persist the change history.
- Persist the distributed lock.

The driver represents a connection to the database. Therefore each database needs a differente Mongock driver. Even further, for the same database, Mongock may offer multiple drivers, one per connection library. 

For example, in the case of MongoDB, Mongock provides 4 drivers for:
- org.mongodb » mongodb-driver-sync
- org.mongodb » mongo-java-driver
- org.springframework.data » spring-data-mongodb(v 3.x)
- org.springframework.data » spring-data-mongodb(v 2.x)

<p class="successAlt">In this documentation there is a section per database, where you can find the different drivers and how to configure/use them.</p>

-------------------------------------------

## Configuration

Although each group of driver(per database) may provide some specific configuration(for example in MongoDB, you can configure the writeConcern, readConcern, etc.), all of them share the following properties:

| Property                            | Description                                                                                  | Type                | Default value |
| ------------------------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------:|
| **migrationRepositoryName**         | Repository name where the change entries are persisted in database | String | `mongockChangeLog`|
| **changeLogRepositoryName**         | **deprecated** Replaced by migrationRepositoryName | String | `mongockChangeLog`|
| **lockRepositoryName**              | Repository name where the lock is persisted in database | String | `mongockLock`| 
| **lockAcquiredForMillis**           | The period the lock will be reserved once acquired. If the migration finishes before, the lock will be released. If the process takes longer thant this period, it will automatically extended. When using the builder approach, this is applied in the driver. Minimum value is 3 seconds| long | 1 minute|
| **lockQuitTryingAfterMillis**       | The time after what Mongock will quit trying to acquire the lock, in case it's acquired by another process. When using the builder approach, this is applied in the driver. Minimum value is 0, which means won't wait whatsoever | long |  3 minutes|
| **lockTryFrequencyMillis**          | In case the lock is held by another process, it indicates the frequency trying to acquire it. Regardless of this value, the longest Mongock will wait is until the current lock's expiration. When using the builder approach, this is applied in the driver. Minimum 500 milliseconds| long | 1 second|
| **indexCreation**                   | If false, Mongock won't create the necessary index. However it will check that they are already created, failing otherwise. Default true | String |`true`|

-------------------------------------------

## How it works

The driver is a mandatory component that needs to be injected to the runner. If the user opts for the annotation approach, he only needs to provide the required database connectionm that can be found in the given driver section.
On the other hand, if the user choose the builder approach, this needs to be done manually. It's explained below.

 <p class="tipAlt">For more information about <b>building approach</b>, visit the the <a href="/runner/">runner page</a> </p>

### Annotation approach: example
```yaml
mongock:
  lock-acquired-for-millis: 60000
  lock-quit-trying-after-millis: 180000
  lock-try-frequency-millis: 1000
  migration-repository-name: newMigrationRepositoryName
  lock-repository-name: newLockRepositoryName
```


### Builder approach: example

```java
SpringDataMongo3Driver driver = SpringDataMongo3Driver
.withDefaultLock(mongoTemplate);
//or .withLockSetting(mongoTemplate, acquiredForMinutes, maxWaitingFor, maxTries);
driver.setChangeLogRepositoryName("newMigrationCollectionName");
driver.setLockRepositoryName("newLockCollectionName");
driver.setIndexCreation(false);
```