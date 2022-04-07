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

Currently you have two ways of providing the license key.

#### Builder
If you are using the Mongock builder, you can use the builer method `setLicenseKey` and pass the license key generated. Although the following image shows the license key literal in the code, we suggest to load it from properties or the environment, which is always a more seure way to do it.
<p class="text-center">
    <img width="50%" src="/images/license-key-builder.jpeg" alt="license-builder">
</p>

#### Properties
If you are using Spring boot, there is a config property available called `licenseKey`. As mentioned in the previous point, we suggest to use a more secure approach of providing the license key, such us loading from the environment. 
<p class="text-center">
    <img width="50%" src="/images/license-key-properties.jpeg" alt="license-properties">
</p>