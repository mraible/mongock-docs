---
title: Operations  
date: 2014-04-18 11:30:00 
permalink: /v5/cli/operations/index.html
eleventyNavigation:
  version: v5
  order: 1
---

[[TOC]]


# Migrate

Execute all the pending changeUnits, as the standard Mongock migration process.

|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **-aj**  |  String | It's the path to your executable uber JAR. |   YES     |  

```bash
$ ./mongock migrate -aj APP_JAR
```
<!--<p class="text-center">
    <img src="/images/migrate_operation_output.png" alt="Migrate">
</p>-->




<!--UNTIL PROFESSIONAL LIB IS OFFICIAL PUBLISHED-->

<!--# Undo  <span class="professional"><a href="/pro/index.html">PRO</a></span>

Reverts all the changeUnits until the `CHANGE_ID`, included.

This operation uses the methods annotated with `@RollbackExecution` and `@RollbackBeforeExecution` in the changeUnits.  

```bash
$ ./mongock undo CHANGE_ID -aj APP_JAR
```
|   Name    | CLI Parameter |  Type   | Description                                                      | Mandatory |
|-----------|---------------|---------|------------------------------------------------------------------|----------|
| CHANGE_ID |        N/A    |  String | It's the change identifier used in your `@ChangeUnit` annotation |   YES     |
| APP_JAR   |      **-aj**  |  String | It's the path to you executable uber JAR.                        |   YES     |-->

