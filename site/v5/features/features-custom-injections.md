---
title: 'Custom injections' 
date: 2014-04-18 11:30:00 
permalink: /v5/features/custom-injections/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 1 
  parent: features
  key: features custom injections
  title: 'Custom injections'
---
<h1 class="title">Custom injections</h1>


[[TOC]]

# Introduction
Mongock primarily uses a code-first approach([here](/v5/faq/index.html#why-does-mongock-use-a-code-first-approach-for-its-change-units%3F) we explain why) 
for its migration and one of the benefits is the ability to inject any bean you want to your migration.

Some scenarios this can be useful:
- When, as part of your migration, you need to retrieve some data from a 3rd party system
- When using Spring data, you want to take advantage of your repositories
- When you want to perform some operation as part of your migration(lets say, send a notification), and you want the transaction to abort if the operation fails
- ...


# How to use a custom bean in changeUnit

There are two ways you can injet your custom injections to a Mongock changeUnit.

## In a constructor
```java

@ChangeUnit(id="client-initializer", order = "1", author = "mongock")
public class ClientInitializerChange {

  private final MongoTemplate mongoTemplate;
  private final ThirPartyService thirdPartyService;

  public ClientInitializerChange(MongoTemplate mongoTemplate, ThirPartyService thirdPartyService) {
    this.mongoTemplate = mongoTemplate;
    this.thirdPartyService = thirdPartyService;
  }

//...Methods @Execution, @RollbackExecution, etc.
}
```

## In the methods
```java

@ChangeUnit(id="client-initializer", order = "1", author = "mongock")
public class ClientInitializerChange {

  @Execution
  public void changeSet(MongoTemplate mongoTemplate, ThirPartyService thirdPartyService) {
    thirdPartyService.getData()
            .stream()
            .forEach(client -> mongoTemplate.save(client, CLIENTS_COLLECTION_NAME));
  }

//...Methods @RollbackExecution, etc.
}
```

# How to define/inject your custom beans
## With Spring runner

If you are using Spring Runner, you will be able to access to all the beans present in the Spring context,
just by adding the required bean in your changeSet as parameter.

## With Standalone runner

While you will still be using your custom bean by adding the parameter in your changeSet method as parameter, 
as the previous figure, when using the standalone runner you need to inject your custom bean manually at building time.

You have 4 ways to add your bean(or dependency):

### Just the instance, inferring the type

Mongock will extract the type from the instance.

```java
MongockStandalone.builder()
        //..        
        .addDependency(youBean)
        .buildRunner()
        .execute()
```

### Specifying the type

The issue with the previous approach is, for example, when your bean implements an interface and you want your bean to be injected when any changeSet specify the interface as a parameter

```java
MongockStandalone.builder()
        //..        
        .addDependency(yourBeanInterface, youBean)
        .buildRunner()
        .execute()
```

### With name

Sometimes, regardless of the type, you want the bean to be injected by a name.

```java
MongockStandalone.builder()
        //..        
        .addDependency("myBean", youBean)
        .buildRunner()
        .execute()
```

### With name and type

And there may be other times when you want everything, be able to reference your bean in your changeSets with a name and by type.

```java
MongockStandalone.builder()
        //..        
        .addDependency("myBean", yourBeanInterface, youBean)
        .buildRunner()
        .execute()
```

# Advanced: Proxy explanation

Mongock, as part of its lock mechanism, uses proxies to synchronize all the operations executed in a changeUnit and ensure they are securely executed. 
This means, by default, all the beans injected in a changeUnit are proxied. 

As part of the Mongock's lock mechanism, by default, all the dependencies injected to a changeUnit are proxied to ensure
the database is accessed in a  synchronised manner.

The Mongock's proxy instrumentation have two main goals:

1. Intercept the actual method you are calling to ensure the lock is acquired.
2. Return a proxied object  to ensure the lock is acquired in subsequent calls
   <br><br>
<div class="tipAlt">
By default, Mongock won't return a proxied object if one of the following conditions is in place:  The returned object is a primitive type, String, Class type, wrapper type or any object in a package prefixed by"java.", "com.sun.", "javax.", "jdk.internal." or "sun."
</div>
<br><br>

## Relaxing the lock: @NonLockGuarded

Although it is a conservative approach, the default Mongock's proxy behaviour it's the recommended option and most cases will be fine with it. 
It is a convenient way which provides a good balance between easiness and performance.

However, sometimes you need a tune this. Luckily in Mongock almost everything is configurable and something as sensitive as a proxy won't be an exception.

You can tell Mongock to relax the application of the lock on a given bean, class or method with the annotation @NonLockGuarded.

There are 3 levels this annotation can be applied
### RETURN 
It means that all the repository's methods are protected by the lock, but the  objects returned(in this case RevampDocument) 
by all its method are clean(no proxies)

```java
@Execution
public void execution(@NonLockGuarded(RETURN) RevampRepository revampRepository) {
  //TODO
}
```
### METHOD
It's the opposite to __RETURN__, Indicates the method's bean shouldn't be lock-guarded, but still should the returned object should be a proxy.
```java
@Execution
public void execution(@NonLockGuarded(METHOD) RevampRepository revampRepository) {
  //TODO
}
```
### NONE
Indicates the method shouldn't be lock-guarded neither the returned object should be decorated for lock guard.
```java
@Execution
public void execution(@NonLockGuarded(NONE) RevampRepository revampRepository) {
  //TODO
}
```


## Where can I apply @NonLockGuarded?
### In a ChangeUnit parameter

This will tell Mongock you don't want to proxy that bean in that specific changeUnit method.

This is useful when, in general you are fine proxing the bean, but there are some exceptions or when you don't want to use the annotation in your type, so you annotate all your custom bean parameters in all your changeSet methods.

```java
@ChangeLog(order = "1")
public class ClientInitializerChangeLog {

    @ChangeSet(id = "data-initializer-with-repository", order = "001", author = "mongock")
    public void dataInitializer(@NonLockGuarded ClientRepository clientRepository) {
        //...
    }
}
```

### In the bean's type

If you annotate your custom bean's type, Mongock won't never proxy any bean of that type.

It's obviously useful when you know that type won't be accessing to database at all or you don't want to proxy any parameter of that type, for any other reason.

```java
@NonLockGuarded
public class MyCustomBeanImpl implements MyCustomBean {
    //...
}
```

### In bean's method


```java
public class MyCustomBeanImpl implements MyCustomBean {
    
    @NonLockGuarded
    public MyCustomBean accessToDatabaseAndReturnProxiableObject() {
        //...
        return new MyCustomBeanImpl();
    }
}
```


