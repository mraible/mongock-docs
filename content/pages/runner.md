---
title: Runner
date: Last Modified 
permalink: /runner/index.html
eleventyNavigation:
  key: runner 
  title: Runner
  order: 45
---
<div class="tip">
<b>This page should cover: </b>
<ul>
  <li>Explain how it works(steps): Configuration(properties and components like driver, applicationContext, etc.), build and execute runner </li>
  <li>Explain builder and both approach: Builder and properties approach</li>
  <li>list options with link to page: standalone and springboot</li>
  <li>Properties table(missing driver)</li>
</ul>
</div>


We have already explained briefly the role of the **runner**  within the Mongock architectur and how it interacts with the rest of the components in the section [how it works](/how-it-works/). 

In a nutshell the runner is the orchestartor dealing with the process logic, configuration, dependencies, framework and any environmental aspect. It's the glue that puts together all the components as well as the decision maker.

------------------------------------------------

## Build
In order to use the Mongock runner, we need to set it up by passing the configuration(migration package, etc.), any required component, like the driver, and any framework dependency such as the ApplicationContext, etc.

### Configuration

> Note when using properties faile, you need to add the prefix **mongock**

| Property                            | Description                                                                                  | Type                | Default value |
| ------------------------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------:|
| **migrationScanPackage**            | The list of migration(changeUnits and changeLogs) classes and/or packages where they are stored | List< String >      |Mandatory |  
| **metadata**                        | Custom data attached to the migration. It will be added to change entry in the mongock table/collection  | Map<String, Object> | null |  
| **startSystemVersion**              | System version to start with                                                                 | String              | `0` |  
| **endSystemVersions**               | System version to end with                                                                   | String              | MAX_VALUE |  
| **trackIgnored**                    | Specifies if an ignored changeUnit(already executed for example) should be track in the Mongock table/collection with status IGNORED | boolean | `false` |  
| **enabled**                         | If false, will disable Mongock execution| boolean |NO          | `true` |  
| **serviceIdentifier**               | Application/service instance's indentifier | String | null|
| **defaultMigrationAuthor**          | Author field is not mandatory in ChangeUnit. The field `author` in this annoation is optional. However for backward compatibility it's still required. If it's provided in the ChangeUnit annotation, this value is taken. If not, Mongock will look at this property. If not provided, the default value is provided| String | `default_author` |
| **throwExceptionIfCannotObtainLock**| ngock will throw MongockException if lock can not be obtained. Builder method setLockConfig| boolean | long | `true` |  
| **transactionEnabled**              | Indicates the whether transaction is enabled. For backward compatibility, this property is not mandatory but it will in coming versions. It works together with the driver under the following agreement: Transactions are enabled only if the driver is transactionable and this field is `true` or not provided. If it's `false`, transactions are disabled and will throw an exception if this field is `true` and the driver is not transactionable. To understand what _transactionable_ means in the context of the driver and how to make a driver transactionable, visit the section [driver](/driver/)      | boolean | null |  
| **transactionStrategy**             | Dictates the transaction strategy. `CHANGE_UNIT` means each changeUnit(applied to deprecated changeLog as well) is wrapped in an independent transaction.`EXECUTION` strategy means that Mongock will wrap all the changeUnits in a single transaction. Note that Mongock higly recomend the default value, `CHANGE_UNIT`, as the `EXECUTION` strategy is unnatural and, unless it's really designed for it, it can cause some troubles along the way | String | `CHANGE_UNIT` |  

 <p class="tipAlt">Note that each specific runner may add their own properties.</p>


### Injecting components
The previous section explains how to inject the configuration(properties), which are just data. However, we also need to inject some components to the runner.

Depending on the runner, you have different components to inject(ApplicationContext, EventListener, etc.), but there is one that is always required: the [driver](/driver/).

In a nutshell the driver is the component dealing with the persistent layer. Some of its responsabilities are: persist the migration history and the distributed lock. 

When using the **builder approach** you need to instanstiate the required driver and add it with the builder method `setDriver`.

With the **properties approach** all this is hidden and managed by Mongock and you don't really need to do much, just making sure the driver has somehow(we explain in the driver section) access to the database connection. All this explain in the [driver section](/driver/). However, 

### Approaches

Mongock provides two ways to setup the runner:
- **Builder approach** which requires the user to set it up manually with a builder. While, at first this approach looks less convenient, provides a bit more control. For each runner type(standalone, spring, micronaut, etc.) Mongocks provides a specific class with a static method `builder()`. We get into more detail in each runner section.

- **Properties approach:** This depends on the specific runner and the underlying framework, but basically means that with a few entries in the properties file and using the mechanisms provided by the framework, we have Mongock running smoothly. To ilustrate it, for example for Springboot, the developer only needs to add the Mongock configuration in the Springboot properties file and annotate the Springboot application class(or any configuration class) with `@EnableMongock`.

<p class="tipAlt">Note that, regardless of the approach, <b>the runner is always built with a builder</b>. Sometimes manually by the user and sometimes, hidden by Mongock.</p>

------------------------------------------------

## How it's executed
Once we have our runner properly configured, we need to build and execute it. 

Although each builder can provide more ways to build the runner, all of them provide the basic method `buildRunner()`, which returns a `MongockRunner` instance. This interface provides multiple methods, but the most important and the one relevant in this section is the method `execute()`.

The use can always run it manually, by executing the method`execute()`, but Mongock tries to take advantage of the underalying framework to make it as smoothly as possible , so normally, using the mechanism provided by the framework,  you just need to expose the runner bean and Mongock takes care of running it. 
 
In some cases, like when using the  **properties approach**, you don't even need to expose the bean, just providing the properties and telling the framework(via annotation or whatever mechanism the framework provides) that you are using Mongock, is enough :wink:

------------------------------------------------

## Runner options

All the runners(and their builders) are just an extension of a common parent. For example, the Mongock standalone and the Sprinboot builder, share most of the configuration and execution, but each of them provides specific mechanisms to take advantage of the underlying framework.

Mongock currently provides a couple of runners, the idea is to cover, at least, the most relevant frameworks in the market.

Currently we have:
- **Mongock standalone:** The vanila version of the runners. It's mainly used when no framework is setup. It's provides mostly all the features the others do, but it obviously requires more involvement from the user to specify how to do it. For example, while most of frameworks provides an event mechanism out of the box, in this case the user needs to provide the listener manually, as well as inject the dependencies, as no application context is setup. As the reader can guess, this runner only allows the traditional approach.
For more information, visit the [standalone runner section](/runner/standalone/)

- **Springboot:** This is the specialization for Springboot framework. It takes advantage of all the Springboot features, such as profiles, events, environment, dependency injections, ApplicationRunner, InitializingBean, etc. This runner provides both approaches(traditional and properties) and you can learn more about it by visiting the [springboot runner section](/runner/springboot/)


- **Micronaut:** This is the specialization for Micronaut framework. As the spring version, it takes advantage of all the framework's features as well as it provides both approaches. **This is runner is under development and will be available in coming releases**
 Visit the [Micronaut runner section](/runner/micronaut/) for more information.

------------------------------------------------

## Examples

### Example with properties
```yaml
mongock:
  change-unit-scan-package:
    - io.mongock...migrtion.client.initializer
    - io.mongock...migration.client.updater
  metadata:
    change-motivation: Missing field in collection
    decided-by: Tom Waugh
  start-system-version: 1.3
  end-system-version: 6.4
  throw-exception-if-cannot-obtain-lock: true
  legacy-migration:
    origin: mongobeeChangeLogCollection
    mapping-fields:
      change-id: legacyChangeIdField
      author: legacyAuthorField
      timestamp: legacyTimestampField
      change-log-class: legacyMigrationClassField
      change-set-method: legacyChangeSetMethodField
  track-ignored: true
  enabled: true
```

### Example with builder
```java 

builder
    .setDriver(driver)
    .addMigrationScanPackage("com.your.migration.package")
    .adMigrationScanPackage("com.your.migration.package")
    .withMetadata(
        new HashMap(){{
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      }})
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
    .setTrackIgnored(true)
    .setTransactionEnabled(true)
    .setEnabled(true)

```



