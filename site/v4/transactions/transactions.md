---
title: Transactions
date: 2014-04-18 11:30:00 
permalink: /v4/transactions/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 11
---

# Transactions

## Introduction

Starting from the 4.0 release, MongoDB supports multi-document ACID transactions. And Mongock now provides support for these native MongoDB transactions, as well as Spring Data transactions.

Before starting to work with MongoDB transactions you may want to check the [official MongoDB documentation](https://docs.mongodb.com/manual/core/transactions/), [multi-document  transaction restrictions](https://docs.mongodb.com/manual/reference/limits/#Multi-document-Transactions) and [Spring Data Reference documentation](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/#mongo.transactions).

## Transactions levels

In Mongock we see 3 transaction levels; per migration\(entire-migration\), per changeSet\(annotated method\) and per changeLog\(annotated class\). 

Currently Mongock only provides support for entire-migration transactions, but we are working to provide the other two levels.

<<<<<<< HEAD
### Migration transaction\(entire-migration\)
=======
#### Migration transaction\(entire-migration\)
>>>>>>> origin/master

With this migration level Mongock will encapsulate all the unexecuted changes and will run them inside the same transaction. If there is any failure, the entire migration rollbacks and therefore Mongock's execution fails.

This migration level is useful because you ensure you don't get any inconsistent data state, but you don't have any control, Mongock just pick everything and wrap it in a transaction, doesn't matter how big the entire migration is. 

You should also take into account MongoDB's limitations such as the maximum documents per transactions.

We recommend **migration transactions** for small migrations, for which you are confident they can be executed in a single transaction without problem.

<<<<<<< HEAD
### ChangeSet transaction

<div class="warning">
This feature is under development. Not available yet
</div>
<br><br>

Opposite to **migration transactions**, there is also changeSet transactions, the smallest level of Mongock transactions. This level will make Mongock to create a new transaction per changeSet. If a changeSet/transaction fails and assuming  it's [fail-fast](/v4/advanced-configuration.md#fail-fast), the committed transactions will stay but Mongock will rollback the failed transaction and won't execute the following ones. In case of a failed transactions is not fail-fast, Mongock will rollback it, but will carry on with the execution.
=======
#### ChangeSet transaction

<div style="warning">
This feature is under development. Not available yet
</div>

Opposite to **migration transactions**, there is also changeSet transactions, the smallest level of Mongock transactions. This level will make Mongock to create a new transaction per changeSet. If a changeSet/transaction fails and assuming  it's [fail-fast](further-configuration.md#fail-fast), the committed transactions will stay but Mongock will rollback the failed transaction and won't execute the following ones. In case of a failed transactions is not fail-fast, Mongock will rollback it, but will carry on with the execution.
>>>>>>> origin/master

ChangeSet migrations are good because of their granularity. You ensure a changeSet is not half-committed while you can progress over executions when unexpected failures happens.

Also it solves  the issue with **migration transactions,** allowing you to commit small "chunks of migration".

However, the cons of this approach is that you will probably want to be flexible when committing your changes and not be restricted to changeSet.

We recommend this level whenever you are confident that all your "migration steps" fit in methods.

### ChangeLog transaction

<div class="warning">
This feature is under development. Not available yet
</div>
<br><br>

This level of transaction is a solution between **migration transaction** and **changeSet transaction**, providing a good trade-off that normally fits the majority of the projects needs.

With this transaction level Mongock takes every unexecuted changeLog and packages it in a transaction. In case of failure, it behaves exactly the same as **changeSet transactions**.

This is the recommended transaction level for several reasons:

* Fits the recommended design approach for migrations. 
* More flexible, allowing you to create the logical transactional groups the way you want, without being forced to adapt it to changeSets or all-or-nothing
* If for any reason the entire migration cannot be executed at once, it can be done in smaller steps, which are committed in every execution, allowing the migration to progress in every iteration.
* Prevent to commit very small transactional units\(changeSets\) in such a way that while the changeSet is committed\(and consistent\), the actual logical migration is half-committed.

## How to use transactions

You don't really need to much to benefit from transactions, however you will need to do some configuration work which will depend on which Mongock driver family you are using, Spring Data or Java MongoDB driver.

### Spring Data

For [Mongock Spring Data drivers](/v4/spring), the only requirement is to provide MongoTransactionManager. If you are using the MongockEnable annotation approach, by adding the MongoTransactionManager to the Spring context is enough, Mongock will pick it up.

On the other hand, if you are using the traditional builder approach, you need to provide the MongoTransactionManager to the Mongock driver by using the method `enableTransactionWithTxManager` 

### MongoDB Driver

When using the [Mongock driver for Java MongoDB driver](/v4/spring) you are forced to use the traditional builder approach, but you don't need to do anything else to work with transaction rather than just build your driver providing the MongoClient and database name.

## Disabling transactions

As you can see, as soon as Mongock sees any possibility of using transactions it will, but sometimes it's not the right decision. For example, you provide the MongoTransactionManager to the Spring context, but don't really want Mongock to use transactions. Or by just constructing the Mongock driver for MongoDB Java driver, it will try to work with transactions, but your MongoDb architecture may not be ready for it.

In those cases, you can disable transactions either via properties\(when EnableMongock annotation approach is used\), with `transaction-enable=false` or by builder, with driver's method `disableTransaction()`

***properties***
```yaml
mongock:
  transaction-enabled: false
```


***driver***
```java
driver.disableTransaction();
```

## Transaction options

When using Spring Data, the transaction will use the transactionManager's, so Mongock's doesn't take any responsibility. However, when using any Mongock driver for Java MongoDB drivers such as MongoSyn5Driver or MongoCore3Driver, you are able to tell Mongock which transaction options to use with the builder method `setTransactionOptions` , which takes a com.mongodb,TransactionOptions as parameter. As default Mongock will use `primary` as **readPreference** and `MAJORITY` as **readConcern** and writeConcern.

Example:

```java
driver.setTransactionOptions(
        TransactionOptions.builder()
        .readPreference(ReadPreference.primary())
        .readConcern(ReadConcern.AVAILABLE)
        .writeConcern(WriteConcern.ACKNOWLEDGED)
        .build()
);
```
