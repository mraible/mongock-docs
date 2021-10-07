---
title: 'Runner: Standalone' 
date: Last Modified 
permalink: /runner/standalone/index.html
toc: true
eleventyNavigation:
  order: 60 
  parent: runner
  key: runner standalone
  title: 'Standalone'
---
1. [Introduction](#introduction)
2. [Get started](#get-started)
3. [Features](#features)
   3.1 [Dependency injection](#dependency-injection)
   3.2 [Events](#events)
4. [Example](#example)

## Introduction
The vanila version of the runners. It's mainly used when no framework is setup. It's provides mostly all the features the others do, but it obviously requires more involvement from the user to specify how to do it. For example, while most of frameworks provides an event mechanism out of the box, in this case the user needs to provide the listener manually, as well as inject the dependencies, as no application context is setup. As the reader can guess, this runner only allows the traditional approach.

Currently it only supports the builder approach, with the setter methods. However we are working on providing an option to use a properties file. It would still use the builder, 
but instead with setter methods, passing a configuration file.

## Get started
Like the rest of the runners, the **standalone runner** is built from a builder. Each runner provides a class with an static method `builder()`.

```java
MongockStandalone.builder();
```

## Features
### Dependency injection
 This fearure allows you to inject your own dependencies to you migration classes in the methods directly or at constructor level. Mongock is intelligent enough to handle it. However you need to somehow provide these dependencies. The standalone builder provides the following methods:

 - **addDependency(Object instance):** Manually adds a dependency to be used in your changeUnits, which can be retrieved by its own type.
 - **addDependency(String name, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a name
 - **addDependency(Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type. This is useful when you have multiple dependencies for the same super type, the way to force to finde by its super type is this method.
 - **addDependency(String name, Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type or name

The [example section](#example) shows how to use it in the builder.

### Events
This section explains how to configure the Mongock events handler witht the standalone runner. For more information about events, go to the [event page](/features/events/).

<!--| Event                           | Description                                  | 
| :------------------------------ |:---------------------------------------------|
| **MigrationStartedEvent** | Triggered just before starting the migration.|
| **MigrationSuccessEvent** | Triggered at the end of the migration, if the process successfully finished. It provides the method `getMigrationResult()` to retrieve the migration result. Currently it doesn't provide any value, but it will be extended in the future to provide the execution's result.|
| **MigrationFailureEvent** | Triggered at the end of the migration, if the process failed. With the method `getMigrationResult()`, the object `MigrationFailedResult` is returned, from which we can extract the exception that produced the error, with the method `getException()` |
-->


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