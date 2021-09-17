---
title: Technical overview
date: Last Modified 
permalink: /technical-overview/index.html
eleventyNavigation:
  key: technical overview 
  title: Technical overview
  order: 10
---

In this section we'll explains all the essential concepts you will need to know to understand what Mongock is and how it works. 

## Mongock structure 
Although Mongock requieres 3 components to work: ChangeLogs, driver and runner. We'll speak about some other components and concepts
that key to understand how Mongock works.

### Changelog
In simple words changelogs are your migration classes, where you implement your database changes. They represent a unit of a migration execution.

### Migration
Migration is not really a component itself. It's the operation of taking the user's changeLogs and apply them safely in order to perform the desired changes in the target system, normally a database. As we'll see in coming sections, there are other operations, but the migration is the main one. The other operations are just complementary to a migration, such as **undo** or **list**.

### Change entry
Mongock tracks the executed changes(in changeLogs) in the database, so it can deduce which changes are pending to be applied and execute them. A change entry is the representation of a change in the database.

### Driver
This is the component that represents the persistence layer, the database. Everything that needs to be persisted(distributed lock, change entries, etc.) passed by the driver.
Although Mongock was initially conceived only for MongoDB, it has grown and now provides drivers for other NoSQL as well SQL.  

### Runner
This component is a kind of orchestrator, the glue that put everything together and makes it work. It’s responsible for the environment aspect(framework, etc.), takes the changeLogs and, with the help of the driver and other smaller components, loop and execute them.

### Builder
This component is tightly coupled with the runner and it is used just to build the runner, by applying the relevant configuration and other required components, such as the driver.