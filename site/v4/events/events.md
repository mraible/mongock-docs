---
title: Events
date: 2014-04-18 11:30:00 
permalink: /v4/events/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 13
---

# Events
<br><br>
<div class="success">
Feature in beta version and documentation in construction
</div>
<br><br>

# **Since version 4.2.1.BETA**

The goal of Mongock events is to notify when the migration process has finished successfully or with errors, which would probably means the transaction was interrupted or not even started.  
  
Depending on the type of Mongock runner you are using\(standalone or Spring\) you will configure it differently.

# Type of Events

Mongock provides three types of events:
* **Start event:** This event takes place just before starting the migration, after the validation.
* **Success event:** Is raised after the migration runs, if successful. This means, that no exception occurred, they were handled or the failed changeLogs were marked with failFast to false.
* **Failure event:** In contrast, if any of the changeLogs fails and it's not handled, as explained in the previous point, this event will be raised.

Please notice that there is no scenario in which both events, success and failure, are raised together.

## Working with Spring runners
Spring Mongock uses the events framework provided by Spring. This means there are two requirements for events to work with Mongock: 
1. Provide the Spring ApplicationEventPublisher to the builder(_Only needed in case of traditional builder approach. Ignore this if you are using the annotation approach_)
2. Register the ApplicationListeners for the events you wish to subscribe.

```java
//Started Event
import com.github.cloudyrock.spring.util.events.SpringMigrationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
@Component
public class MongockStartedEventListener 
implements ApplicationListener<SpringMigrationStartedEvent> {
    @Override
    public void onApplicationEvent(SpringMigrationStartedEvent event) {
        //TODO implment your business logic
    }
}
```
```java
//Success Event
import com.github.cloudyrock.spring.util.events.SpringMigrationSuccessEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
@Component
public class MongockSuccessEventListener
implements ApplicationListener<SpringMigrationSuccessEvent> {
    @Override
    public void onApplicationEvent(SpringMigrationSuccessEvent event) {
        //TODO implment your business logic
    }
}
```
```java
//Failure Event
import com.github.cloudyrock.spring.util.events.SpringMigrationFailureEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
@Component
public class MongockFailEventListener 
implements ApplicationListener<SpringMigrationFailureEvent> {
    @Override
    public void onApplicationEvent(SpringMigrationFailureEvent event) {
        //TODO implment your business logic
    }
}
```

## Working with Standalone runners

As explained, if you are using the standalone runner, you need to provide explicit handlers for each event at building time.
However, the handler are slightly different depending on which type of event you are subscribing to.

* **Start event:** It requires a Runnable, which is invoked just before the migration and after the Mongock's validation.
* **Success event:** To handle this event, you need to provide to the Mongock builder a Consumer for StandaloneMigrationSuccessEvent.
* **Failure event:** To handle this event, you need to provide to the Mongock builder a Consumer for StandaloneMigrationFailureEvent.

```java
//Started Event
import com.github.cloudyrock.standalone;
MongockStandalone.builder
//...
.setMigrationStartedListener(()-> {/** TODO your business logic  **/ })
```
```java
//Success Event
import com.github.cloudyrock.standalone;
import com.github.cloudyrock.standalone.event.StandaloneMigrationSuccessEvent;
MongockStandalone.builder
//...
.setMigrationSuccessListener(successEvent-> {/** TODO your business logic  **/ })
```
```java
//Failure Event
import com.github.cloudyrock.standalone;
import com.github.cloudyrock.standalone.event.StandaloneMigrationFailureEvent;
MongockStandalone.builder
//...
.setMigrationFailureListener(failureEvent-> {/** TODO your business logic  **/ })
```
