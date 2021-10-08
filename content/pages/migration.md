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
ChangeUnits are the unit of migration. These refer to the annotated classes where Developers write  migration logic/scripts.

All classes with the `@ChangeUnit` annotation will be scanned by Mongock to execute the migration.

A migration is constituted by an ordered list of ChangeUnits. Each of the ChangeUnits represent a _unit of migration_, which has the following implications:
- Each ChangeUnit is constitued of:
-- A suite of attributes that set the properties for ChangeUnits such as the ChangeUnit id, the author, etc.
-- A suite of methods that constitute the implementation of a migration.
-- Optional pre-migration methods for the ChangeUnit.
- Each ChangeUnit is wrapped in a **transaction:** Mongock implements Transaction support,  rolling back automatically the migration execution in case of failures. This requires to implement a Rollback method for migration execution for ChangeUnits.
- In targeted operations, such as `undo`, `upgrade`, etc., the ChangeUnit is the unit of the operation. For example, when performing and `undo` operation, it needs to specify the _ChangeUnitId_ until which all the changeunits are reverted.
- A ChangeUnit has only one migration method, which is marked with the **@Execution** annotation. Every execution must be accompanied by a **@RollbackExecution** annotation. 
- Mongock also allows you to prepare your data in a safely manner before the Migration is executed. This will be covered in more depth in the Implementation section. 

## Implementation

Every class marked as `@ChangeUnit` will be marked as a migration. Every ChangeUnit will have methods annotated with the following:
<ul>
  <li><b>@Execution:</b> This annotation marks the migration method in the class. Every ChangeUnit must implement this annotation. </li>
  <li><b>@RollbackExecution:</b> This annotation is used for reverting back changes associated to the execution  method. It will be triggered in case an Execution fails. Every ChangeUnit must implement this annotation.</li>
  <li><b>@BeforeExecution:</b> This annotation is used for preparing data required for the migration execution. This is an optional annotation for a ChangeUnit. It can be useful to perform DDL or Data preparation operations on database engines prior to the execution of the ChangeUnit (outside of the transaction).</li>
  <li><b>@RollbackBeforeExecution:</b> This annotation is used for reverting back any data preparation from the BeforeExecution annotation. This is an optional annotation for a ChangeUnit.</li>
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

### ChangeUnit implementation Example
<p class="tip"> Note that any method accepts parameters. The following example showcases   injections in the ChangeUnit at constructor level.</p>

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
# ChangeLog <a name="changeLog"></a>

<div class="tip">
<b>Note:</b>
<p>From Mongock version 5, <b>@ChangeLog</b> and <b>@ChangeSet</b> annotations are <b>deprecated</b> and shouldn't be used. However, these  won't be removed for backwards compatibility.</p>

<p>Please follow one of the recommended approaches depending on your use case:</p>
<p style="margin-left:4em"><b>- For existing changeLogs/changeSets created prior version 5:</b> Use with the deprecated annotation. </p>
<p style="margin-left:4em"><b>- For new migrations from version 5:</b> use the new <b>@ChangeUnit</b> implementation instead.
</p>
</div>

Please visit the [ChangeLog - version 4](https://www.mongock.io/changelogs) section to access the ChangeLog documentation for Version 4. 

For more information about the reason we have adopted this change, please visit our [faq section](/faq/)
