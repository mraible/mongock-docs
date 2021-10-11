---
title: 'Events' 
date: 2014-04-18 11:30:00 
permalink: /features/events/index.html
toc: true
eleventyNavigation:
  order: 1120 
  parent: features
  key: features events
  title: 'Events'
---


<!--1. [Introduction](#introduction)
2. [Type of events](#type-of-events)
2. [Get started](#get-started)-->

[[TOC]]
## Introduction
Mongock uses events as a way to notify the main application in which state is the Mongock process and eventually the result of the execution.
There is a big different in the approach, depending on which type of runner is used. For spring applications, Mongock takes advantage of the ApplicationEventPublisher, which is provided to Mongock at building time. On the other hand, for standalone applications, Mongock requires a an explicit handler at building time.


## Type of events
Mongock provides three types of events:
- **Start event:** This event takes place just before starting the migration, after the validation.
- **Success event:** Is raised after the migration runs, if successful. This means, that no exception occurred, they were handled or the failed changeLogs were marked with failFast to false.
- **Failure event:** In contrast, if any of the changeLogs fails and it's not handled, as explained in the previous point, this event will be raised.

Please notice that there is no scenario in which both events, success and failure, are raised together.

## Get started

Each runner's page provides you the information you need to use the events accordinly to runner's approach.
