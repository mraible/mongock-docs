---
title: Technical overview
date: Last Modified 
permalink: /technical-overview/index.html
eleventyNavigation:
  key: technical overview 
  title: Technical overview
  order: 15
---

This section explains all the essential concepts required to understand how Mongock works and its usage. 

## Mongock structure 
Mongock requires 3 components to work: ChangeUnits, Driver and Runner:

![Architecture](../content/images/Architecture-User-HLD.jpg)


### ChangeUnit
ChangeUnits are your migration classes. In a nutshell, where you implement your database changes. They represent a unit of a migration execution.
<div class="tipAlt">From version 5, ChangeUnits have replaced ChangeLogs.
<p>Visit <a href="/migration/">changeUnit</a> and <a href="/changelog/">changelog</a> sections for more information</p>
</div>

#### Migration
A Migration is the operation of taking ChangeUnits and applying them safely in order to perform the desired changes in the target system (usually a database). As we'll see in coming sections, there are other operations, but the migration is the main one. The other operations help the management of migrations, such as **undo** or **list**.

#### Change entry
Mongock persists the ChangeUnits in the database. A change entry is the representation of a change in the database. This allows tracking the status of the ChangeUnit executions - identifying which have been executed and which are pending to be applied.  


### Driver
This component represents the persistence layer connection type to the database. Everything that needs to be persisted(distributed lock, change entries, etc.) are passed by the driver. The driver connects to the target Database type.
Although Mongock was initially conceived only for MongoDB, it has grown and now provides drivers for other NoSQL as well SQL.   

### Runner
This component orchestrates the ChangeUnits from the framework executed and injects them to the Runner. It is the glue that puts everything together and makes it work. It’s responsible for the environment aspect(framework, etc.), takes the ChangeUnits and, with the help of the driver and other smaller components, loops and executes all ChangeUnits.

#### Builder
This component is used to build the Runner component by applying the relevant configuration and driver to the runner. It is tightly coupled with the runner.