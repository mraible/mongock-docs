---
title: Runner
date: Last Modified 
permalink: /runner/index.html
eleventyNavigation:
  key: runner 
  title: Runner
  order: 45
---

We have already explained briefly the role of the **Mongock runner** in the section [how ti works](/how-it-works/). Essentially the Mongock runner is the orchestartor dealing with the process logic, configuration, dependencies, framework and any environmental aspect. It's the glue that puts together all the components as well as the decision maker.


## Building the Runner
In order to use the Mongock runner, we need to set it up by passing the configuration(changelogs package, etc.), any required component, like the driver, and any framework dependency such as the ApplicationContext, etc.

Mongock provides two ways to setup the runner:
- **Traditional approach** which requires the user to set it up manually with a builder. While, at first this approach looks less convenient, provides a bit more control.
- **Properties approach:** This depends on the specific runner we are using and the underlying framework, but basically means that with a few entries in the properties file and using the mechanism provided by the framework, you have Mongock running smoothly. To ilustrate it, for example for Springboot, we use the annotation approach, so basically with the Springboot properties file and annotating the Springboot application class(or any configuration class), we have Mongock running.

<p class="tipAlt">Note that, regardless of the approach, <b>the runner is always built with a builder</b>. Sometimes manually by the user and sometimes, hidden by Mongock.</p>



## Executing the Runner
Once we have our runner properly configured and ready to go, we just need to execute it.
 
Although you can always run it manually, by executing the method `execute`, Mongock tries to take advantage of the framework, so normally you just need to expose the runner bean and Mongock, with the help of the underlying framework, takes care of running it. 
 
In some cases, like when using the  **properties approach**, you don't even need to expose the bean, just providing the properties and telling the framework(via annotation or whatever mechanism the framework provides) that you are using Mongock, is enough :wink:

## Runners available
All the runners(and their builders) are just an extension of a common parent. For example, the Mongock standalone and the Sprinboot builder, share most of the configuration and execution, but each of them provides specific mechanisms to take advantage of the underlying framework.

Mongock currently provides a couple of runners, the idea is to cover, at least, the most relevant frameworks in the market.

Currently we have:
- **Mongock standalone:** The vanila version of the runners. It's mainly used when no framework is setup. It's provides mostly all the features the others do, but it obviously requires more involvement from the user to specify how to do it. For example, while most of frameworks provides an event mechanism out of the box, in this case the user needs to provide the listener manually, as well as inject the dependencies, as no application context is setup. As the reader can guess, this runner only allows the traditional approach.
For more information, visit the [standalone runner section](/runner/standalone/)

- **Springboot:** This is the specialization for Springboot framework. It takes advantage of all the Springboot features, such as profiles, events, environment, dependency injections, ApplicationRunner, InitializingBean, etc. This runner provides both approaches(traditional and properties) and you can learn more about it by visiting the [springboot runner section](/runner/springboot/)


- **Micronaut:** This is the specialization for Micronaut framework. As the spring version, it takes advantage of all the framework's features as well as it provides both approaches. **This is runner is under development and will be available in coming releases**
 Visit the [Micronaut runner section](/runner/micronaut/) for more information.


## Building time! :smile:

When comes to build the runner, we can separate the setup in two areas: configuration, which means providing plain configuration properties, and components injection, which are some required or optional components that the runner will use.

### Building time: configuration

> Note when using properties faile, you need to add the prefix **mongock**

| Property                            | Description                                                                                  | Type                | Default value |
| ------------------------------------|:---------------------------------------------------------------------------------------------|---------------------|:-----------:|:-------------:|
| **changeLogScanPackage**            | The list of changelog and changeUnit classes and/or packages where the changelogs are stored                | List< String >      |Mandatory |  
| **metadata**                        | Custom data attached to the migration. It will added to all changes in changeLog collection  | Map<String, Object> | null |  
| **startSystemVersion**              | System version to start with                                                                 | String              | `0` |  
| **endSystemVersions**               | System version to end with                                                                   | String              | MAX_VALUE |  
| **trackIgnored**                    | Specifies if ignored changeSets(already executed, etc.) should be track in the changeLog collection with IGNORED status| boolean | `false` |  
| **enabled**                         | If false, will disable Mongock execution| boolean |NO          | `true` |  
| **changeLogRepositoryName**         | Repository name where the change entries are persisted in database | String | `mongockChangeLog`|
| **lockRepositoryName**              | Repository name where the lock is persisted in database | String | `mongockLock`| 
| **indexCreation**                   | If false, Mongock won't create the necessary index. However it will check that they are already created, failing otherwise. Default true | String |`true`|
| **serviceIdentifier**               | Application/service instance's indentifier | String | null|
| **defaultChangeLogAuthor**          | From version 5, the author is not a mandatory field, however for backward compatibility is still required. If the changeLog implements the method `getAuthor`, this value is taken. If not, Mongock will look at this property. If not provided, the default value is provided| String | `default_author` |
| **lockAcquiredForMillis**           | The period the lock will be reserved once acquired. If the migration finishes before, the lock will be released. If the process takes longer thant this period, it will automatically extended. Minimum value is 3 seconds| long | 1 minute|
| **lockQuitTryingAfterMillis**       | The time after what Mongock will quit trying to acquire the lock, in case it's acquired by another process. Minimum value is 0, which means won't wait whatsoever | long |  3 minutes|
| **lockTryFrequencyMillis**          | In case the lock is held by another process, it indicates the frequency trying to acquire it. Regardless of this value, the longest Mongock will wait is until the current lock's expiration. Minimum 500 milliseconds| long | 1 second|
| **throwExceptionIfCannotObtainLock**| ngock will throw MongockException if lock can not be obtained. Builder method setLockConfig| boolean | long | `true` |  
| **transactionEnabled**              | Indicates the whether transaction is enabled. For backward compatibility, this property is not mandatory but it will in coming versions. It works together with the driver under the following agreement: Transactions are enabled only if the driver is transactionable and this field is `true` or not provided. If it's `false`, transactions are disabled and will throw an exception if this field is `true` and the driver is not transactionable. To understand what _transactionable_ means in the context of the driver and how to make a driver transactionable, visit the section [driver](/driver/)      | boolean | null |  
| **transactionStrategy**             | Dictates the strategy to execute the transaction(automatic or manual). `CHANGE_UNIT` means each changelog is an independent transaction. Migration means that Mongock will wrap all the changelogs in a single transaction. Note that Mongock higly recomend the default value, `CHANGE_UNIT`, as the `MIGRATION` strategy is unnatural and, unless it's really designed for it, it can cause some troubles along the way | String | `CHANGELOG` |  


```yaml
mongock:
  change-logs-scan-package:
    - io.mongock...changelogs.client.initializer
    - io.mongock...changelogs.client.updater
  metadata:
    change-motivation: Missing field in collection
    decided-by: Tom Waugh
  start-system-version: 1.3
  end-system-version: 6.4
  lock-acquired-for-minutes: 10
  max-waiting-for-lock-minutes: 4
  max-tries: 5
  throw-exception-if-cannot-obtain-lock: true
  legacy-migration:
    origin: mongobeeChangeLogCollection
    mapping-fields:
      change-id: legacyChangeIdField
      author: legacyAuthorField
      timestamp: legacyTimestampField
      change-log-class: legacyChangeLogClassField
      change-set-method: legacyChangeSetMethodField
  track-ignored: true
  enabled: true
```

 

 <p class="tipAlt">Note that each specific runner may add their own properties.</p>



### Building time: component injection
**Explain that each runner has their own components, like ApplicatioContext, EventListener, etc.**

**Explain the driver injection**

**code example**

<p class="tipAlt">Note that each specific runner may add their own component injections.</p>