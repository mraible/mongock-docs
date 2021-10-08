---
title: Migration
date: Last Modified 
permalink: /migration/index.html
eleventyNavigation:
  key: changeunit 
  title: Migration
  order: 20
---


<ol>
  <li><a href="#introduction">Introduction</a></li>
  <li><a href="#changeunit-methods">ChangeUnit methods</a></li>
  <li><a href="#changeunit-attributes">ChangeUnit attributes</a></li>
  <li><a href="#changeunit-example">ChangeUnit example</li>
  <li><strike><a href="#changeLog">ChangeLog</a><strike></li>
</ol>

<p class="tip">The <b>@ChangeLog</b> annotation has been <b>deprecated</b> in favour of the <b>@ChangeUnit</b>. For more information check <a href="/faq#changelog-deprecation">this section</a></p>

## Introduction
 A migration is composed by multiple smaller pieces called changeUnits, which are processed in order by the Mongock runner.

ChangeUnits are the unit of migration. These refer to the annotated classes where developers write  migration logic/scripts.

All classes with the `@ChangeUnit` annotation will be scanned by Mongock to execute the migration.

A migration is constituted by an ordered list of ChangeUnits. Each of the ChangeUnits represent a _unit of migration_, which has the following implications:

1. Each ChangeUnit is wrapped in a **transaction:**. 
    - When transactions are possible(transactional environment), Mongock uses the mechanism provided by the database. 
    - On the other hand, in non-transactional environments, Mongock will try to provide an artificial transactional atmosphere by rolling back the failed change manually.
2. In targeted operations, such as `undo`, `upgrade`, etc., the ChangeUnit is the unit of the operation. For example, when performing an `undo` operation, it needs to specify the _ChangeUnitId_ until which all the changeunits are reverted(inclusive).
3. A ChangeUnit has only one migration method, which is marked with the **@Execution** annotation, and a rollback method, annotated with **@RollbackExecution**.

------------------------------------------------------

## ChangeUnit methods

Every class marked as `@ChangeUnit` will be marked as a migration class and can contain methods annotated as follow:

- **@Execution:** The main migration method(Mandatory)
- **@RollbackExecution:** This method basically reverts the changes made by the `@Execution` method. It's mandatory and higly recommended to properly implement it. If the developers is confident it won't be needed, it can be left empty. 
  
  It will be triggered in the two folloing situations
  - When the `@Execution` method fails in a non-transactional environment
  - In recovery operation like **undo**
- **@BeforeExecution:** Optional method that will be executed before the actual migration, meaning this that it won't be part of the transactional and executed in non-transactional context. 
  It's useful to perform DDL operations in database where they are not allowed inside a transaction, like MongoDB, or as preparation for the actual migration. 
  
  Bear in mind that this method is treated and tracked in the database history like the `@Execution` method, meaning this that in case of failure, it will force the migration to be aborted, tracked in the database as failed and Mongock will run it again in the next execution. 
- **@RollbackBeforeExecution:** Like the `@RollbackExecution` for the `@Execution` method, it's work is basically revert the changes made by the `@BeforeExecution` method. It's only mandatory when the method `@BeforeExecution` is present.

------------------------------------------------------

## ChangeUnit attributes
Multiple attributes can be passed to ChangeUnits to configure these. The following table represents the list of attributes that you can set for preparing your migration:

| Method            | Description                                  | Mandatory?  | Default value |
| ----------------- |:---------------------------------------------| :-----------:|:-------------:|
| id           | Returns the ChangeUnit's id that will be stored in the ChangeUnit history table/collection and will the way to identify a ChangeUnit. The combination of this field and the author must be unique among the changeunits|YES|       n/a     |
| order        | Returns the ChangeUnit's execution order. | YES | n/a |
| author       | Returns the ChangeUnit's author. The combination of this and the author must be unique among the changeunits|     NO     | `default-author` |
| runAlways      | Returns whether the ChangeUnit is runAlways or not. For more information, visit the [runner configuration section](/runner/common-configuration/)  | NO | `false` |
| systemVersion| Returns the ChangeUnit's system version. For more information, visit the [runner configuration section](/runner/common-configuration/)| NO | `0` |

------------------------------------------------------

## ChangeUnit example
<p class="successAlt">ChangeUnits accept dependency injections directly at the method, as well as at constructor level</p>

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
    getClientDocuments()
      .stream()
      .forEach(clientDocument -> mongoTemplate.save(clientDocument, CLIENTS_COLLECTION_NAME));
  }

  @RollbackExecution
  public void rollback() {
        mongoTemplate.deleteMany(new Document());
  }
}
```


------------------------------------------------------
<h2 id="changelog"><strike>Changelog</strike></h2>

From Mongock version 5, **@ChangeLog** and **@ChangeSet** annotations are **deprecated** and shouldn't be used. However, these  won't be removed for backwards compatibility.

<div class="success">Please follow one of the recommended approaches depending on your use case:
<p>- <b>For existing changeLogs created prior version 5:</b> Leave it untoched, keeping thedeprecated annotation.</p>
<p>- <b>For new migrations from version 5:</b> Use the new @ChangeUnit annotation instead.</p>
</div>


Please visit the [ChangeLog - version 4](https://www.mongock.io/changelogs) section to access the ChangeLog documentation for Version 4. 

For more information about the reason we have adopted this change, please visit our [faq section](/faq#changelog-deprecation)
