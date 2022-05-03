---
title: Testing  
date: 2022-05-02 11:30:00 
permalink: /v5/testing/index.html
eleventyNavigation:
  version: v5
  root: true
  order: 80
---
<h1 class="title">Testing</h1>

[[TOC]]

# Introduction
This sections exaplains the different levels of testing(unit and integration tests) that can(and should) be applied to a Mongock migration and the tools Mongock provides for it.

# Unit testing
This is probably the easiest and more basic level of testing, which takes a changeUnit in isolation and ensures it performs the right actions and calls to the dependend components. Although it's far from being enough, as the components are normally injected as mock/stub/spy, it's a good starting point to ensure that the correctness of the changeUnit.

Mongock doesn't provide any speicific tool for this, but we illustrate how to do it  [in our example project](https://github.com/mongock/mongock-examples/tree/master/mongodb/springboot-quickstart)

A unit test for a change unit looks like this:

<p class="text-center">
    <img src="/images/changeUnit-unit-test.png" alt="ChangeUnit unit test">
</p>


# Integration test
At this point, once we are confident our changeUnits do what they should, we probably want to test our migration(set of changeUnits) within the application  context and, given the specific input scenarios, the result in the database is what we expect.

This is a more complex level of testing as it requires to simulate the application context and implies the integration of the different components within the application. But it's probably the most important level of testing to ensure the correctness of the migration.

To see an example, please see [our example project](https://github.com/mongock/mongock-examples/tree/master/mongodb/springboot-quickstart)


## Integration test with Springboot Runner with Junit5
Mongock provides some util classes to make this pretty easy. In summary you need to create your test class extending `MongockSpringbootJUnit5IntegrationTestBase`, which provides the following
- **BeforeEach method(automatically called):** Resets mongock to allow re-utilization(not recommended in production) and build the runner
- **AfterEach method(automatically called):** Cleans both Mongock repositories(lock and migration) 
- **Dependency injections:** It ensures the required dependencies(Mongock builder, connectionDriver, etc.) are injected 
- **executeMongock() method:** To perform the Mongock migration
- **@TestPropertySource(properties = {"mongock.runner-type=NONE"}):** To prevent Mongock from injecting(and automatically execute) the Mongock runner bean. This is important as it won't allow multiple execution otherwise.

Please follow these steps...
### 1. Import the `mongock-springboot-junit5` dependency to your project
Assuming you have imported already `mongock-springboot` to you project, you only need to add
```xml
        <dependency>
            <groupId>io.mongock</groupId>
            <artifactId>mongock-springboot-junit5</artifactId>
            <scope>test</scope>
        </dependency>
```

### 2. Add the additional dependencies to your project
You probably need `Springboot starter test`, `JUnit5`, `Testcontainers`...

### 3. Database initialization. 

Although there is multiple ways of doing this, we present a way we think it provides a good balance easy-flexible
<p class="text-center">
    <img src="/images/integration-test-springboot-junit5-db-initialization.png" alt="ChangeUnit unit test">
</p>

### 4. Create the test class extending the `MongockSpringbootJUnit5IntegrationTestBase`

This class, in addition to extend `MongockSpringbootJUnit5IntegrationTestBase`, it should bring the database initialization and the application environment.
<br /><br />
This is an example.
<p class="text-center">
    <img src="/images/integration-test-springboot-junit5-test-class.png" alt="Integration test with JUnit5">
</p>



## Integration test with Springboot Runner WITHOUT Junit5

In this case Mongock provides pretty much the same than with JUnit5, with the exception of the `before` and `after` methods, which forces you to make the calls explicitly.

Based on the previous scenario, the relevant modifications are
1. Import the dependency `mongock-springboot-test` instead `mongock-springboot-junit5`
1. Extend from `MongockSpringbootIntegrationTestBase` instead `MongockSpringbootJUnit5IntegrationTestBase`
2. Explicitly call the methods `super.mongockBeforeEach()` and `super.mongockAfterEach()`

The test class should look like this
<p class="text-center">
    <img src="/images/integration-test-springboot-test-class.png" alt="Integration test without JUnit5">
</p>


## Integration test with Standalone Runner
In this case it requires much less help to develop integration tests, as the Standalone runner provides more control over the the process.

The only things you need to ensure is that the same Mongock Runner instance is not executed multiple times and the connectionDriver is not reused. The easiest way to achieve this is by re-creating the connectionDriver and re-building(and executing) the Mongock runner again in every test execution. This can be done by injecting the Mongock builder to your test class and override the connection driver.  

