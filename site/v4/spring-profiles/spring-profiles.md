---
title: Spring specific features
date: 2014-04-18 11:30:00 
permalink: /v4/spring-profiles/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 9
---

# Spring specific features

## MongockTemplate

As mentioned in  [ChangeLogs](changelogs.md) section, when using Spring, you must use **MongockTemplate,** instead of Spring MongoTemplate. **MongockTemplate** is just a decorator/wrapper providing exactly the same API than MongoTemplate, but ensuring your changes are correctly synchronised. 

You can find the technical reason behind in the [Lock](lock-1.md) section. 

```java
@ChangeSet(order = "005", id = "changeWithMongockTemplate", author = "mongock")
public void changeWithMongockTemplate(MongockTemplate mongockTemplate) {
  mongockTemplate.save(new MyEntity());
}
```

## Profiles

**Mongock** accepts Spring's `org.springframework.context.annotation.Profile` annotation. If a changeLog or changeSet class is annotated with `@Profile`, then it is activated for current application profiles.

<div style="success">
Mongock will automatically pick the active profiles from the Spring `ApplicationContext` . Then you only need to annotate your changeLogs and changeSets.
</div>

**Annotating ChangeLogs and ChangeSets with Profile**

_**Example 1**_: annotated changeSet will be invoked for a `dev` profile

```java
@Profile("dev")
@ChangeSet(author = "mongock", id = "changeSetForDevOnly", order = "01")
public void changeSetForDevOnly(MongoDatabase db){
  // ...
}
```

_**Example 2**_: all change sets in a changeLog will be invoked for a `test` profile

```java
@ChangeLog(order = "1")
@Profile("test")
public class changeLogForTestOnly{

  @ChangeSet(author = "mongock", id = "changeSetForTestOnly", order = "01")
  public void changeSetForTestOnly(MongoDatabase db){
    // ...
  } 
}
```

<div style="info">
Mongock will support in next versions the new Profile expression approach from Spring. Please check our [roadmap]()
</div>

## ApplicationRunner vs InitializingBean

When using Spring runner, you choose what type of bean you want to build; Spring [ApplicationRunner](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/ApplicationRunner.html) bean or a [InitializingBean](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/InitializingBean.html). 

**With annotation approach:**

***ApplicationRunner***
```yaml
mongock:
  change-logs-scan-package:
    - com.github.cloudyrock.mongock...changelogs.client.initializer
  runner-type: applicationrunner
```


***InitializingBean***
```yaml
mongock:
  change-logs-scan-package:
    - com.github.cloudyrock.mongock...changelogs.client.initializer
  runner-type: initializingbean
```



**With traditional builder approach:**

***ApplicationRunner***
```java
MongockSpring5.builder().
    .addChangeLogsScanPackage("changelogs.package.path")
    //...
    .buildApplicationRunner();
```


***InitializingBean***
```java
MongockSpring5.builder().
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.client.initializer")
    //...
    .buildInitializingBeanRunner();
```



