---
title: Using custom beans in changeSet methods
date: 2014-04-18 11:30:00 
permalink: /v4/injecting-custom-dependencies-to-changesets/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 8
---

# Using custom beans in changeSet methods

Mongock allows you to use  custom beans in your changeSet methods, so you are not restricted to use basic MongoDB(or specific framework) components, like MongoDatabase, MongoCollection or MongoTemplate.(actually you would be using their Mongock decorators, not the direct components)
<br><br>

<div class="success">
<b>Custom beans must be interfaces</b>. The reason behind is explained in the <a href="/v4/lock#how-is-the-lock-ensured-in-every-database-access">lock section</a>.
</div>
<br><br>

```java
@ChangeLog(order = "1")
public class ClientInitializer {

    @ChangeSet(id = "data-initializer-with-repository", order = "001", author = "mongock")
    public void dataInitializer(ClientRepository clientRepository) {
        IntStream.range(0, 10)
                .mapToObj(i -> new Client("name-" + i, "email-" + i, "phone" + i, "country" + i))
                .collect(Collectors.toList())
                .stream()
                .forEach(clientRepository::save);
    }
}
```

# How to use it

## With Spring runner

If you are using Spring Runner, you will be able to access to all of the beans present in the Spring context, just by adding the required bean in your changeSet as parameter.

```java
@ChangeLog(order = "1")
public class ClientInitializerChangeLog {

    @ChangeSet(id = "data-initializer", author = "mongock", order = "001")
    public void ClientInitializer(ClientRepository clientRepository) {
        List<Client> clients = IntStream.range(0, INITIAL_CLIENTS)
                .mapToObj(i -> new Client(i))
                .collect(Collectors.toList());
        clientRepository.saveAll(clients);
    }
}
```

## With Standalone runner

While you will still be using your custom bean by adding the parameter in your changeSet method as parameter, as the previous figure, when using the standalone runner you need to inject your custom bean manually at building time.

You have 4 ways to add your bean(or dependency):

### Just the instance, inferencing the type

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

As explained in [lock section](/v4/lock#how-is-the-lock-ensured-in-every-database-access), custom beans are proxied to ensure  the database is accessed in a  synchronised manner using the lock. 

The Mongock's proxy instrumentation have two main goals:

1. Intercept the actual method you are calling to ensure the lock is acquired.
2. Return a proxied object  to ensure the lock is acquired in subsequent calls
<br><br>
<div class="success">
By default, Mongock won't return a proxied object if one of the following conditions is in place:  The returned object is not an interface or it's a primitive type, String, Class type, wrapper type or any object in a package prefixed by"java.", "com.sun.", "javax.", "jdk.internal." or "sun."
</div>
<br><br>

# Advance configuration: Prevent proxing my beans

Although it is a conservative approach, the default Mongock's proxy behaviour it's the recommended option and most cases will be fine with it. It is a convenient way which provides a good balance between easiness and performance. 

However, sometimes you need a tune this. Luckily in Mongock almost everything is configurable and something as sensitive as a proxy won't be an exception.

You can prevent proxing custom beans by using **@NonLockGuarded** annotation. You can apply it to your bean's type, a specific method or a changeSet parameter. 

## @NonLockGuarded in changeSet parameter

This will tell Mongock you don't want to proxy that bean in that specific changeSet method. 

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

## @NonLockGuarded in custom bean's type

If you annotate your custom bean's type, Mongock won't never proxy any bean of that type. 

It's obviously useful when you know that type won't be accessing to database at all or you don't want to proxy any parameter of that type, for any other reason.

```java
@NonLockGuarded
public class MyCustomBeanImpl implements MyCustomBean {
    //...
}
```

## @NonLockGuarded in custom bean's method

When annotating a method, there are 3 options:

* You don't want to ensure the lock in the method's call but you do want to **return a proxy**
* You want to **ensure the lock in the method's call** but you don't want to return a proxy
* You neither want to ensure the lock in the method's call nor return a proxy

### **Not ensuring the lock in the method's call but returning a proxy**

For this purpose you need to annotate your method providing the value **METHOD**. However, as METHOD is the default value, you don't need to provide any.

```java
public class MyCustomBeanImpl implements MyCustomBean {
    
    @NonLockGuarded
    public MyCustomBean accessToDatabaseAndReturnProxiableObject() {
        //...
        return new MyCustomBeanImpl();
    }
}
```

### Ensuring the lock in the method's call but not returning a proxy

To achieve this you need to annotate your method with **RETURN** value.

```java
public class MyCustomBeanImpl implements MyCustomBean {
    
    @NonLockGuarded(NonLockGuardedType.RETURN)
    public MyCustomBean accessToDatabaseAndReturnProxiableObject() {
        //...
        return new MyCustomBeanImpl();
    }
```

### Neither ensuring the lock in the method's call nor returning a proxy

For this purpose you need to annotate your method providing the value **NONE**

```java
public class MyCustomBeanImpl implements MyCustomBean {
    
    @NonLockGuarded(NonLockGuardedType.NONE)
    public MyCustomBean accessToDatabaseAndReturnProxiableObject() {
        //...
        return new MyCustomBeanImpl();
    }
}
```

