---
title: Advanced Configuration
date: 2014-04-18 11:30:00 
permalink: /v4/further-configuration/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 10
---
# Advanced configuration

## metadata

Sometimes there is the need of adding some extra information to the mongock ChangeLog documents at execution time. This is addressed by Mongock allowing you to set a Map object to the properties or builder with the metadata, which will be added later to each mongockChangeLog document involved in the migration

You can specify your metadata like:

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  change-logs-scan-package:
    - com.github.cloudyrock.mongock.client.initializer
  metadata:
    change-motivation: Missing field in collection
    decided-by: Tom Waugh
    
```
{% endtab %}

{% tab title="mongock-spring-v5" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setSpringContext(springContext)
    .withMetadata(
        new HashMap(){{
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      }})
```
{% endtab %}

{% tab title="standalone" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .withMetadata(
        new HashMap(){{
          put("change-motivation", "Missing field in collection");
          put("decided-by", "Tom Waugh");
      }})
```
{% endtab %}
{% endtabs %}

#### And you can expect some result such as...

```yaml
{
    "executionId": "2020-07-16T19:10:29.451797-363",
    "changeId": "test1",
    "author": "testuser",
    "timestamp": {
        "$date": "2020-07-16T18:10:29.465Z"
    },
    "state": "EXECUTED",
    "changeLogClass": "com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.general.MongockTestResource",
    "changeSetMethod": "testChangeSet",
    "metadata": {
        "change-motivation": "Missing field in collection",
        "decided-by": "Tom Waugh"
    },
    "executionMillis": {
        "$numberLong": "1"
    },
    "_class": "io.changock.driver.api.entry.ChangeEntry$1"
}
```

## fail-fast 

When this property is set to `false` in your changeSet annotation,  Mongock won't abort the migration in case of any exception during the method's execution.   
However, please note that the changeLog entry will be marked as **FAILED** in the changeLogCollection, so next Mongock executions will try to process it again**.**

```java
@ChangeLog(order = "1")
public class ClientInitializerChangeLog {

    @ChangeSet(id = "data-initializer", author = "mongock", failFast = false)
    public void ClientInitializer(ClientRepository clientRepository) {
        //...
    }
}
```

#### The resulting changeLog entry :

```yaml
{
    "state": "FAILED",
    "executionId": "2020-07-16T19:45:03.894424-896",
    "changeId": "test1",
    "author": "testuser",
    "timestamp": {
        "$date": "2020-07-16T18:45:03.905Z"
    },

    "changeLogClass": "com.github.cloudyrock.mongock.integrationtests.spring5.springdata3.changelogs.general.MongockTestResource",
    "changeSetMethod": "testChangeSet",
    "metadata": {
        "change-motivation": "Missing field in collection",
        "decided-by": "Tom Waugh"
    },
    "executionMillis": {
        "$numberLong": "-1"
    },
    "_class": "io.changock.driver.api.entry.ChangeEntry$1"
}
```

## systemVersion

Methods annotated by `@ChangeSet` have also the possibility to contain systemVersion. This is a useful feature from a consultancy point of view. The more descriptive scenario is when a software provider has several customers who he provides his software to. The clients may be using different versions of the software at the same time. So when the provider installs the product for a customer, the changeSets need to be applied depending on the product version.   
  
Then in the properties file\(or builder\) the systemVersion for the migration will be specified.

With this solution, he can tag every changeSet with his product version and will tell mongock which version range to apply.

By specifying versions you are able to upgrade to specific versions:

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  change-logs-scan-package:
    - com.github.cloudyrock.mongock.client.initializer
  start-system-version: 1
  end-system-version: 2.5.5
    
```
{% endtab %}

{% tab title="mongock-spring-v5" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setSpringContext(springContext)
    .setStartSystemVersion("1")
    .setEndSystemVersion("2.5.5")
```
{% endtab %}

{% tab title="standalone" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setStartSystemVersion("1")
    .setEndSystemVersion("2.5.5")
```
{% endtab %}
{% endtabs %}

ChangeSets with systemVersion

```java
@ChangeSet(order = "001", id = "someChangeToVersionOne", author = "testAuthor", version = "1")
public void someChange1(MongoDatabase db) {
}

@ChangeSet(order = "002", id = "someChangeToVersionOneDotOne", author = "testAuthor", version = "1.1")
public void someChange2(MongoDatabase db) {
}

@ChangeSet(order = "003", id = "someChangeToVersionTwoDotFiveDotOne", author = "testAuthor", systemVersion = "2.5.1")
public void someChange3(MongoDatabase db) {
}

@ChangeSet(order = "004", id = "someChangeToVersionTwoDotFiveDotFive", author = "testAuthor", systemVersion = "2.5.5")
public void someChange5(MongoDatabase db) {
}

@ChangeSet(order = "005", id = "someChangeToVersionTwoDotSix", author = "testAuthor", systemVersion = "2.6")
public void someChange6(MongoDatabase db) {
}
```

This example will execute `ChangeSet` 1, 2 and 3, because the specified systemVersion in the changeset should be greater equals the `startSystemVersion` and lower than `endSystemVersion`.

## track-ignored

Mongock will check all your changeSets in your changeLog packages and will run all of them that hasn't been run yet or they were run already but failed or are marked`runAlways` in the annotations. The rest will be ignored. By default the won't be tracked in the changeLogCollection again, as they were already when were successfully executed, however, if for any reasons you wanted to track them in every Mongock's execution, you need to set track-ignored to `true`.

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  #...
  track-ignored: true
    
```
{% endtab %}

{% tab title="mongock-spring-v5" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setSpringContext(springContext)
    .setTrackIgnored(true)
```
{% endtab %}

{% tab title="standalone" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setTrackIgnored(true)
```
{% endtab %}
{% endtabs %}

## enabled

If for any reason you wanted to give Mongock a rest and disabled it, you can set enable to false and mongock won't process your changeLogs. It's enabled b default.

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  #...
  enabled: false
    
```
{% endtab %}

{% tab title="mongock-spring-v5" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setSpringContext(springContext)
    .setEnabled(true)
```
{% endtab %}

{% tab title="standalone" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setEnabled(true)
```
{% endtab %}
{% endtabs %}

## index-creation

Sometimes, for some reasons, you don't want Mongock to perform administration tasks such as index creations. However they are mandatory and must be created. In this scenarios Mongock allows you to create  the indexes yourself manually by setting `index-creation` to false.   


Please take into account that in this case, although Mongock won't create the indexes, will still check they are correctly created, so the indexes must be created prior to Mongock initialisation. Otherwise will throw an exception.

As said, to achieve this you need two things. First telling Mongock to not create the indexes by: 

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  #...
  index-creation: false
    
```
{% endtab %}

{% tab title="mongock-spring-v5" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setSpringContext(springContext)
    .setEnabled(true)
```
{% endtab %}

{% tab title="standalone" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setEnabled(true)
```
{% endtab %}
{% endtabs %}

And creating the indexes manually. The `mongockChangeLog`indexes should look similar to the following

```javascript
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_",
		"ns" : "my-database.mongockChangeLog"
	},
	{
		"v" : 2,
		"unique" : true,
		"key" : {
			"executionId" : 1,
			"author" : 1,
			"changeId" : 1
		},
		"name" : "executionId_1_author_1_changeId_1",
		"ns" : "my-database.mongockChangeLog"
	}
]
```

and the `mongockLock`indexes:

```javascript
[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_",
		"ns" : "my-database.mongockLock"
	},
	{
		"v" : 2,
		"unique" : true,
		"key" : {
			"key" : 1
		},
		"name" : "key_1",
		"ns" : "my-database.mongockLock"
	}
]
```

## service-identifier

Mongock keep track of hostname's executor in the `changeLogCollection`. You can suffix the hostname with `serviceIdentifier` to distinguish multiple instances of your service.

{% tabs %}
{% tab title="properties" %}
```yaml
mongock:
  #...
  service-identifier: "myService"
    
```
{% endtab %}

{% tab title="mongock-spring-v5" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setSpringContext(springContext)
    .setServiceIdentifier("myService")
```
{% endtab %}

{% tab title="standalone" %}
```java
builder
    .addChangeLogsScanPackage("com.github.cloudyrock.mongock.client.initializer")
    .setServiceIdentifier("myService")
```
{% endtab %}
{% endtabs %}
