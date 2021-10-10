---
title: 'Legacy migration' 
date: 2014-04-18 11:30:00 +0800 
permalink: /features/legacy-migration/index.html
toc: true
eleventyNavigation:
  order: 1130 
  parent: features
  key: features legacy migration
  title: 'Legacy migration'
---

<!--1. [Introduction](#introduction)
2. [Get started](#get-started)
3. [Legacy migration properties table](#legacy-migration-properties-table)
4. [Mongobee scenario](#mongobee-scenario)-->

[[TOC]]

## Introduction
Sometimes you want to migrate to Mongock from another framework you have been using, for example Mongobee. This is what we mean by legacy migration.

## Get started

The best way to explain the concept to developers is to provide some code.

Properties
```yaml
mongock:
#...other configuration
  legacy-migration:
    origin: legacy-changelog-collection-or-table
    changes-count-expectation: 2
    run-always: false
    mapping-fields:
      change-id: legacyChangeIdField
      author: legacyAuthorField
      timestamp: legacyTimestampField
      change-log-class: legacyChangeLogClassField
      change-set-method: legacyChangeSetMethodField
      metadata: legacyMetadataField
```

Builder
```java
LegacyMigrationMappingFields field = new LegacyMigrationMappingFields();
field.setChangeId("legacyChangeIdField");
field.setAuthor("legacyAuthorField");
field.setTimestamp("legacyTimestampField");
field.setChangeLogClass("legacyChangeLogClassField");
field.setChangeSetMethod("legacyChangeSetMethodField");
    field.setMetadata("legacyMetadataField");

MongockLegacyMigration legacyMigration = new MongockLegacyMigration();
legacyMigration.setOrigin("legacy-changelog-collection-or-table");
legacyMigration.setChangesCountExpectation(2);
legacyMigration.setRunAlways(false);
legacyMigration.setMappingFields(field);

builder.setLegacyMigration(legacyMigration); 
//other configuration
```

With this, Mongock will run a process(just once, run-always=false), taking all the changes in the collection `legacy-changelog-collection-or-table` (collection/table name), will map the fields(changeId, author, timestamp, changeLogClass, changeSetMethod and metadata) from the ones specified in the mapping-fields property.

Once finished, if the property changes-count-expectation is specified, will throw an exception if the number of changes migrated doesn't match the value introduced, in the example, 2.

## Legacy migration properties table

| **Field** | **Type** | **Default** | **Description** |
| :--- | :---: | :---: | :--- |
| **origin** | **String** | **Mandatory**  | **Name of the repository origin where Mongock will find the changes already applied by another framework** |
| collection-name | String | Mandatory  | **Deprecated.** Use origin instead |
| changes-count-expectation | String | optional | Expected number of changes that must be migrated. If this property is not specified, Mongock won't perform any check. |
| run-always | String | optional | If true, Mongock will run this process in every execution. False by default. |
| mapping-fields | Map | optional | This tells Mongock how to map the fields from the legacy changeLog collection to the Mongock's one. If not specified, will take the default values as indicated in the following table. |

### Mapping-fields

| **Field** | **Type** | **Default** | **Description** |
| :--- | :---: | :---: | :--- |
| change-id | String | Mandatory  | Specifies where Mongock will take the values for the field `changeId` in the Mongock's collection `mongockChangeLog`. Default value `changeId` |
| author | String | optional | Specifies where Mongock will take the values for the field `author` in the Mongock's collection `mongockChangeLog`. Default value `author` |
| timestamp | String | optional | Specifies where Mongock will take the values for the field `timestamp` in the Mongock's collection `mongockChangeLog`. Default value `timestamp` |
| change-log-class | String | optional | Specifies where Mongock will take the values for the field `changeLogClass` in the Mongock's collection `mongockChangeLog`. Default value `changeLogClass` |
| change-set-method | String | optional | Specifies where Mongock will take the values for the field `changeSetMethod` in the Mongock's collection `mongockChangeLog`. Default value `changeSetMethod` |

## Mongobee scenario

Migrating from the deprecated framework Mongobee will be probably the most common case for legacy migrations. 

Although Mongock has evolved and become a much more powerful and sophisticated framework than its predecessor , it initially started as a Mongobee fork. That's why they share the core fields in the changeLog collection. This makes very easy the migration from Mongobee to Mongock.

<p class="successAlt">When migrating from Mongobee to Mongock, you only need to specify the <b>legacy-migration.origin</b> property, whose value will be most of the times <b>legacy-changelog-collection-or-table</b></p>
