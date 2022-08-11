---
title: Multitenant 
date: 2014-04-18 11:30:00 
permalink: /v5/features/multitenant/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 15
  parent: features
  key: features multitenant 
  title: Multitenant
---
<h1 class="title">Multitenant <span class="professional"><a href="/pro/index.html">PRO</a></span></h1>



[[TOC]]
## Introduction 
This is a professional feature that helps in situations where there are situations when you need to setup multiple tenants in a single project. A common scenario is when a consultancy provies a SaaS product in which, instead of having a shared database for all the clients, they have their own and independent database(in the same or different server), but sharing the same source code and deployment. In this case, you want apply the same Mongock migration to each database 
<p class="text-center">
    <img src="/images/multitenant-overview.png" alt="multitenant overview" width="75%">
</p> 

## How it works
The basic idea is pretty simple. The application is configured to work with N datasources and Mongock runs the migration for all of them(sequentially). To achieve this, the user has to configure a Mongock driver per datasource, pass them to the Mongock builder and execute the Mongock runner which will apply the migration for all the tenants.


## With Mongock Standalone
This is the easiest scenario as there is no ORM framework to deal with. It just requires passing the different drivers to the Mongock builder.
```java
  MongockStandalone.builder()
    .setDriverMultiTenant(
      MongoSync4Driver.withDefaultLock(mongoClientTenant1, "db-tenant-1"),
      MongoSync4Driver.withDefaultLock(mongoClientTenant2, "db-tenant-2")
    )
  //...
```

## With Springdata
This scenario is trickier. The problem is not directly related to Springboot, as we could setup multiple drivers and Mongock would do the magic. 


The problem comes when using Springdata repositories. Springdata hides all the complexity of managing the datasource, the user only needs to create a Repository, which in most of the case is a simple interface that extends any of the provided Springdata interfaces(CrudRepository, etc.) and it just works. 

<br />
However, in a multitenant environment, when the Springdata repository is injected into a changeUnit, it doesn't know which datasource it should point to. 

### The problem
Lets imagine this scneario...
<br />

We have 3 tenants and one database per each. This means we have setup a Mongock driver for each database and pass it to Mongock. We also have a changeUnit(lets call it `ChangeUnit-1`) that uses the `ProductRepository`(Springdata repository), for example to initialize the table/collection with some products. Mongock(who is already aware about these three tenants) runs the migration(in this case just `ChangeUnit-1`) 3 times, one per tenant, pointing to the right darabase.

<br />

Everything looks fine so far, but there is an small issue. The `ProductRepository`, which is taken from the Springboot context, is injected to the `ChangeUnit-1`, but it's not managed by Mongock, so how does `ProductRepository` which database to point to? The answer is easy: It doesn't. But this is not a specific Mongock issue, it's a SpringData one. Regardless of using Mongock, in a multitenant environment, you need a mechanism to select a tenant when using the `ProductRepository` 

### The solution
But no worries, we have a solution 😉

It's actually split in two. A generic solution for Springboot/Springdata, regardless of Mongock and the part that involves Mongock.
