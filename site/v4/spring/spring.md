---
title: Driver
date: 2014-04-18 11:30:00 
permalink: /v4/spring/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 4
---

# Driver

We have already mention the concept driver in [Main concepts](main-concepts.md#driver). Drivers are the part of Mongock in charge of dealing with MongoDB.

## Motivation

In order to provide support to different MongoDB versions, Java MongoDB drivers and libraries, we need to separate this connector from the rest of Mongock, so the user can choose the right alternative for him\(for example, using directly the Java MongoDB driver or Spring Data library\)

It's also important when comes to old version. Users may don't want to upgrade to the last version of MongoDB or driver, but they still need Mongock to be supported for their production deployments.

## How it works

Technically drivers are simple implementations of the same interface which provides the contract between the driver itself and the [runner](standalone.md).

The idea is to provide a specific driver for every Java MongoDB driver, library or need. Open source users will be able to add drivers, following the driver specification.

Mongock drivers use two MongoDB collections. The **changeLogCollection**\(called mongockChangeLog by default\), where the changeLog history will be stored, and the **lockCollection**\(called mongockLock by default\), used for pessimistic synchronisation between Mongock executions.

{% hint style="warning" %}
It's important that **all the Mongock executions** that need to be synchronised\(different services or instances using the same MongoDB database\) **use the same lockCollection**. This is the only way they can be synchronised
{% endhint %}

{% hint style="warning" %}
Also **ensure that the right changeLogCollection** is used in order **to prevent** Mongock from **re-running migrations undesirably**. If you need to migrate from another changeLogCollection or from another legacy migration framework, please refer to [Legacy migration](legacy-migration.md) for more information.
{% endhint %}

## Building time: Driver

When use it the annotation approach, you just need to import the required Mongock driver dependency, annotate your SpringBootApplication with **@EnableMongock** and everything is done for you.  All the configuration should be provided via properties file.

However, if you opt for the manual builder approach, you need to create the driver yourself and give it to the Mongock builder.

#### Configuration

Driver configuration is very simple, but there are still a couple of properties you can configure related to the collections and lock parameters

<table>
  <thead>
    <tr>
      <th style="text-align:left">Configuration parameter</th>
      <th style="text-align:left">Default value</th>
      <th style="text-align:left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><b>changeLogRepositoryName</b>
      </td>
      <td style="text-align:left">mongockChangeLock</td>
      <td style="text-align:left">The name of the repository where the change log history will be stored</td>
    </tr>
    <tr>
      <td style="text-align:left"><b>lockRepositoryName</b>
      </td>
      <td style="text-align:left">mongockLock</td>
      <td style="text-align:left">The name of the repository where the pessimistic lock will be stored stored</td>
    </tr>
    <tr>
      <td style="text-align:left">
        <p>&lt;b&gt;&lt;/b&gt;</p>
        <p><b>changeLogCollectionName</b>
        </p>
      </td>
      <td style="text-align:left">mongockChangeLock</td>
      <td style="text-align:left"><b>Deprecated. </b>Use changeLogRepositoryName</td>
    </tr>
    <tr>
      <td style="text-align:left"><b>lockCollectionName</b>
      </td>
      <td style="text-align:left">mongockLock</td>
      <td style="text-align:left"><b>Deprecated. </b>Use lockRepositoryName</td>
    </tr>
    <tr>
      <td style="text-align:left"><b>LockAcquiredForMinutes</b>
      </td>
      <td style="text-align:left">3</td>
      <td style="text-align:left">
        <p></p>
        <p>Number of minutes mongock will acquire the lock for. It will refresh the
          lock when is close to be expired anyway</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><b>maxWaitingForLockMinutes</b>
      </td>
      <td style="text-align:left">4</td>
      <td style="text-align:left">
        <p></p>
        <p>Max minutes mongock will wait for the lock in every try. If the time the
          lock is reserved for is greater than this value, a LockCheckException is
          thrown.</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><b>maxTries</b>
      </td>
      <td style="text-align:left">3</td>
      <td style="text-align:left">
        <p></p>
        <p>Max tries when the lock is held by another mongock instance</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left"><b>indexCreation</b>
      </td>
      <td style="text-align:left">true</td>
      <td style="text-align:left">If false, Mongock won&apos;t create the required indexes for LockCollection
        and ChangeLogCollection.But it will still check they are created, so you
        must do it manually.</td>
    </tr>
    <tr>
      <td style="text-align:left"><b>disableTransaction</b>
      </td>
      <td style="text-align:left">false</td>
      <td style="text-align:left">If true, Mongock won&apos;t use transactions to perform the migration.
        Only available for builder approach, no properties.</td>
    </tr>
  </tbody>
</table>

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  change-log-repository-name: newChangeLogCollectionName
  lock-repository-name: newLockCollectionName
  lock-acquired-for-minutes: 3
  max-waiting-for-lock-minutes: 4
  max-tries: 3
  index-creation: false
```
{% endtab %}

{% tab title="v3-driver" %}
```java
MongoCore3Driver driver = MongoCore3Driver.withDefaultLock(mongoDatabase);
//or .withLockSetting(mongoTemplate, acquiredForMinutes, maxWaitingFor, maxTries);
driver.setChangeLogRepositoryName("newChangeLogCollectionName");
driver.setLockRepositoryName("newLockCollectionName");
driver.setIndexCreation(false);
```
{% endtab %}

{% tab title="sync-v4-driver" %}
```java
MongoSync4Driver driver = MongoSync4Driver.withDefaultLock(mongoDatabase);
//or .withLockSetting(mongoTemplate, acquiredForMinutes, maxWaitingFor, maxTries);
driver.setChangeLogRepositoryName("newChangeLogCollectionName");
driver.setLockRepositoryName("newLockCollectionName");
driver.setIndexCreation(false);
```
{% endtab %}

{% tab title="springdata-v2-driver" %}
```java
SpringDataMongo2Driver driver = SpringDataMongo2Driver
.withDefaultLock(mongoTemplate);
//or .withLockSetting(mongoTemplate, acquiredForMinutes, maxWaitingFor, maxTries);
driver.setChangeLogRepositoryName("newChangeLogCollectionName");
driver.setLockRepositoryName("newLockCollectionName");
driver.setIndexCreation(false);
```
{% endtab %}

{% tab title="springdata-v3-driver" %}
```java
SpringDataMongo3Driver driver = SpringDataMongo3Driver
.withDefaultLock(mongoTemplate);
//or .withLockSetting(mongoTemplate, acquiredForMinutes, maxWaitingFor, maxTries);
driver.setChangeLogRepositoryName("newChangeLogCollectionName");
driver.setLockRepositoryName("newLockCollectionName");
driver.setIndexCreation(false);
```
{% endtab %}
{% endtabs %}

## Transactions

For transactions, please go to [Transactions](transactions.md) section.

