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

# Table of contents
<ol>
  <li><a href="#changeunitTitle">ChangeUnits</a></li>
  <li><a href="#changeLog">ChangeLogs and ChangeSets
    <ol type="1">
      <li><a href="#changeLogDeprecated">Deprecation note</li>
      <li><a href="#changeLog">ChangeLog</li>
      <li><a href="#changeSet">ChangeSet</li>
    </ol>
  </li>
</ol>

# ChangeUnits <a name="changeunitTitle"></a>
ChangeUnits are the unit of migration. These refer to the annotated classes where Developers write the migration logic/scripts.

All classes with the `@ChangeUnit` annotation will be scanned by Mongock to execute the migration.

A migration is constituted by an ordered list of ChangeUnits. Each of the ChangeUnits represent a _unit of migration_, which has the following implications:
- **Each ChangeUnit is wrapped in a transaction:** Mongock implements Transaction support and it will rollback the migration execution in case of failures automatically. This requires to implement a Rollback method for migration execution for ChangeUnits.
- In targeted operations, such as `undo`, `upgrade`, etc., the ChangeUnit is the unit of the operation. For example, when performing and `undo` operation, it needs to specify the _ChangeUnitId_ until which all the changeunits are reverted.
- A ChangeUnit has only one migration method, which is marked with the **@Execution** annotation. Every execution must be accompanied by a **@RollbackExecution** annotation. 
- Mongock also allows you to prepare your data in a safely manner before the Migration is executed. This will be covered in more depth in the Implementation section. 

## Implementation

Every class marked as `@ChangeUnit` will be marked as a migration. Every ChangeUnit will have methods that can be annotated with the following:
<ul>
  <li><b>@Execution:</b> This annotation marks the migration method in the class. Every ChangeUnit must implement this annotation. </li>
  <li><b>@RollbackExecution:</b> This annotation is used for reverting back changes associated to the execution  method. It will be triggered in case an Execution fails. Every ChangeUnit must implement this annotation.</li>
  <li><b>@BeforeExecution:</b> This annotation is used for preparing data required for the migration execution. This is an optional annotation for a ChangeUnit. It is a useful to perform DDL operations on database engines where this kind of operation cannot be part of a transaction.</li>
  <li><b>@RollbackBeforeExecution: This annotation is used for reverting back any data preparation from the BeforeExecution annotation. This is an optional annotation for a ChangeUnit.</b></li>
</ul>

### ChangeUnit attributes
Multiple attributes can be passed to ChangeUnits to configure these. The following table represents the list of attributes that you can set for preparing your migration:

| Method            | Description                                  | Mandatory?  | Default value |
| ----------------- |:---------------------------------------------| :-----------:|:-------------:|
| id           | Returns the ChangeUnit's id that will be stored in the ChangeUnit history table/collection and will the way to identify a ChangeUnit. The combination of this field and the author must be unique among the changeunits|YES|       n/a     |
| order        | Returns the ChangeUnit's execution order. | YES | n/a |
| author       | Returns the ChangeUnit's author. The combination of this and the author must be unique among the changeunits|     NO     | `default-author` |
| runAlways      | Returns whether the ChangeUnit is runAlways or not. For more information, visit the [runner configuration section](/runner/common-configuration/)  | NO | `false` |
| systemVersion| Returns the ChangeUnit's system version. For more information, visit the [runner configuration section](/runner/common-configuration/)| NO | `0` |
| failFast | Returns the ChangeUnit's system version. For more information, visit the [runner configuration section](/runner/common-configuration/)| NO | `0` |

### Example

```java
@ChangeUnit(id="myMigrationChangeUnitId", order = "1", author = "mongock_test", systemVersion = "1")
public class MyMigrationChangeUnit {

  private final MongoTemplate template;
  
  public MyMigrationChangeUnit(MongoTemplate template) {
    this.template = template;
  }

  //Note this method / annotation is Optional
  @BeforeExecution
  public void before() {
    mongoTemplate.createCollection("clients");
  }

  //Note this method / annotation is Optional
  @RollbackBeforeExecution
  public void rollbackBefore() {
    mongoTemplate.dropCollection("clients");
  }

  @Execution
  public void migrationMethod() {
    getClientList()
      .stream()
      .forEach(client -> mongoTemplate.save(client, CLIENTS_COLLECTION_NAME));
  }

  @RollbackExecution
  public void rollback() {
        mongoTemplate.deleteMany(new Document());
  }
}
```



------------------------------------------------------
# ChangeLog <a name="changeLog"></a>

<div class="warningAlt">
From Mongock version 5, `@ChangeLog` and `@ChangeSet` annotations are deprecated and shouldn't be used. However, these  won't be removed for backwards compatibility.

<p>Please follow one of the recommended approaches depending on your use case:</p>
<p style="margin-left:4em"><b>- For existing changeLogs/changeSets created prior version 5: </b> leave them untouched (use with the deprecated annotation) </p>
<p style="margin-left:4em"><b>- For new changeLogs/changeSets created from version 5:</b> ChangeLogs/changeSets implement your changelogs by implementing the interfaces ChangeLog or BasicChangeLog</p>

 From version 5, we have:
  <ul>
  <li> Deprecated the *ChangeLog* in favour of the new *ChangeUnit* class implementation;</li>
  <li> Added new annotations for every change Unit - these are:
    <ul>
      <li><b>@Execution</b></li>
      <li><b>@RollbackExecution</b></li>
      <li><b>@BeforeExecution</b></li>
      <li><b>@RollbackBeforeExecution</b></li>
    </ul>
  </li>
</ul>
</p>

</div>


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




==========

# ChangeLog OLD

<div class="warningAlt">
<p style="margin-left:2em">From Mongock version 5, <b>changeLog annotation is deprecated</b> and shouldn't be used, <b>but won't be removed</b> from the code for backwards compatibility.</p>
<p style="margin-left:2em">Please follow one of the recommended approaches depending on your use case:</p>
<p style="margin-left:4em"><b>- For existing changeLogs/changeSets created prior version 5: </b> leave them untouched (use with the deprecated annotation) </p>
<p style="margin-left:4em"><b>- For new changeLogs/changeSets created from version 5:</b> ChangeLogs/changeSets implement your changelogs by implementing the interfaces ChangeLog or BasicChangeLog</p>
</div>

As we have already mentioned, changelogs are the core of Mongock, they are the main reason for the rest of the components. Here is where you implement the migration.

In simple words a migration is constituted by a ordered list of changelogs, each of them represent the _unit of migration_. This has the following implications:
- **Each change is wrapped in a transaction:** When the targed database doesn't provide transaction support, a manual transaction will take place, which will run the manual rollback provided by the user in case of a failure.
- In targeted operations, such as `undo`, `upgrade`, etc., the changeLog is the unit of the operation. For example, when performing and `undo` operation, it needs to specify the _changelogId_ until which all the changelogs are reverted.
- A changelog has only one migration method, the **changeset**. The other methods are complementary and are only executed when required. We'll explain later in this section.


## Implementation


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
