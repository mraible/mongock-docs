---
title: Runner
date: 2014-04-18 11:30:00 
permalink: /v4/standalone/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 5
---

# Runner

In [Main concepts](main-concepts.md#driver) we already mentioned the concept of **runners**. Runners are the ones dealing with the process logic and framework.

## Motivation

While Mongock standalone could be run with any framework, it would be nice that the user has some kind of adaption to take advantage of the underlying frameworks, for any relevant framework in the market. For example, in Spring, been able to use the Spring context, profiles or property files, etc. And once having that, it would be ideal for the user to be able to use version of Mongock adapted to the specific framework's version he is using and once a new version come up and he decide to not upgrade, still having support for the legacy version.

This is the goal of Mongock runners. Currently Mongock only provides support for standalone\(which can be run in any framework\) and Spring 5, but the objective is to provide support for any relevant framework in the market.  


## How it works

Technically, as drivers, runners are simple implementations of the same interface which, providing a bridge between the drivers and the process executor.

The idea is to provide a specific runner for every relevant framework in the market. Open source users will be able to add runners, following the runner specification.

## Runners available

Currently Mongock provides two runners: Mongock standalone and Spring 5. 

### Mongock standalone runner

It does not used any framework support for its execution. Ideally when running standalone Java applications, you want to have all the control of the Mongock instance and when it's executed or when you are using a framework for which there is no specific Mongock runner, you can use Mongock standalone while we develop it.

### Mongock Spring v5 runner

Based on Spring 5 and Spring Boot 2, its objetive to provide the easiest way to run Mongock with it. It provide support for Spring profiles, context, properties, annotation approach based on Spring configuration, etc.

Unlike Mongock standalone, it provides two building approach: the traditional builder approach and annotation approach\(**@EnabbleMongock**\)

## Building time: Runner

When use it the annotation approach, you just need to import the required Mongock runner dependency, annotate your SpringBootApplication with **@EnableMongock** and everything is done for you.  All the configuration should be provided via properties file.

However, if you opt for the manual builder approach, you need to build the runner yourself by using Mongock builder

#### Configuration

| Configuration parameter | Default value | Type | Description | Link |
| :--- | :--- | :--- | :--- | :--- |
| **changeLogScanPackage** | mandatory. At least one. | List&lt;String&gt; | Instructs Mongock where to find the changeLog classes.  | [link](changelogs.md) |
| **springContext** | mandatory for Spring | ApplicationContext | Sets the spring Application context for bean injections into ChangeSet methods. It's where the custom beans, MongoTemplate, profiles, etc. is take from. | [link](further-configuration.md#spring-context) |
| **metadata** | null | Map&lt;String, Object&gt; | Custom data attached to the migration. It will added to all changes in changeLog collection | [link](further-configuration.md#metadata) |
| **startSystemVersion** | "0" | String | System version to start with | [link](further-configuration.md#systemversion) |
| **endSystemVersions** | MAX\_VALUE | String | System version to end with. | [link](further-configuration.md#systemversion) |
| **throwExceptionIfCannot**.... | true | boolean | Mongock will throw MongockException if lock can not be obtained. Builder method **setLockConfig** | [link](lock-1.md) |
| **legacyMigration** | null | Object | Configuration related to migrate from legacy systems. | [link](legacy-migration.md) |
| **trackIgnored** | false | boolean | Specifies if ignored changeSets\(already executed, etc.\) should be track in the changeLog collection with **IGNORED** status | [link](further-configuration.md#trackignored) |
| **enabled** | true | boolean | If false, will disable Mongock execution | [link](further-configuration.md#enable) |

<div style="warning">
When using the builder method **setLockConfig**, which takes lockAcquiredForMinutes, maxWaitingForLockMinutes and maxTries as parameters, **will implicitly set throwExceptionIfCannotObtainLock to true.**
</div>

***Properties***
```yaml
mongock:
  change-logs-scan-package:
    - com.github.cloudyrock.mongock...changelogs.client.initializer
    - com.github.cloudyrock.mongock...changelogs.client.updater
  metadata:
    change-motivation: Missing field in collection
    decided-by: Tom Waugh
  start-system-version: 1.3
  end-system-version: 6.4
  lock-acquired-for-minutes: 10
  max-waiting-for-lock-minutes: 4
  max-tries: 5
  throw-exception-if-cannot-obtain-lock: true
  legacy-migration:
    origin: mongobeeChangeLogCollection
    mapping-fields:
      change-id: legacyChangeIdField
      author: legacyAuthorField
      timestamp: legacyTimestampField
      change-log-class: legacyChangeLogClassField
      change-set-method: legacyChangeSetMethodField
  track-ignored: true
  enabled: true
```

***mongock-spring-v5***
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.client.initializer")
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.client.updater")
    .setSpringContext(springContext)
    .withMetadata(
        new HashMap(){{
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      }})
    .setStartSystemVersion("1.3")
    .setEndSystemVersion("6.4")
    .setLockConfig(10,4,5)
    .setLegacyMigration(new MongockLegacyMigration(
        "mongobeeChangeLogCollection", true, "legacyChangeIdField", "legacyAuthorField", "legacyTimestampField", "legacyChangeLogClassField", "legacyChangeSetMethodField"))
    .setTrackIgnored(true)
    .setEnabled(true)

```

***Standalone***
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.client.initializer")
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.client.updater")
    .withMetadata(
        new HashMap(){{
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      }})
    .setStartSystemVersion("1.3")
    .setEndSystemVersion("6.4")
    .setLockConfig(10,4,5)
    .setLegacyMigration(new MongockLegacyMigration(
        "mongobeeChangeLogCollection", true, "legacyChangeIdField", "legacyAuthorField", "legacyTimestampField", "legacyChangeLogClassField", "legacyChangeSetMethodField"))
    .setTrackIgnored(true)
    .setEnabled(true)
    .execute();
```






##  

