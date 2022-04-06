---
title: Set up
date: 2014-04-18 11:30:00 
permalink: /v5/professional/setup.html
eleventyNavigation:
  version: v5
  order: 1
---
<h1 class="title">Professional - Set up</h1>

[[TOC]]

# Introduction
This sections explains and goes through all the steps to get up and running the Mongock professional


# Steps

### 1. Request a license key

[This link](https://www.mongock.io/download) will take you to the Mongock website, where you just need to provide some basic information, such as the email, where you will receive the license key

### 2. Chage the groupId in you pom

If you are using Mongock community with maven, your pom should have a dependency similar to this:

```xml
        <dependency>
            <groupId>io.mongock</groupId>
            <artifactId>mongock-springboot</artifactId>
        </dependency>
```

you just need to add `.professional` a the end of the groupId
```xml
        <dependency>
            <groupId>io.mongock.professional</groupId>
            <artifactId>mongock-springboot</artifactId>
        </dependency>
```

### 3. Provide the license key to Mongock