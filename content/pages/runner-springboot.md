---
title: 'Runner: Springboot' 
date: Last Modified 
permalink: /runner/springboot/index.html
toc: true
eleventyNavigation:
  order: 65 
  parent: runner
  key: runner springboot
  title: 'Springboot'
---


<div class="tip">
<b>This page should cover: </b>
<ul>
  <li>introduction: Explain what is, when should be used and pros/cons</li>
  <li>Get started: MongockStandalone.builder()</li>
  <li>Features: custom dependencies, events, etc.</li>
  <li>Examples with all the properties: builder</li>
  <li>Examples with all the properties: properties</li>
</ul>
</div>


## What was in the runner root page
This is the specialization for Springboot framework. It takes advantage of all the Springboot features, such as profiles, events, environment, dependency injections, ApplicationRunner, InitializingBean, etc. This runner provides both approaches(traditional and properties) and you can learn more about it by visiting the [springboot runner section](/runner/springboot/)




Mongock Sprinboot runner is the extension for Springboot framework, providing a smoothly experience and taking advantage of framework's features. 



## Get started with standalone runner

Like the rest of runners, the **springboot runner** is built from builder. Each runner provides a class with an static method `builder` which returns the required builder.

```java
MongockSpringboot.builder()
```

## Springboot builder: specific methods
### Setting the ApplicationContext
The application context is one of the key aspects of the Springboot runner. With it, Mongock retrieves the dependencies that are injected to the changeUnits, spring profiles, etc. 
```java 
 MongockSpringboot.builder()
  //...
    .setSpringContext(springContext)
``` 
### Setting the event publisher
As we have already mentioned in some previous section, Mongock provides three events: started, success and failure. We explain in a section below how to create the event listener for this events, but first we need to provide the event publisher.
```java 
 MongockSpringboot.builder()
  //...
    .setEventPublisher(eventPublisher)
``` 

### Building the runner

We have mentioned that all the Mongock runners provide the basic method `buildRunner()`, but each one can also provide other complementary methods. In this aspect, when using Springboot, it;s not likely you use this method directly. The proper way is to use one of the following methods that wrap the execution and adds some extra functionallity.

- **buildApplicationRunner():** It returns a Spring ApplicationRunner instance, that handles the runner's execution. In a nutshell, the Spring ApplicationRunner interface lets you to execute the code after the Springboot application is started. 
- **buildInitializingBeanRunner():** It returns a Spring InitializingBean instace, that handles the runner's execution. Basically Springboot allows to execute the code after all the beans are set, but before the Springboot application is started.


### Builder example
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

## Springboot features

### Profiles

Mongock supports the Spring @Profile annoation. 

When a changeUnit is annotated with @Profile, it will only executed if any of the profiles present in the annotation is contained in the Spring activeProfiles array.


### Event listener

As we have already mentioned, Mongock provides three events, started, success and failure events.



| Event                           | Description                                  | 
| :------------------------------ |:---------------------------------------------|
| **SpringMigrationStartedEvent** | Triggered just before starting the migration.|
| **SpringMigrationSuccessEvent** | Triggered at the end of the migration, if the process successfully finished. It provides the method `getMigrationResult()` to retrieve the migration result. Currently it doesn't provide any value, but it will be extended in the future to provide the execution's result.|
| **SpringMigrationFailureEvent** | Triggered at the end of the migration, if the process failed. With the method `getMigrationResult()`, the object `MigrationFailedResult` is returned, from which we can extract the exception that produced the error, with the method `getException()` |


#### Creating the event listener
This task is as easy as Spring makes it. The developer only needs to implement the interface `org.springframework.context.ApplicationListener` for any event he wants to register to and inject the bean to the Spring context.

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

```java 

import io.mongock.runner.spring.base.events.SpringMigrationFailureEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class MongockFailEventListener implements ApplicationListener<SpringMigrationFailureEvent> {

    @Override
    public void onApplicationEvent(SpringMigrationFailureEvent event) {
        System.out.println("[EVENT LISTENER] - Mongock finished with failures: " 
                + event.getMigrationResult().getException().getMessage());
    }

}

```




