---
title: From version 4 to 5
date: 2014-04-18 11:30:00 
permalink: /v5/from-version-4-to-5/index.html
eleventyNavigation:
  version: v5
  root: true
  order: 100
---

[[TOC]]

### Introduction
Although the migration from version 4 to version 5 is trivial, we want to make you are fully supported.

### Pom changes
- groupId has change from `com.github.cloudyrock.mongock` to `io.mongock`
- BOM version to latest version: [![Maven Central](https://maven-badges.herokuapp.com/maven-central/io.mongock/mongock-driver-mongodb/badge.png)](https://search.maven.org/artifact/io.mongock/mongock-driver-mongodb)

```xml
<dependencyManagement>
   <dependencies>
       <dependency>
           <groupId>io.mongock</groupId>
           <artifactId>mongock-bom</artifactId>
           <version>${latest_version}</version>
           <type>pom</type>
           <scope>import</scope>
       </dependency>
 <!--...-->
</dependencyManagement>
```
- If using Spring, replace `mongock-spring-v5` to `mongock-springboot`

```xml

<dependency>
       <groupId>io.mongock</groupId>
       <artifactId>mongock-springboot</artifactId>
   </dependency>
```

### Mongock packages
| Module               | Version 4                                                            | Version 5 |
|--------------------- | -------------------------------------------------------------------- | -------------------- |
| Spring runner        | com.github.cloudyrock.spring.v5                                      | io.mongock.runner.springboot      |
| Spring runner        | com.github.cloudyrock.spring.util.events                             | io.mongock.runner.spring.base.events |
| Standalone runner    | com.github.cloudyrock.standalone                                     | io.mongock.runner.standalone |
| MongoDB V3 driver    | com.github.cloudyrock.mongock.driver.mongodb.v3                      | io.mongock.driver.mongodb.v3
| MongoDB Sybc4 driver | com.github.cloudyrock.mongock.driver.mongodb.sync.v4                 | io.mongock.driver.mongodb.sync.v4 |
| SpringData V2 driver | com.github.cloudyrock.mongock.driver.mongodb.springdata.v2.decorator | Not changed |
| SpringData V2 driver | com.github.cloudyrock.mongock.driver.mongodb.springdata.v2           | io.mongock.driver.mongodb.springdata.v2 |
| SpringData V3 driver | com.github.cloudyrock.mongock.driver.mongodb.springdata.v3.decorator | Not changed |
| SpringData V2 driver | com.github.cloudyrock.mongock.driver.mongodb.springdata.v3           | io.mongock.driver.mongodb.springdata.v3 |

### Mongock classes
| Module               | Version 4                                                                                 | Version 5 |
|--------------------- | ----------------------------------------------------------------------------------------- | -------------------- |
| Spring runner        | com.github.cloudyrock.spring.v5.MongockSpring5                                            | io.mongock.runner.springboot.MongockSpringboot |
| Spring runner        | com.github.cloudyrock.spring.v5.MongockSpring5.MongockApplicationRunner                   | io.mongock.runner.springboot.base.MongockApplicationRunner |
| Spring runner        | com.github.cloudyrock.spring.v5.MongockSpring5.MongockInitializingBeanRunner              | io.mongock.runner.springboot.base.MongockInitializingBeanRunner |


### Deprecations

#### ChangeLogs/ChangeSets
From Mongock version 5, `@ChangeLog` and `@ChangeSet` annotations are **deprecated** and shouldn't be used. However, these won't be removed for backwards compatibility.

<div class="success">Please follow one of the recommended approaches depending on your use case:
<p>- <b>For existing changeLogs created prior version 5:</b> Leave it untouched, keeping the deprecated annotation.</p>
<p>- <b>For new migrations from version 5:</b> Use the new @ChangeUnit annotation instead.</p>
</div>
<br />

Please visit the [ChangeLog - version 4](https://www.mongock.io/changelogs) section to access the ChangeLog documentation for Version 4. 

For more information about the reason we have adopted this change, please visit our [FAQ section](/faq#changelog-deprecation).



#### MongockTemplate
From version 5, the class `MongockTemplate`is deprecated, but it will always remain in code for backwards compatibility.
We recommend leaving  old changeLogs  untouched (using with the deprecated MongockTemplate), but use Spring MongoTemplate for new
changeLogs.

This class won't be maintained from this version on, meaning this that, regardless of the spring data version imported in the project, and although it will be still compatible(won't produce any compilation or runtime errors due to incompatibilities), MongockTemplate won't provide support to any new  method in the MongoTemplate's API after the version `spring-data-mongodb:4.2.3`. 





