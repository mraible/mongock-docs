---
title: Driver
date: Last Modified 
permalink: /driver/index.html
eleventyNavigation:
  key: driver 
  title: Driver
  order: 70
---

| Property                            | Description                                                                                  | Type                | Default value |
| ------------------------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------:|
| **migrationRepositoryName**         | Repository name where the change entries are persisted in database | String | `mongockChangeLog`|
| **lockRepositoryName**              | Repository name where the lock is persisted in database | String | `mongockLock`| 
| **lockAcquiredForMillis**           | The period the lock will be reserved once acquired. If the migration finishes before, the lock will be released. If the process takes longer thant this period, it will automatically extended. When using the builder approach, this is applied in the driver. Minimum value is 3 seconds| long | 1 minute|
| **lockQuitTryingAfterMillis**       | The time after what Mongock will quit trying to acquire the lock, in case it's acquired by another process. When using the builder approach, this is applied in the driver. Minimum value is 0, which means won't wait whatsoever | long |  3 minutes|
| **lockTryFrequencyMillis**          | In case the lock is held by another process, it indicates the frequency trying to acquire it. Regardless of this value, the longest Mongock will wait is until the current lock's expiration. When using the builder approach, this is applied in the driver. Minimum 500 milliseconds| long | 1 second|
| **indexCreation**                   | If false, Mongock won't create the necessary index. However it will check that they are already created, failing otherwise. Default true | String |`true`|

#### Example with properties
```yaml
mongock:
  lock-acquired-for-millis: 60000
  lock-quit-trying-after-millis: 180000
  lock-try-frequency-millis: 1000
  migration-repository-name: newMigrationRepositoryName
  lock-repository-name: newLockRepositoryName
```

Mongock is set up in a few steps, which will be explained briefly in this section and more detailed in the rest of the documentation:
Importing artifact dependencies(maven, gradle, etc.)
Mongock's bom
Mongock's runner
Mongock's driver
MongoDB driver or specific underlying  library
Configure and run Mongock: Annotation approach or traditional builder approach
All the steps in group 1(importing artifact dependencies) are common independently of the approach you use(annotation or builder).

**NEEDS TO BE CHANGED**