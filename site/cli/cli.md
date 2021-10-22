---
title: CLI  
date: 2014-04-18 11:30:00 
permalink: /cli/index.html
eleventyNavigation:
  root: true
  order: 70
---

[[TOC]]

# Introduction

So far we have explained how to run Mongock as part of your application, normally at the application's startup stage. This section explains how to run those migrations, and other operations, independently from the CLI.

# Steps

## 1. Install CLI 
1. Download the latest version of the **mongock-cli-LATEST_VERSION.zip** from [![Maven Central](https://maven-badges.herokuapp.com/maven-central/io.mongock/mongock-cli/badge.png)](https://repo.maven.apache.org/maven2/io/mongock/mongock-cli/).
2. Unzip it.
3. Open a terminal and locate it inside the unzipped folder.
4. Run the one of the operations available in [opreations page](/cli/operations).


## 2. Prepare your application

### With Springboot
If using Springboot in the application, there is not much to be done. Springboot creates already an uber jar with all the dependencies in it. 

By default the Mongock CLI loads the entire application context. If you want the CLI only to load specific configuration classes that are enough to run the migrations, you can do this annotating your main class with `@MongockCliConfiguration`.

```java
 
//The Mongock CLI will load the configuration from the classes 
//io.your.package.ConfigurationClass1 
//and io.your.package.ConfigurationClass2.

//Theses classes must contain all the beans and 
//configuration needed to run the migration.
@EnableMongock
@MongockCliConfiguration(sources = {
        io.your.package.ConfigurationClass1.class,
        io.your.package.ConfigurationClass2.class
})
@SpringBootApplication
public class SpringBootSpringDataAnnotationBasicApp{
  //...
}
```
<div class="success">When using the builder approach(no <b>@EnableMongock</b>), the RunnerBuilder must be injected as a bean in the application context.</div>

### With standalone

When the application uses the Mongock standalone runner, it needs the following to be able to work with the CLI:
- Implement the interface `MongockBuilderProvider` returning the runner builder used in the application. Notice that should provide an empty constructor that will be used by the CLI.
- Annotate the main class with `@MongockCliConfiguration` providing the `MongockBuilderProvider` implementation class.
- Generate an uber jar from the application, which will be passed to the Mongock CLI in the param `--appJar` Mor information about generating an uber jar with [maven](https://maven.apache.org/plugins/maven-shade-plugin/) and [gradle](https://plugins.gradle.org/plugin/com.github.johnrengelman.shadow).

```java
@MongockCliConfiguration(sources = Application.MongockBuilderProviderImpl.class)
public class Application {

  public static void main(String[] args) {
    //TODO your logic is not executed in the Mongock CLI
  }

  public static class MongockBuilderProviderImpl implements MongockBuilderProvider {
    public RunnerStandaloneBuilder getBuilder() {
      //...calling setter methods
      return MongockStandalone.builder()
    }
  }
}
```

-----------------------------
# Considerations
#### appJar parameter 
The application uber jar (`--appJar` or `-aj`) is one of the mandatory parameters in all the operations(at least those operations interacting with the migration classes, `@ChangeUnit` and `@ChangeLog`). The Mongock CLI takes the migration classes, the dependencies and the runner builder from it.

#### Mongock version in your application 
Mongock CLI requires the application to be upgraded to Mongock version 5.

#### Professional operations

There are some  operations labeled with <span class="professional">PRO</span>. This means it's a professional operation that requires the jar application to use the professional Mongock. Visit [this section](/professional) to use Mongock professional in your application.
