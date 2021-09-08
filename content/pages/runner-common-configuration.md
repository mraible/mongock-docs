---
title: 'Runner: Common configuration' 
date: Last Modified 
permalink: /runner/common-configuration/index.html
toc: true
eleventyNavigation:
  order: 50 
  parent: runner
  key: runner common configuration 
  title: 'Common configuration'
---

This page explains all the essential concepts you will need to know to understand what Mongock is and how it works. 
Mongock structure
Mongock consists in 3 main type of objects: ChangeLogs, driver and runner. Builders are simply used to configure and build these 3 components.
ChangeLogs
A Mongock executable process a set of changeLogs, which are the classes that will contain the actual migration. A changeLog consists in a bunch of methods called changeSet, which is a single task (set of instructions made on a database). In other words a changeLog is a class annotated with @ChangeLog and containing methods annotated with @ChangeSet.ChangeLogs will be explained further in Creating changeLogs
We recommend to read our best practices for creating and designing changeLogs.


**NEEDS TO BE CHANGED**