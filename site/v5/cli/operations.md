---
title: Operations  
date: 2014-04-18 11:30:00 
permalink: /v5/cli/operations/index.html
eleventyNavigation:
  version: v5
  order: 1
---

[[TOC]]


# migrate all

Execute all the pending changeUnits, as the standard Mongock migration process.

```bash
$ ./mongock migrate all -aj <APP_JAR>
```

|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **-aj**  |  String | It's the path to your executable uber JAR. |   YES     |  


<p class="text-center">
    <img src="/images/cli-migrate-all.png" alt="migrate all output" style="max-width: 1280px">
</p>

<!--# migrate up-to-change

Execute the pending changeUnits until the specified `CHANGE_UNIT_ID` (included), as the standard Mongock migration process.

```bash
$ ./mongock migrate up-to-change <CHANGE_UNIT_ID> -aj <APP_JAR>
```

|   Name    | CLI Parameter |  Type   | Description                                                      | Mandatory |
|-----------|---------------|---------|------------------------------------------------------------------|----------|
| CHANGE_UNIT_ID |        N/A    |  String | It's the change identifier used in your `@ChangeUnit` annotation |   YES     |
| APP_JAR   |      **-aj**  |  String | It's the path to you executable uber JAR.                        |   YES     |
-->

<!--UNTIL PROFESSIONAL LIB IS OFFICIAL PUBLISHED-->

<!--# undo all  <span class="professional"><a href="/pro/index.html">PRO</a></span>

Reverts all the changeUnits.

This operation uses the methods annotated with `@RollbackExecution` and `@RollbackBeforeExecution` in the changeUnits.  

```bash
$ ./mongock undo all -aj <APP_JAR>
```

|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **-aj**  |  String | It's the path to your executable uber JAR. |   YES     |  
-->
# undo up-to-change  <span class="professional"><a href="/pro/index.html">PRO</a></span>

Reverts all the changeUnits until the specified `CHANGE_UNIT_ID` (included).

This operation uses the methods annotated with `@RollbackExecution` and `@RollbackBeforeExecution` in the changeUnits.  

```bash
$ ./mongock undo up-to-change <CHANGE_UNIT_ID> -aj <APP_JAR>
```
|   Name    | CLI Parameter |  Type   | Description                                                      | Mandatory |
|-----------|---------------|---------|------------------------------------------------------------------|----------|
| CHANGE_UNIT_ID |        N/A    |  String | It's the change identifier used in your `@ChangeUnit` annotation |   YES     |
| APP_JAR   |      **-aj**  |  String | It's the path to you executable uber JAR.                        |   YES     |

<p class="text-center">
    <img src="/images/cli-undo-up-to-change.png" alt="migrate all output" style="max-width: 1280px">
</p>

# state db  <span class="professional"><a href="/pro/index.html">PRO</a></span>

Show the current state of changes.

```bash
$ ./mongock state db -aj <APP_JAR>
```

|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **-aj**  |  String | It's the path to your executable uber JAR. |   YES     |  

<p class="text-center">
    <img src="/images/cli-state-db.png" alt="migrate all output" style="max-width: 1280px">
</p>

# state code-base  <span class="professional"><a href="/pro/index.html">PRO</a></span>

List the existing code changeUnits and their current state.

```bash
$ ./mongock state code-base -aj <APP_JAR>
```

|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **-aj**  |  String | It's the path to your executable uber JAR. |   YES     |  

<p class="text-center">
    <img src="/images/cli-state-code-base.png" alt="migrate all output" style="max-width: 1280px">
</p>

# state compare  <span class="professional"><a href="/pro/index.html">PRO</a></span>

Compare the existing code changeUnits with the current state of changes.

```bash
$ ./mongock state compare -aj <APP_JAR>
```

|   Name   | CLI Parameter |  Type   | Description                               | Mandatory |
| ---------|-------------|---------|-------------------------------------------|-----------|
| APP_JAR  | **-aj**  |  String | It's the path to your executable uber JAR. |   YES     |  

<p class="text-center">
    <img src="/images/cli-state-compare.png" alt="migrate all output" style="max-width: 1280px">
</p>