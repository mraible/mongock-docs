---
title: CLI  
date: 2014-04-18 11:30:00 
permalink: /cli/index.html
eleventyNavigation:
  root: true
  order: 70
---

[[TOC]]

# Introduction

Mongock also offers the possibility to execute migrations and other operations via CLI. 

**Mention the application jar needs to be passed as parameter**

# Requirements
Explain 
- Version 5 
- --appJar

# Steps

## 1. Install CLI 
1. Download the latest version of the **mongock-cli-LATEST_VERSION.zip** from [here](https://repo.maven.apache.org/maven2/io/mongock/mongock-cli/)
2. Unzip it 
3. Open a terminal and locate it inside the unzipped folder


## 2. Prepare your application

### With Springboot
Mention the configuration classes

### With standalone

Explain 
- The interfaces and so on.
- Shaded jar

# Get started

The Mongock CLI follows the next sintax

```bash
$ ./mongock OPERATION [paramters]
```

For more information about what operations Mongock offers and how to execute them, visit the [CLI operations page](/cli/operations)