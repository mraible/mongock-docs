---
title: Get started
date: Last Modified 
permalink: /get-started/index.html
eleventyNavigation:
  key: get started 
  title: Get started
  order: 15
---


1. [Steps to run Mongock](#steps-to-run-mongock)
2. [Example](#example)
    2.1. [Add Mongock bom to your Pom file](#add-mongock-bom-to-your-pom-file)
    2.2. [Add the maven dependency for the runner](#add-the-maven-dependency-for-the-runner)
    2.3. [Add the maven dependency for the driver](#add-the-maven-dependency-for-the-driver)
    2.4. [Create your migration script/class](#create-your-migration-script%2Fclass)
    2.5. [Build the runner](#build-the-runner)
    2.6. [Execute the runner](#execute-the-runner)
3. [Resources](#resources)

## Steps to run Mongock

1. Add Mongock bom to your Pom file. Visit [import Mongock BOM](/get-started#add-mongock-bom-to-your-pom-file)
2. Add the maven dependency for the runner. Visit [runner options](/runner/#runner-options)
3. Add the maven dependency for the driver. Visit [driver options](driver/#driver-options)
4. Create your migration script/class. Visit [migration](/migration/)
5. Build the runner. Visit [runner builder](/runner#build)
6. Execute the runner. Visit [execute runner](/runner#build)

--------------------------------------------------

## Example

Mongock provides different runners, from the standalone runner(vanila version) to Springboot, and other frameworks. In this section will show how to use Mongock with Springboot.

Carryng on with our **client-service** example in [what is Mongock?](/what-is-mongock), lets start working with Mongock!

### Add Mongock bom to your Pom file 
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
### Add the maven dependency for the runner
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongock-springboot</artifactId>
</dependency>
```

### Add the maven dependency for the driver
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>mongodb-springdata-v3-driver</artifactId>
</dependency>
```

<p class="successAlt">This assumes we have already added the relevant Spring and Springdata libraries.</p>


### Create your migration script/class

Note that by default, a changeUnit is wrapped in a transaction(natively or by using the database support or manually, when transactions are not supported).
Visit the [transaxction section](/features/transactions-and-manual-rollbacks/) for more information. 

```java
package io.mongock.examples.migration;

import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.RollbackExecution;

@ChangeUnit(id="client-initializer", order = "1", author = "mongock")
public class ClientInitializerChange {

  private final MongoTemplate mongoTemplate;
  private final ThirPartyService thirdPartyService;
  public ClientInitializerChange(MongoTemplate mongoTemplate,
                                 ThirPartyService thirdPartyService) {
    this.mongoTemplate = mongoTemplate;
    this.thirdPartyService = thirdPartyService;
  }

  /** This is the method with the migration code **/
  @Execution
  public void changeSet() {
    thirdPartyService.getData()
      .stream()
      .forEach(client -> mongoTemplate.save(client, CLIENTS_COLLECTION_NAME));
  }

  /**
  This meethod is mandatory even when transactions are enabled.
  They are used in the undo operation and any other scenario where transactions are not an option.
  However, note that when transactions are avialble and Mongock need to rollback, this method is ignored.
  **/
  @RollbackExecution
  public void rollback() {
    mongoTemplate.deleteMany(new Document());
  }
```


### Build the runner
As mentioned in the [runner section](/runner#builder), there are two approaches when comes to build the Mongock runner, the builder and the automatic approach.

For this example, we show the simplest one, the automatic approach.

#### Properties
```yaml
mongock:
  migration-scan-package:
    - io.mongock.examples.migration
```
#### Indicate spring to use Mongock
This approach lies on the underlying framework to provide a smoothly experience. In this case, we take advantage of the Springboot annotations to tell Spring how to run Mongock. However, this approach requires the Spring ApplicationContext, MongoTemplate and MongoTransactionManager to be injected in the Spring context.

```java
@EnableMongock
@SpringBootApplication
public class App {
  public static void main(String[] args) {
    new SpringApplicationBuilder().sources(App.class).run(args);
  }
}
```



### Execute the runner

When using the Springboot runner, you don't need to worry about the execution.  Mongock takes care of it :wink:


Congratulations! Our basic Mongock setup is done. We just need to run our application and we should see something like this in our log.
```
2021-09-17 17:27:42.157  INFO 12878 --- [main] i.m.r.c.e.o.c.MigrationExecutorBase      : APPLIED - ChangeEntry{"id"="client-initializer", "author"="mongock", "class"="ClientInitializer", "method"="changeSet"}
```

--------------------------------------------------

## Resources

You can checkout this [github repository](https://github.com/cloudyrock/mongock-examples) for more examples.
