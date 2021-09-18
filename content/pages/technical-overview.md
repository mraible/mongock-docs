---
title: Technical overview
date: Last Modified 
permalink: /technical-overview/index.html
eleventyNavigation:
  key: technical overview 
  title: Technical overview
  order: 10
---

This section explains all the essential concepts required to understand how Mongock works and its usage. 

## Mongock structure 
Mongock requires 3 components to work: ChangeLogs, Driver and Runner:

### Changelog
Changelogs are your migration classes, where you implement your database changes. They represent a unit of a migration execution.

#### Migration
A Migration is the operation of taking ChangeLogs and applying them safely in order to perform the desired changes in the target system (usually a database). As we'll see in coming sections, there are other operations, but the migration is the main one. The other operations help the management of migrations, such as **undo** or **list**.

#### Change entry
Mongock persists the ChangeLogs in the database. A change entry is the representation of a change in the database. This allows tracking the status of the ChangeLog executions - identifying which have been executed and which are pending to be applied.  


### Driver
This component represents the persistence layer connection type to the database. Everything that needs to be persisted(distributed lock, change entries, etc.) are passed by the driver. In a nutshell, the driver connects to the target Database type.
Although Mongock was initially conceived only for MongoDB, it has grown and now provides drivers for other NoSQL as well SQL.   

### Runner
This component orchestrates the changelogs from the framework executed and injects them to the Runner. It is the glue that put everything together and makes it work. It’s responsible for the environment aspect(framework, etc.), takes the changeLogs and, with the help of the driver and other smaller components, loops and executes all Changelogs.

#### Builder
This component is used to build the Runner component by applying the relevant configuration and driver to the runner. It is tightly coupled with the runner.

## Mongock Architecture
The next diagram shows how Mongock works with the three main type of objects: ChangeLogs, driver and runner - and how these can be used by injecting different configurations in your Java Application:

![Architecture](http://localhost:8080/content/images/Architecture.jpg)

