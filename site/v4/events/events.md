---
title: Events
date: 2014-04-18 11:30:00 
permalink: /v4/events/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 13
---

# Events

<div class="success">
Feature in beta version and documentation in construction
</div>

#### **Since version 4.2.1.BETA**

The goal of Mongock events is to notify when the migration process has finished successfully or with errors, which would probably means the transaction was interrupted or not even started.  
  
Depending on the type of Mongock runner you are using\(standalone or Spring\) you will configure it differently.

## Type of Events

Regardless the result, Mongock will notify when the process has ended. For this there are two events, one for success and the other for failure.

### DbMigrationSuccessEvent

This events is thrown when the migration has finished successfully.

## How to use it

### With spring runner

With Spring Mongock uses the buildup events framework provides by Spring. So there are two requirements for events to work with Mongock: Provide the Spring ApplicationEventPublisher and register the listener for the events you want to manage.

### With standalone

In this case you don't have a framework around you to provide the events ecosystem, so you need to provide two handles for both events, success and fail migration events...



 

\*\*\*\*

