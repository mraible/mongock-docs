---
title: Migration
date: Last Modified 
permalink: /migration/index.html
eleventyNavigation:
  key: changeunit 
  title: Migration
  order: 20
---

<div class="tip">
<b>This page should cover: </b>
<ul>
  <li>A note communicating ChangeLog is deprecated en favour to ChangeUnit with link to ChangeLog section</li>
  <li>ChangeUnit: How to use it , methods etc.</li>
  <li>ChangeLog: Why is deprecated</li>
  <li>ChangeLog: How to use it , methods etc.</li>  
</ul>
</div>


ChangeUnits are the unit of migration. It's here where the developer writes the migration logic/scripts.

Classes with the `@ChangeUnit` annotation will be scanned by Mongock to execute the migration.

A migration is constituted by an ordered list of ChangeUnits, each of them represent the _unit of migration_. This has the following implications:
- **Each change is wrapped in a transaction:** When the target database doesn't provide transaction support, a manual transaction will take place, which will run the manual rollback provided by the user in case of a failure.
- In targeted operations, such as `undo`, `upgrade`, etc., the ChangeUnit is the unit of the operation. For example, when performing and `undo` operation, it needs to specify the _ChangeUnitId_ until which all the changeunits are reverted.
- A ChangeUnit has only one migration method, which is marked with the **@Execution** annotation. Every execution must be accompanied by a **@RollbackExecution** annotation. The other methods are complementary and are only executed when required. These are covered in Implementation section.


## Implementation

  Note: from version 5, we have:
  - Deprecated the *ChangeLog* in favour of a the new *ChangeUnit* implementation;
  - Added new annotations for every change Unit - these are:

 -- Execution: 
 -- RollbackExecution;
 -- BeforeExecution;
 -- RollbackBeforeExecution;


, `BasicChangeUnit`, which provides the minimum methods required to execute a ChangeUnit, and `ChangeUnit`, which extends the first interface to add two methods, `before` and `rollback`, which is explained in the next sections.


In order to create your ChangeUnit you need to implement one of these two interfeces, dependeding on your needs. 


Execution;
RollbackExecution;

BeforeExecution;
RollbackBeforeExecution;



For more information about the reason we have adopted this change, please visit our [faq section](/faq/)


### BasicChangeUnit interface
Basicchangeunits is the basic interface we need to implement and provides the main required methods, `changeSet`, `rollback`, `getId` and `getOrder`, but also some optional ones like `getAuthor`, `isFailFast` and `getSystemVersion` 

| Method            | Description                                  | Mandatory?  | Default value |
| ----------------- |:---------------------------------------------| :-----------:|:-------------:|
| changeSet()       | It's the method that represents the migration. Here is where the user adds the code to perform the change in target system(normally a database)|  YES  |       n/a     |
| rollback()        | It's the method in charge to revert the changes made by the method `changeSet`. It's executed during the `undos` operation as well as in manual rollbacks, when the database doesn't provide support for transactions. It's implementation is highly recommended. However if the developer doesn't want to implement, can be left empty|     YES     |       n/a     |
| getId()           | Returns the ChangeUnit's id that will be stored in the ChangeUnit history table/collection and will the way to identify a ChangeUnit. The combination of this fieldand the author must be unique among the changeunits|YES|       n/a     |
| getOrder()        | Returns the ChangeUnit's execution order. | YES | n/a |
| getAuthor()       | Returns the ChangeUnit's author. The combination of this and the author must be unique among the changeunits|     NO     | `default-author` |
| isFailFast()      | Returns whether the ChangeUnit is runAlways or not. For more information, visit the [runner configuration section](/runner/common-configuration/)  | NO | `false` |
| getSystemVersion()| Returns the ChangeUnit's system version. For more information, visit the [runner configuration section](/runner/common-configuration/)| NO | `0` |

### ChangeUnit
This interface extens `BasicChangeUnit`, providing two more mandatory methods

| Method            | Description                                  | Mandatory?  | Default value |
| ----------------- |:---------------------------------------------| :-----------:|:-------------:|
| before()        | This method will be executed before the changeSet and it won't take part of the ChangeUnit's transaction, if available. Useful to perform DDL operations on database engines where this kind of operation cannot be part of a transaction  | YES | n/a |
| rollbackBefore()| It's the method in charge to revert the changes made by the method `before`. It's executed during the `undos` operation as well as in the rollbacks. During rollbacks it's always executed, even when transactions are available and active, as the method `before` runs always out of the transaction. It's implementation is highly recommended. However if the developer doesn't want to implement, can be left empty | YES | n/a |


### Example

<p class="successAlt"> Note that any method accepts parameters. The dependency <b>injections in changeunits are performed at constructor level</b></p>

```java
public class ClientInitializerChangeUnit  implements ChangeUnit {

  private final MongoTemplate mongoTemplate;

  public ClientInitializerChangeUnit(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  @Override
  public String geId() {
    return "client-initializer";
  }

  @Override
  public String getOrder() {
    return "1";
  }

  @Override
  public void before() {
    mongoTemplate.createCollection("clients");
  }

  @Override
  public void rollbackBefore() {
    mongoTemplate.dropCollection("clients");
  }

  @Override
  public void changeSet() {
    getClientList()
      .stream()
      .forEach(client -> mongoTemplate.save(client, CLIENTS_COLLECTION_NAME));
  }

  @Override
  public void rollback() {
    mongoTemplate.deleteMany(new Document());
  }
```



------------------------------------------------------
# ChangeLog

As we have already mentioned, changelogs are the core of Mongock, they are the main reason for the rest of the components. Here is where you implement the migration.

In simple words a migration is constituted by a ordered list of changelogs, each of them represent the _unit of migration_. This has the following implications:
- **Each change is wrapped in a transaction:** When the targed database doesn't provide transaction support, a manual transaction will take place, which will run the manual rollback provided by the user in case of a failure.
- In targeted operations, such as `undo`, `upgrade`, etc., the changeLog is the unit of the operation. For example, when performing and `undo` operation, it needs to specify the _changelogId_ until which all the changelogs are reverted.
- A changelog has only one migration method, the **changeset**. The other methods are complementary and are only executed when required. We'll explain later in this section.


## Implementation

<div class="warningAlt">
<p style="margin-left:2em">From Mongock version 5, <b>changeLog annotation is deprecated</b> and shouldn't be used, <b>but won't be removed</b> from the code for backwards compatibility.</p>
<p style="margin-left:2em">Please follow one of the recommended approaches depending on your use case:</p>
<p style="margin-left:4em"><b>- For existing changeLogs/changeSets created prior version 5: </b> leave them untouched (use with the deprecated annotation) </p>
<p style="margin-left:4em"><b>- For new changeLogs/changeSets created from version 5:</b> ChangeLogs/changeSets implement your changelogs by implementing the interfaces ChangeLog or BasicChangeLog</p>
</div>

From version 5, we have added two new interfaces, `BasicChangeLog`, which provides the minimum methods required to execute a changelog, and `ChangeLog`, which extends the first interface to add two methods, `before` and `rollback`, which is explained in the next sections.

In order to create your changelog you need to implement one of these two interfeces, dependeding on your needs. 

For more information about the reason we have adopted this change, please visit our [faq section](/faq/)


### BasicChangeLog interface
BasicChangeLogs is the basic interface we need to implement and provides the main required methods, `changeSet`, `rollback`, `getId` and `getOrder`, but also some optional ones like `getAuthor`, `isFailFast` and `getSystemVersion` 

| Method            | Description                                  | Mandatory?  | Default value |
| ----------------- |:---------------------------------------------| :-----------:|:-------------:|
| changeSet()       | It's the method that represents the migration. Here is where the user adds the code to perform the change in target system(normally a database)|  YES  |       n/a     |
| rollback()        | It's the method in charge to revert the changes made by the method `changeSet`. It's executed during the `undos` operation as well as in manual rollbacks, when the database doesn't provide support for transactions. It's implementation is highly recommended. However if the developer doesn't want to implement, can be left empty|     YES     |       n/a     |
| getId()           | Returns the changelog's id that will be stored in the changelog history table/collection and will the way to identify a changelog. The combination of this fieldand the author must be unique among the changelogs|YES|       n/a     |
| getOrder()        | Returns the changelog's execution order. | YES | n/a |
| getAuthor()       | Returns the changelog's author. The combination of this and the author must be unique among the changelogs|     NO     | `default-author` |
| isFailFast()      | Returns whether the changelog is runAlways or not. For more information, visit the [runner configuration section](/runner/common-configuration/)  | NO | `false` |
| getSystemVersion()| Returns the changelog's system version. For more information, visit the [runner configuration section](/runner/common-configuration/)| NO | `0` |

### ChangeLog
This interface extens `BasicChangeLog`, providing two more mandatory methods

| Method            | Description                                  | Mandatory?  | Default value |
| ----------------- |:---------------------------------------------| :-----------:|:-------------:|
| before()        | This method will be executed before the changeSet and it won't take part of the changeLog's transaction, if available. Useful to perform DDL operations on database engines where this kind of operation cannot be part of a transaction  | YES | n/a |
| rollbackBefore()| It's the method in charge to revert the changes made by the method `before`. It's executed during the `undos` operation as well as in the rollbacks. During rollbacks it's always executed, even when transactions are available and active, as the method `before` runs always out of the transaction. It's implementation is highly recommended. However if the developer doesn't want to implement, can be left empty | YES | n/a |


### Example

<p class="successAlt"> Note that any method accepts parameters. The dependency <b>injections in changelogs are performed at constructor level</b></p>

```java
public class ClientInitializerChangeLog  implements ChangeLog {

  private final MongoTemplate mongoTemplate;

  public ClientInitializerChangeLog(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  @Override
  public String geId() {
    return "client-initializer";
  }

  @Override
  public String getOrder() {
    return "1";
  }

  @Override
  public void before() {
    mongoTemplate.createCollection("clients");
  }

  @Override
  public void rollbackBefore() {
    mongoTemplate.dropCollection("clients");
  }

  @Override
  public void changeSet() {
    getClientList()
      .stream()
      .forEach(client -> mongoTemplate.save(client, CLIENTS_COLLECTION_NAME));
  }

  @Override
  public void rollback() {
    mongoTemplate.deleteMany(new Document());
  }
```
