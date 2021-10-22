---
title: Lock
date: 2014-04-18 11:30:00 
permalink: /v4/lock/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 7
---

# Lock

Mongock uses a pessimistic lock to synchronise multiple Mongock instances accessing to the same database. 

the lock will be ensured in every access to

## Overview

Although this is completely configurable, the default, expected and recommended behaviour is Mongock acquiring the lock before starting the migration, trying up to certain number of times\(if it's already taken or there is any connection issue\). Once taken, it will "reserve" it initially for some time\(**lockAcquiredForMinutes**\). Then  Mongock will ensure the lock is acquired in every access to the database. When the time for which the lock was acquired is near to expire, Mongock will extend it using the same amount of minutes\(**lockAcquiredForMinutes**\). This process will be repeatedly performed until the migration is finished in order to ensure the lock is acquired until the end of the migration.

#### What happens if the lock is acquired for a shorter period than the migration and cannot be re-acquired?

This is very unlike as the only instance allowed to update the lock collection is the one in possession of the lock, but it's technically possible to experiment connection issues when refreshing the lock. When this happens, the lock is implicitly released\(or about to\) because it is expired, so  the current migration is aborted and any other Mongock instance can acquire it. The result of the migration will depend on wether the migration is [transactionable](transactions.md) or [provides recovery process](). 

#### How is the lock ensured in every database access?

Mongock uses two mechanisms for this. Static and dynamic lock guardian.

* **static lock guardian**: This is mainly used for driver and  database components, known in advance, such as MongoDatabase, MongoCollection, MongoTemplate\(MongockTemplate\), etc. This mechanism is based on the decorator pattern, so it is just a wrap wrap to ensure the lock is acquisition.

{% hint style="success" %}
**MongockTemplate** must be used instead of MongoTemplate.
{% endhint %}

* **dynamic lock guardian**: This used for the **custom objects** used in changeSet methods, like repositories, etc. This implementation uses the JDK dynamic proxy instrumentation. While it has its pros and cons, it provides a fair balance between performance and framework intrusion. Unfortunately, one of the well known  limitations is that only interfaces can be proxied, so for this reason Mongock only allows interface for custom beans in changeSet methods. Please consult [Injecting custom beans](injecting-custom-dependencies-to-changesets.md) for more information.

{% hint style="warning" %}
**Custom beans** in changeSet methods **must be interfaces**.
{% endhint %}

## Configuration

There are just 4 parameters to tune the lock.You can configure them by using properties or builder. Please see the [runner configuration](standalone.md#configuration) section for more information.

* **lockAcquiredForMinutes**: Indicates how long the lock will be hold in minutes once acquired. You can configure it with method setLockConfig in builder.
* **maxWaitingForLockMinutes**: Indicates max time in minutes to wait for the lock in each try.You can configure it with method setLockConfig in builder.
* **maxTries**: Number of times Mongock will try to acquire the lock. You can configure it with method setLockConfig in builder.
* **throwExceptionIfCannotObtainLock**: Mongock will throw MongockException if lock can not be obtained. You can configure it with method setLockConfig in builder.

{% hint style="warning" %}
When using the builder method **setLockConfig**, which takes lockAcquiredForMinutes, maxWaitingForLockMinutes and maxTries as parameters, **will implicitly set throwExceptionIfCannotObtainLock to true.** 

However, in common scenarios it doesn't makes much sense, but you can set it to false afterwards with method throwExceptionIfCannotObtainLock though.
{% endhint %}

