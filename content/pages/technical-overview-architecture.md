---
title: 'Architecture' 
date: Last Modified
permalink: /technical-overview/architecture/index.html
toc: true
eleventyNavigation:
  order: 20
  parent: technical overview 
  key: architecture
  title: Architecture 
---
#WIP

**Mongock structure**
The next diagram shows how Mongock works with the three main type of objects: ChangeLogs, driver and runner - and how these can be used by injecting different configurations:

//Insert Arch diagram here

# ToDo: Review the below
ChangeLogs
A Mongock executable process a set of changeLogs, which are the classes that will contain the actual migration. A changeLog consists in a bunch of methods called changeSet, which is a single task (set of instructions made on a database). In other words a changeLog is a class annotated with @ChangeLog and containing methods annotated with @ChangeSet.ChangeLogs will be explained further in Creating changeLogs

We recommend to read our best practices for creating and designing changeLogs.


**NEEDS TO BE CHANGED**