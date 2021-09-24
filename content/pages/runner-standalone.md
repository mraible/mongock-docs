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



The standalone runner is the vanilla version of the Mongock runner. It's a good option when no framework is used. As there is no framework managing the dependency injection, properties, events, etc. these features have to be handled manually.
Currently standalone runner only supports the builder approach(visit the [runner section](/runner/) for more information)

## Get started with standalone runner
Like the rest of runners, the **standalone runner** is built from builder. Each runner provides a class with an static method `builder` which returns the required builder.
```java
MongockStandalone.builder()
```

## Standalone builder: specific methods
### Injecting your own dependencies
 This fearure allows you to inject your own dependencies to you changeUnit classes, in the methods directly or at constructor level. Mongock is intelligent enough to handle it. However you need to somehow provide these dependencies. The standalone builder provides the following methods:

 - **addDependency(Object instance):** Manually adds a dependency to be used in your changeUnits, which can be retrieved by its own type.
 - **addDependency(String name, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a name
 - **addDependency(Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type. This is useful when you have multiple dependencies for the same super type, the way to force to finde by its super type is this method.
 - **addDependency(String name, Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type or name

### Setting the event listener
As we have already mentioned in some previous section, Mongock provides three events: started, success and failure. 

| Event                           | Description                                  | 
| :------------------------------ |:---------------------------------------------|
| **MigrationStartedEvent** | Triggered just before starting the migration.|
| **MigrationSuccessEvent** | Triggered at the end of the migration, if the process successfully finished. It provides the method `getMigrationResult()` to retrieve the migration result. Currently it doesn't provide any value, but it will be extended in the future to provide the execution's result.|
| **MigrationFailureEvent** | Triggered at the end of the migration, if the process failed. With the method `getMigrationResult()`, the object `MigrationFailedResult` is returned, from which we can extract the exception that produced the error, with the method `getException()` |



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


## Ecample: Everything together
```java
  MongockRunner MongockRunner = MongockStandalone.builder()
    .setDriver(MongoSync4Driver.withDefaultLock(mongoClient, MONGODB_DB_NAME))
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.examples.migration")
    .setMigrationStartedListener(MongockEventListener::onStart)
    .setMigrationSuccessListener(MongockEventListener::onSuccess)
    .setMigrationFailureListener(MongockEventListener::onFail)
    .addDependency("my-bean", myBean)
    .buildRunner();
  //...
  mongockRunner.execute();
```