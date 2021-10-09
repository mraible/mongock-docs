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
  <li><a href="#best-practices">Best practices</li>
  <li><strike><a href="#changeLog">ChangeLog</a></strike></li>
</ol>

<p class="tip">The <b>@ChangeLog</b> annotation has been <b>deprecated</b> in favour of the <b>@ChangeUnit</b>. For more information check <a href="/faq#changelog-deprecation">this section</a></p>

## Introduction
 A migration is composed by multiple smaller pieces called ChangeUnits, which are processed in order by the Mongock runner.

ChangeUnits are the unit of migration. These refer to the annotated classes where developers write  migration logic/scripts.

All classes with the `@ChangeUnit` annotation will be scanned by Mongock to execute the migration.

A migration is constituted by an ordered list of ChangeUnits. Each of the ChangeUnits represent a _unit of migration_, which has the following implications:

1. Each ChangeUnit is wrapped in a **transaction:**. 
    - When transactions are possible(transactional environment), Mongock uses the mechanism provided by the database. 
    - On the other hand, in non-transactional environments, Mongock will try to provide an artificial transactional atmosphere by rolling back the failed change manually.
2. In targeted operations, such as `undo`, `upgrade`, etc., the ChangeUnit is the unit of the operation. For example, when performing an `undo` operation, it needs to specify the _ChangeUnitId_ until which all the ChangeUnits are reverted(inclusive).
3. A ChangeUnit has only one migration method, which is marked with the **@Execution** annotation, and a rollback method, annotated with **@RollbackExecution**.

------------------------------------------------------

## ChangeUnit methods

Every class marked as `@ChangeUnit` will be marked as a migration class and can contain methods annotated as follow:

- **@Execution:** The main migration method(Mandatory)
- **@RollbackExecution:** This method basically reverts the changes made by the `@Execution` method. It's mandatory and higly recommended to properly implement it. It can be left empty if developers don't think is required in some scenarios. 
  
  It will be triggered in the two folloing situations
  - When the `@Execution` method fails in a non-transactional environment
  - In recovery operation like **undo**
- **@BeforeExecution:** Optional method that will be executed before the actual migration, meaning this that it won't be part of the transactional and executed in non-transactional context. It's useful to perform DDL operations in database where they are not allowed inside a transaction, like MongoDB, or as preparation for the actual migration. 

This method is treated and tracked in the database history like the `@Execution` method, meaning this that in case of failure, it will force the migration to be aborted, tracked in the database as failed and Mongock will run it again in the next execution.

- **@RollbackBeforeExecution:** Similar to the `@RollbackExecution` for the `@Execution` method. It reverts back the changes made by the `@BeforeExecution` method. It's only mandatory when the method `@BeforeExecution` is present.

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
<p class="successAlt">ChangeUnits accept dependency injections directly in the method and at constructor level</p>

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
## Best practices

- **Don't use persisted objects in your changeUnits**
  Although Mogock provides a powerfull mechanism that allows you to inject any dependency you wish to your changeUnits, these are considered the source of truth and should treated like static resources, once executed shouldn't be changed.
  With this in mind, imagine the scenario you have the class `Client` that represents a table in your database. You create a changeUnit which uses the field `name` of the client. One month later you realise you don't need this field anymore and decide to remove it. If you do that the first changeUnit's code won't compile. This leaves you with two options remove/update the first changeUnit or keep the unneeded field `name`. Any of which is a good option. 

- **ChangeUnits backward compatible**
  While the migration process is taking place, the old version of the software is likely to still be running. During this time could happen(and probably will) that the old version of the software is dealing with the new version of the data. Could even happen that the data is a mix between old and new version. This means the software must still work regardless of the status of the database. In case the developer is aware of this and still decides to provide a non-backward-compatible changeSet, he should know it's a detriment to high availability.

- **2-stage approach** (When HA is important)
  When performing a change that implies an update operation that is likely to leave the code and data in an inconsistent state, we recommend to perform the change in two independent depoyments.
  The first one only provides additions and is compatible with the current deployed code. However, together with the migration, the pertinent code change is also deployed. This code works with the old structure as well as the next change that will be applied. At this point, if the migration was executed, affecting the database but not the code, the services is still fine because the migration didn't produce a bracking change. However we need another step to ensure the code is also deployed. Once this is done, we have the first part of the data migration done(we only have to remove what's not needed anymore) and the code is able to work with the actual version of the data and the next migration that will be applying. The last stage is to do the new deployment with the data migration(which is comoatible with the current code deployed) together with the code reflecting the change. Once again, there are chances that the data migration is done but the service itself(code) doesn't. This is not a problem as the code deployed is also compatible with the new version of the data.
  

- **Light changeUnits**
  Try to wrap your migration in relatively light changeUnits. The concept of light is not universal, but the time to execute a changeUnit shouldn't mean a risk to the application's startup. 
  For example, when using Kubernetes in a transactional environment, if a changeUnit can potentially take longer than the Kubernetes inidial delay, the services will proably fall into a infinite loop. If there is no changeUnit that puts this in risk, the worse case scenario is that the service needs more than one restart to acomplish the entire migration, but eventually it wil.


- **Try to enforce idempotency in your ChangeUnits** (for non-transactional environment)
  In this cases a changeUnit can be interrupted at any time. Mongock will execute again in the next execution. Although you have the rollback feature, in non-transactional environments it's not guranteed that it's executed correctly

- **ChangeUnit reduces its execution time in every iteration** (for non-transactional environment) 
  This is harder to explain. As said, a changeUnit can be interrupted at any time. This means an specific changelog needs to be re-run. In the undesired scenario where the changelog's execution time is grater than the interruption time(could be Kubernetes initial delay), that changelog won't be ever finished. So the changelog needs to be developed in such a way that every iteration reduces its execution time, so eventually, after some iterations, the changelog finished.

------------------------------------------------------
<h2 id="changeLog"><strike>ChangeLog</strike></h2>

From Mongock version 5, **@ChangeLog** and **@ChangeSet** annotations are **deprecated** and shouldn't be used. However, these  won't be removed for backwards compatibility.

<div class="success">Please follow one of the recommended approaches depending on your use case:
<p>- <b>For existing changeLogs created prior version 5:</b> Leave it untoched, keeping thedeprecated annotation.</p>
<p>- <b>For new migrations from version 5:</b> Use the new @ChangeUnit annotation instead.</p>
</div>


Please visit the [ChangeLog - version 4](https://www.mongock.io/changelogs) section to access the ChangeLog documentation for Version 4. 

For more information about the reason we have adopted this change, please visit our [FAQ section](/faq#changelog-deprecation)
