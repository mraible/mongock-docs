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
  <li>list options with link to page: standalone and springboot</li>
  <li>Properties table(missing driver)</li>
</ul>
</div>

 

## How it works

To work with a runner you need to
- Use the builder to configure the runner
- Builder the runner
- Execute the runner


## Builder

Mongock offers two approaches to build the runner:
- **Builder approach:** The user manually configures and executes the runner by using the runner builder
- **Automatic approach:** Mongock automatically configures and executes the runner by taking the configuration from properties file and taking advantage of the underlying framework. However, It still uses the builder behind the scenes, but it's transparent to the user.

## Execution 
Once the runner is built, you can run the 

## Configuration

<p class="tipAlt">Note when using properties file, you need to add the prefix <b>`mongock.`</b></p>
<p class="success">Note that each specific runner may add their own properties.</p>

| Property                    | type | Description                                                                                  | Type                | Default value |
| ------------------------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------:|
| **driver**                | component | The Mongock driver. This parameter can only be passed programatically. When opting for the `automatic approach`, Mongock builds the driver and injects it to the runner | ConnectionDriver | Mandatory |  
| **migrationScanPackage**  | property | The list of migration(changeUnits and changeLogs) classes and/or packages where they are stored | List< String >      |Mandatory |  
| **metadata**              | property | Custom data attached to the migration. It will be added to change entry in the mongock table/collection  | Map<String, Object> | null |  
| **startSystemVersion**    | property | System version to start with                                                                 | String              | `0` |  
| **endSystemVersions**     | property | System version to end with                                                                   | String              | MAX_VALUE |  
| **trackIgnored**          | property | Specifies if an ignored changeUnit(already executed for example) should be track in the Mongock table/collection with status IGNORED | boolean | `false` |  
| **enabled**               | property | If false, will disable Mongock execution| boolean |NO          | `true` |  
| **serviceIdentifier**     | property | Application/service instance's indentifier | String | null|
| **defaultMigrationAuthor**| property | Author field is not mandatory in ChangeUnit. The field `author` in this annoation is optional. However for backward compatibility it's still required. If it's provided in the ChangeUnit annotation, this value is taken. If not, Mongock will look at this property. If not provided, the default value is provided| String | `default_author` |
| **throwExceptionIfCannotObtainLock**| property | ngock will throw MongockException if lock can not be obtained. Builder method setLockConfig| boolean | long | `true` |  
| **transactionEnabled**              | property | Indicates the whether transaction is enabled. For backward compatibility, this property is not mandatory but it will in coming versions. It works together with the driver under the following agreement: Transactions are enabled only if the driver is transactionable and this field is `true` or not provided. If it's `false`, transactions are disabled and will throw an exception if this field is `true` and the driver is not transactionable. To understand what _transactionable_ means in the context of the driver and how to make a driver transactionable, visit the section [driver](/driver/)      | boolean | null |  
| **transactionStrategy**   | property | Dictates the transaction strategy. `CHANGE_UNIT` means each changeUnit(applied to deprecated changeLog as well) is wrapped in an independent transaction.`EXECUTION` strategy means that Mongock will wrap all the changeUnits in a single transaction. Note that Mongock higly recomend the default value, `CHANGE_UNIT`, as the `EXECUTION` strategy is unnatural and, unless it's really designed for it, it can cause some troubles along the way | String | `CHANGE_UNIT` |  

------------------------------------------------

## How it's executed
Once we have our runner properly configured, we need to build and execute it. 

Although each builder can provide more ways to build the runner, all of them provide the basic method `buildRunner()`, which returns a `MongockRunner` instance. This interface provides multiple methods, but the most important and the one relevant in this section is the method `execute()`.

The use can always run it manually, by executing the method`execute()`, but Mongock tries to take advantage of the underalying framework to make it as smoothly as possible , so normally, using the mechanism provided by the framework,  you just need to expose the runner bean and Mongock takes care of running it. 
 
In some cases, like when using the  **automatic approach**, you don't even need to expose the bean, just providing the properties and telling the framework(via annotation or whatever mechanism the framework provides) that you are using Mongock, is enough :wink:

------------------------------------------------

## Runner options
There are specific runners for certain environments, like frameworks, etc.

Currently you can use the following runners: 
- [Mongock standalone runner](/runner/standalone/) 
- [Mongock springboot runner](/runner/springboot/) 
<!--- [Mongock micronaut runner](/runner/micronaut/) -->

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



