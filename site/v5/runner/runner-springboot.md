---
title: 'Runner: Springboot' 
date: 2014-04-18 11:30:00 
permalink: /v5/runner/springboot/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 65 
  parent: runner
  key: runner springboot
  title: 'Springboot'
---

[[TOC]]

## Introduction
As its name suggests, this runner is the one to use with Springboot. It leverages the Springboot features, like the ApplicationContext, profiles and EventPublisher, to provides a smooth user experience.

It supports both building approaches, builder and autoconfiguration.

<br />

______________________________________


## Get started
Following the [get started section](/get-started#steps-to-run-mongock), this covers steps 2 and 7.

### Add the maven dependency for the runner (step 2)
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongock-springboot</artifactId>
</dependency>
```

### Build the runner (step 7)
Like the rest of the runners, the springboot runner is built from a builder. Each runner provides a class with an static method `builder()`.

Springboot adds an extra mandatory field to the driver and scan class/package(mandatory in all the runners), the **Spring ApplicationContext**, from which all the dependencies injected to your migration classes are taken.

When using the builder approach, you need to provide the driver and ApplicationContext manually to the builder. On the other hand, when using the autoconfiguration approach, Mongock will take the ApplicationContext from Springboot directly and will build the driver, which probably requires you to inject to the context the required parameters. For example the database, MongoTemplate, etc. This depends on the type of Driver you are using. Find more information in the [driver section](/driver).

```java
MongockSpringboot.builder()
    .setDriver(driver)
    .addMigrationScanPackage("com.your.migration.package")
    .setSpringContext(springContext);
```

<br />

______________________________________

## Springboot compatibility
|   Mongock Runner   | Framework  | Version compatibility |
|--------------------|------------|-----------------------|
|  MongockSpringboot | Springboot | 2.X.X                 |

## Configuration
Visit the [configuration section](/runner#configuration) in the runner page to see the list of the basic runner's properties.

<br />

______________________________________

## Features

### Runner type: ApplicationRunner vs InitializingBean

Springboot provides two options to delegate an execution, in this case the migration:
- **ApplicationRunner:** Declaring a bean implementing this interface lets you to execute the code after the Springboot application is started. 
- **InitializingBean:** However, when implementing this interface, the execution is performed before the application is started, but after all the properties and beans are set allows to execute the code after all the beans are set, but before the Springboot application is started.


Mongock takes advantage of this aspects and, on top of the method `buildRunner()`, provides two other options to support the ApplicationRunner and InitializingBean.

When using autoconfiguration, you can set the runner type by configuration with:
```yaml
mongock:
  runner-type: [applicationrunner | initializingbean]
```

Or with builder, with the methods:
- **buildApplicationRunner()**, which returns a MongockApplicationRunner implementation of the Springboot ApplicationRunner.

- **buildInitializingBeanRunner()**, returning a MongockInitializingBeanRunner, implementation of the Springboot InitializingBean. 

Bear in mind that the runner, represented by a MongockApplicationRunner or a MongockInitializingBeanRunner, needs to be register as a bean, as follow:
```java
@Bean
public MongockInitializingBeanRunner mongockRunner(ConnectionDriver driver, ApplicationContext applicationContext) {
    return MongockSpringboot.builder()
           .setDriver()
           .setSpringContext(applicationContext)
//...
           .buildInitializingBeanRunner();
}
```

### Dependency injection
As mentioned in the [get started section](#get-started), the springboot runner takes the dependency injected to the migration classes(`@ChangeUnit` and the deprecated @ChangeLog), from the Springboot ApplicationContext:
```java
MongockSpringboot.builder()
    .setSpringContext(springContext);
```
### Profiles 
Mongock supports the Spring `@Profile` annoation.

When a changeUnit is annotated with `@Profile`, it will only executed if any of the profiles present in the annotation is contained in the Spring activeProfiles array.

### Events
As explained in the [events page](/events), Mongock provides three Events: StartedEvent, SuccessEvent and FailureEvent. In the Springboot world, these are represented by:
- SpringMigrationStartedEvent
- SpringMigrationSuccessEvent
- SpringMigrationFailureEvent

To listen to these events you need to:
- Provide the event publisher to the Mongock builder with the method `setEventPublisher(springApplicationEventPublisher)`.
- Implement the Springboot ApplicationListener interface for the type of event you want to listen.

```java
import io.mongock.runner.spring.base.events.SpringMigrationSuccessEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class MongockSuccessEventListener implements ApplicationListener<SpringMigrationSuccessEvent> {

    @Override
    public void onApplicationEvent(SpringMigrationSuccessEvent event) {
        System.out.println("[EVENT LISTENER] - Mongock finished successfully");
    }
}
```

The [example section](/runner/springboot#examples) shows how to use it in the builder.

<br />

______________________________________

## Examples

### Example with properties
```yaml
mongock:
  change-unit-scan-package:
    - com.your.migration.package1
    - com.your.migration.package2
  metadata:
    change-motivation: Missing field in collection
    decided-by: Tom Waugh
  start-system-version: 1.3
  end-system-version: 6.4
  throw-exception-if-cannot-obtain-lock: true #Default true
  legacy-migration:
    origin: mongobeeChangeLogCollection
    mapping-fields:
      change-id: legacyChangeIdField
      author: legacyAuthorField
      timestamp: legacyTimestampField
      change-log-class: legacyMigrationClassField
      change-set-method: legacyChangeSetMethodField
  track-ignored: false #Default true
  transaction-enabled: true
  runner-type: applicationrunner
  enabled: true #Default true
```

### Example with builder
```java 

builder
    .setDriver(driver)
    .setSpringContext(springApplicationContext)
    .addMigrationScanPackage("com.your.migration.package1")
    .addMigrationScanPackage("com.your.migration.package2")
    .setEventPublisher(springApplicationEventPublisher)
    .withMetadata(
        new HashMap() { {
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      } })
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
    .setTrackIgnored(false)
    .setTransactionEnabled(true)
    .buildInitializingBeanRunner();
```    