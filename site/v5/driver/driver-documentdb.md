---
title: 'DocumentDB' 
date: 2014-04-18 11:30:00 
permalink: /v5/driver/documentdb/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 95 
  parent: driver
  key: driver documentdb 
  title: 'DocumentDB'
---
[[TOC]]

<p class="success">You can manage your <b>DocumentDB</b> migrations by using the Mongock drivers for MongoDB</p>


## Compatibility

As AWS DocumentDB relies on the MongoDB driver/api, **you can use Mongock to manage your migration in the same way you would do with MongoDB**, using one of the drivers Mongock provides for MongoDB. You can see how to use it in our [MongoDB driver section](/v5/driver/mongodb)
 
 



## Resources

As mentioned, AWS uses the MongoDB driver to operate with the database. However, AWS DocumentDB is mainly intended to be used inside the trusted network, which means that in order to connect from outside of the VPN in which the database resides,some extra work related to security is required. The next resources can be helpful to address some of the common issues.

- [AWS: Connecting Programmatically to Amazon DocumentDB](https://docs.aws.amazon.com/documentdb/latest/developerguide/connect_programmatically.html)
- [Stackoverflow: DocumentDB with Springoot](https://stackoverflow.com/questions/54230901/attaching-aws-documentdb-to-spring-boot-application)
- [Medium.com: Accessing Amazon DocumentDB from dockerized Java with TLS enabled](https://zdenek-papez.medium.com/accessing-amazon-documentdb-from-dockerized-java-with-tls-enabled-b87ab7c3aff5)