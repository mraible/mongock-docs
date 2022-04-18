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
This sections explains and goes through all the steps to get up and running the Mongock professional.


# Steps

### 1. Request a license key

You can request a License key from the following [link](https://mongock.io/professional/). The website will display a form which will send a license key to the desired email address.

### 2. Chage the groupId in you pom

If you are using Mongock Community edition with Maven, your POM file should have a runner dependency(in this example spring boot, but could be any other, like standalone) with the following groupId:

```xml
        <dependency>
            <groupId>io.mongock</groupId>
            <artifactId>mongock-springboot</artifactId>
        </dependency>
```
For using the Professional version, the change required is to reference to the professional groupId. This will not affect your implementing classes already referenced:

```xml
        <dependency>
            <groupId>io.mongock.professional</groupId>
            <artifactId>mongock-springboot</artifactId>
        </dependency>
```

### 3. Provide the license key to Mongock

There are two ways of providing the license key:

#### Builder
If you are using the Mongock builder, you can use the builer method `setLicenseKey` and pass the license key generated. Although the following image shows the license key literal in the code, we suggest to load it from properties or the environment, which is always a more secure way to do it.
<p class="text-center">
    <img width="50%" src="/images/license-key-builder.jpeg" alt="license-builder">
</p>

#### Properties
If you are using Spring boot, there is a config property available called `licenseKey`. As mentioned in the previous point, we suggest to use a more secure approach of providing the license key, such as loading the license key value from environment variables. 
<p class="text-center">
    <img width="50%" src="/images/license-key-properties.jpeg" alt="license-properties">
</p>