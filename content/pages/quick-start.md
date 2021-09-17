---
title: Quick start
date: Last Modified 
permalink: /quick-start/index.html
eleventyNavigation:
  key: quick start 
  title: Quick start
  order: 5
---

Carryng on with our **client-service** example, lets see how to start working with Mongock.

Mongock provides different runners, from the standalone runner(vanila version) to Springboot and other frameworks. Even as we have said in previous sections, with the CLI.

Even with Springboot, Mongock provides two approaches: via annotation/properties and manually with a builder.

In this section we'll explain how to get started with Mongock and Springboot with annotation/properties approach, which is the most convenient way.

### 1. Add the maven dependencies to our pom
- **We first need to import the Mongock's bom to our pom. This is to forget about managing the different component's versions**
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.mongock</groupId>
            <artifactId>mongock-bom</artifactId>
            <version>LAST_RELEASE_VERSION_5</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
- **...the runner**
    To see the different runners Mongock provides, visit visit the [runner section](/runner/)
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongock-springboot</artifactId>
</dependency>
```

- **...and finally the driver**
    To see the different drivers Mongock provides, please visit the [driver section](/driver/)
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongodb-springdata-v3-driver</artifactId>
</dependency>
```


<p class="tipAlt">This assumes we have already added the relevant Spring and Springdata libraries.</p>


### 2. Create our changeLog
```java
package io.mongock.examples.changelogs;

public class ClientInitializerChangeLog  implements BasicChangeLog {

  private final MongoTemplate mongoTemplate;
  private final ThirPartyService thirdPartyService;
  public ClientInitializerChangeLog(MongoTemplate mongoTemplate,
                                    ThirPartyService thirdPartyService) {
    this.mongoTemplate = mongoTemplate;
    this.thirdPartyService = thirdPartyService;
  }

  /** This returns the changelog id and must be unique **/
  @Override
  public String geId() {
    return "client-updater";
  }

  /** 
  This returns the order and should be unique among all your changelogs, 
  so the changelogs execution's order is how it's expected to be.
  **/
  @Override
  public String getOrder() {
    return "1";
  }
 
  /** This is the method with the migration code **/
  @Override
  public void changeSet() {
    thirdPartyService.getData()
      .stream()
      .forEach(client -> mongoTemplate.save(client, CLIENTS_COLLECTION_NAME));
  }

  /**
  This meethod is mandatory even transactions are active.
  They are used in the undo operations and any other scenario where transactions are not an option.
  However, note that when transactions are avialble and Mongock need to rollback a changeLog, this method is ignored.
  **/
  @Override
  public void rollback() {
    mongoTemplate.deleteMany(new Document());
  }
```


### 3. Tell Spring to use Mongock 
Although there are manual ways to setup Mongock like using the builder, etc.(visit the [runner section](/runner/) for more information), we are going to show the easiest one, which just requires an annotation in you springboot class and some entries in your properties file.

```Java
@EnableMongock
@SpringBootApplication
public class App {
  public static void main(String[] args) {
    new SpringApplicationBuilder().sources(App.class).run(args);
  }
}
```

### 4. Tell Mongock where to find your changelogs
As mentioned in the previous point, we are providing the configuration via properties file, but this can be done manually with the builder as well.
```yaml
mongock:
  change-logs-scan-package:
    - io.mongock.examples.changelogs
```

### 5. Run your Spring application
Our basic Mongock setup is done. We just need to run our application and we should see something like this in our log.
```
2021-09-17 17:27:42.157  INFO 12878 --- [main] i.m.r.c.e.o.c.MigrationExecutorBase      : APPLIED - ChangeEntry{"id"="client-initializer", "author"="mongock", "class"="ClientInitializerChangeLog", "method"="changeSet"}
```
