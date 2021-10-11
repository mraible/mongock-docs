---
title: Operations  
date: 2014-04-18 11:30:00 
permalink: /cli/operations/index.html
eleventyNavigation:
  order: 1
---

[[TOC]]


# Migrate

Execute all the pending changeUnits, as the standard Mongock migration process.

```bash
$ ./mongock migrate --appJar APP_JAR
```
|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **--appJar**  |  String | It's the path to you executable uber JAR. |   YES     |  

# Undo  <span class="professional">PRO</span>

Reverts all the changeUnits until the `CHANGE_ID`, included.

This operation uses the methods annotated with `@RollbackExecution` and `@RollbackBeforeExecution` in the changeUnits.  

```bash
$ ./mongock undo CHANGE_ID --appJar APP_JAR
```
|   Name    | CLI Parameter |  Type   | Description                                                      | Mandatory |
|-----------|----------------|--------|------------------------------------------------------------------|----------|
| CHANGE_ID |      **N/A**  |  String | It's the change identifier used in your `@ChangeUnit` annotation |   YES     |
| APP_JAR   | **--appJar**  |  String | It's the path to you executable uber JAR.                        |   YES     |

