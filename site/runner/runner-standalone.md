---
title: 'Runner: Standalone' 
date: 2014-04-18 11:30:00 
permalink: /runner/standalone/index.html
toc: true
eleventyNavigation:
  order: 60 
  parent: runner
  key: runner standalone
  title: 'Standalone'
---
<!--1. [Introduction](#introduction)
2. [Get started](#get-started)
3. [Features](#features)
   3.1 [Dependency injection](#dependency-injection)
   3.2 [Events](#events)
4. [Example](#example)-->

[[TOC]]
## Introduction
The standalone runner is the vanila runner, totally clean, with no framework. It's mainly used when no framework is configured, although it can be used with any framework, it just doesn't take advantage of the features it provides. The difference from other runners that are built to take the moest of the underlying framework, it requires more involvement from the user. 

For example, while most of frameworks provides an event mechanism out of the box, in this case the user needs to provide the listener manually, as well as inject the dependencies, as no application context is setup. As the reader can guess, this runner only allows the traditional approach.

Currently it only supports the builder approach, with the setter methods. However we are working on providing an option to use a properties file. It would still use the builder, but instead with setter methods, passing a configuration file.
______________________________________

## Get started
Like the rest of the runners, the standalone runner is built from a builder. Each runner provides a class with an static method `builder()`.

Bear in mind that there are two mandatory parameters for all kind of runner: the `driver` and at least one migration package or class
```java
MongockStandalone
  .builder()
  .addMigrationScanPackage("com.your.migration.package")
  .setDriver(driver);
```
______________________________________

## Configuration
Visit the [configuration section](/runner#configuration) in the runner page to see the list of the basic runner's properties.
______________________________________

## Features
### Dependency injection
 This fearure allows you to inject your own dependencies to you migration classes in the methods directly or at constructor level. Mongock is intelligent enough to handle it. However you need to somehow provide these dependencies. The standalone builder provides the following methods:

 - **addDependency(Object instance):** Manually adds a dependency to be used in your changeUnits, which can be retrieved by its own type.
 - **addDependency(String name, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a name
 - **addDependency(Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type. This is useful when you have multiple dependencies for the same super type, the way to force to finde by its super type is this method.
 - **addDependency(String name, Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type or name

The [example section](#example) shows how to use it in the builder.

### Events
As explained in the [events page](/events), Mongock provides three Events: StartedEvent, SuccessEvent and FailureEvent. In the standalone context are represented by:
- MigrationStartedEvent
- MigrationSuccessEvent
- MigrationFailureEvent

As there is no framwework managing the dependencies, we need to manually inject the listner for each event type, which are basically Java consumers.
- **setMigrationStartedListener(Consumer< MigrationStartedEvent >  listener)**
- **setMigrationSuccessListener(Consumer< MigrationSuccessEvent > listener)**
- **setMigrationFailureListener(Consumer< MigrationFailureEvent > listener)**

```java 
import io.mongock.runner.core.event.MigrationFailureEvent;
import io.mongock.runner.core.event.MigrationStartedEvent;
import io.mongock.runner.core.event.MigrationSuccessEvent;

public class MongockEventListener {

  public static void onStart(MigrationStartedEvent event) {
    System.out.println("[EVENT LISTENER] - Mongock STARTED successfully");
  }

  public static void onSuccess(MigrationSuccessEvent event) {
    System.out.println("[EVENT LISTENER] - Mongock finished successfully");
  }

  public static void onFail(MigrationFailureEvent event) {
    System.out.println("[EVENT LISTENER] - Mongock finished with failures: "
            + event.getMigrationResult().getException().getMessage());
  }
}
```

The [example section](/runner/standalone#example) shows how to use it in the builder.
______________________________________

## Example
```java
MongockRunner MongockRunner = MongockStandalone.builder()
//mandatory methods
    .setDriver(MongoSync4Driver.withDefaultLock(mongoClient, MONGODB_DB_NAME))
    .addMigrationScanPackages("io.mongock.examples.migrationPackage")
//optional methods
    .addMigrationScanPackages("io.mongock.examples.anotherMigrationPackage")
    .setMigrationStartedListener(MongockEventListener::onStart)
    .setMigrationSuccessListener(MongockEventListener::onSuccess)
    .setMigrationFailureListener(MongockEventListener::onFail)
    .addDependency("my-bean", myBean)
    .withMetadata(
        new HashMap(){{
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      }})
    .setStartSystemVersion("1.3")
    .setEndSystemVersion("6.4")    
    .setLegacyMigration(new MongockLegacyMigration(
        "mongobeeChangeLogCollection", 
        true, 
        "legacyChangeIdField", 
        "legacyAuthorField", 
        "legacyTimestampField", 
        "legacyChangeLogClassField", 
        "legacyChangeSetMethodField"))
    .setTrackIgnored(false)//default false
    .setEnabled(true)//default true
    .dontFailIfCannotAcquireLock()//by default, it does throw a MongockException
    .buildRunner();
  //...
  mongockRunner.execute();

```