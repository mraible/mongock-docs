---
title: Undo
date: 2014-04-18 11:30:00 
permalink: /v4/undo/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 13
---

# Undo\(coming soon\)

{% hint style="info" %}
**Coming soon**
{% endhint %}

This feature will allow you to "undo" any changeSet you "regret". Let's say in a previous migration you executed a changeSet that now realises should never be added. In this case is where **UNDO** operations come handy. You tell Mongock to execute that operation to "repair" the actions of the undesired changeSet. You may wonder , why not add a standard changeSet that does the "undo" job. While this would work, it will force Mongock to always run the undesired changeSet. So it could happen that you provide an **UNDO** operation for a changeSet you don't want to be executed, but it will, to then later, "fixed". When providing an **UNDO** operation associated with a changeSet, Mongock will check if the changeSet has been already executed. If that is the case, it will run the **UNDO** operation, otherwise neither the changeSet nor the **UNDO** will be ever executed.

