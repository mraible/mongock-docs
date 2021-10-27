---
title: Main concepts
date: 2014-04-18 11:30:00 
permalink: /v4/main-concepts/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 1
---

# Main concepts

This page explains all the essential concepts you will need to know to understand what Mongock is and how it works. 

## Mongock structure

Mongock consists in 3 main type of objects: ChangeLogs, driver and runner. Builders are simply used to configure and build these 3 components.

## ChangeLogs

A Mongock executable process a set of **changeLogs**, which are the classes that will contain the actual migration. A **changeLog** consists in a bunch of methods called **changeSet**, which is a single task \(set of instructions made on a database\)**.** In other words a changeLog is a class annotated with `@ChangeLog` and containing methods annotated with `@ChangeSet.`ChangeLogs will be explained further in [Creating changeLogs](/v4/changelogs)

We recommend to read our best practices for creating and designing changeLogs.

```java
@ChangeLog(order = "1")
public class ClientInitializerChangeLog {

    @ChangeSet(id = "data-initializer", author = "mongock", order = "001")
    public void ClientInitializer(ClientRepository clientRepository) {
        List<Client> clients = IntStream.range(0, INITIAL_CLIENTS)
                .mapToObj(i -> new Client(i))
                .collect(Collectors.toList());
        clientRepository.saveAll(clients);
    }
}
```

## Driver

This is the Mongock's driver concept taken to a lower level: MongoDB version, MongoDB Java driver and library. The driver is responsible for dealing with the specific database driver or library wrapping the database access such as [Spring data](https://spring.io/projects/spring-data-mongodb). Currently Mongock provides the following drivers:

* mongodb-v3-driver
* mongodb-sync-v4-driver
* mongodb-springdata-v2-driver
* mongodb-springdata-v3-driver

```java
MongockConnectionDriver driver = new SpringDataMongo3Driver(mongoTemplate);
```

Although one of the main goals of this is to keep providing support for legacy drivers, while continue adding new drivers, once a new version\(for example sync-4-driver\) is added, the legacy one\(v3-driver\) will be still supported, but not evolved, meaning this that we won't provide any new feature for it, just bug fixes. 

## Runner

This is also the same Mongock concept, just specialised for MongoDB. Runners are the ones dealing with the process logic and framework. For example, there is a runner for Java standalone applications\(with no framework at all\) or for specific frameworks\(and versions\), if it's needed or useful. Currently Mongock provides the following runners:

* mongock-standalone
* mongock-spring-v5

As drivers, legacy versions of the same driver will be supported\(subscribed to the support policy applied\), but won't be enhanced. 

<div class="tip">
When using MongockStandalone, once you have built the runner instance,  you will need to run it manually with <b>runner.execute()</b>
</div>

## Builder

Once again, it's the same as the Mongock concept: The mechanism to build a Mongock instance\(with the specific driver\) to process your migrations. 

In version 4, we have added a new approach in Spring based on annotation that makes all the work for you. However, if you need to have more control over the bean creation or you are not using Spring or any other reason, you still have the manual builder approach available.


```java
//Spring 5 ApplicationRunner Example
MongockSpring5.builder()
        .setDriver(getDriver())
        .addChangeLogsScanPackages("changelogs_package_path")
        .setSpringContext(springContext)
        .buildApplicationRunner();
```


```java
//Spring 5 InitializingBean Example
MongockSpring5.builder()
        .setDriver(getDriver())
        .addChangeLogsScanPackages("changelogs_package_path")
        .setSpringContext(springContext)
        .buildInitializingBeanRunner();
```

```java
//Standalone Example
MongockStandalone.Runner runner = MongockStandalone.builder()
        .setDriver(getDriver())
        .addChangeLogsScanPackage("changelogs_package_path")
        .buildRunner();
// when using standalone runner, you need to run it manually
runner.execute();
```

<div class="tip">
Annotation approach is the recommended way when using Spring, however you still have the builder approach if you need more control, you are not using Spring or simply you are more comfortable with it.
</div>

