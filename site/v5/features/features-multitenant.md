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
This feature helps in situations when it's required to setup multiple tenants in a single project. A common scenario is a SaaS product in which, instead of having a shared database for all the clients, each has its own and independent database(in the same or different server), but sharing the same source code and deployment. In this case, you would want to apply the same Mongock migration to each client's database. 
<p class="text-center">
    <img src="/images/multitenant-overview.png" alt="multitenant overview" width="75%">
</p> 

## How it works
The application is configured to work with N datasources and Mongock runs the migration for all of them(sequentially). To achieve this, the user has to configure a Mongock driver per datasource, pass them to the Mongock builder and execute the Mongock runner which will apply the migration for all the tenants.


## With Mongock Standalone
This is the simplest scenario as there is no ORM framework to deal with. It just requires passing a driver per tenant to the Mongock builder. This mechanism is standard and doesn't change among the different Mongock drivers/databases
```java
  MongockStandalone.builder()
    .setDriverMultiTenant(
      MongoSync4Driver.withDefaultLock(mongoClientTenant1, "db-tenant-1"),
      MongoSync4Driver.withDefaultLock(mongoClientTenant2, "db-tenant-2")
    )
  //...
```

## With Springdata
While the core idea and how it works still remains, when using Springdata in a multitenant environment(independently of Mongock) it requires some extra work, which it's explained bellow.

### The problem
Springdata hides all the complexity to connect to the database, which helps a lot, but it also means the developer needs to give some flexibility up . In this case, he cannot easily specify which tenant is connecting to. 

Lets imagine the following scneario...
<br />

- We have 3 tenants and one database per each. This means we have setup a Mongock driver for each database. We also have a changeUnit(lets call it `ChangeUnit-1`) that uses the `ProductRepository`(Springdata repository), for example to initialize the table/collection with some products. Mongock(who is already aware of these three tenants) runs the migration(in this case just `ChangeUnit-1`) 3 times, one per tenant, pointing to the right database.
<br />

It seems fine, but there is an small issue. The `ProductRepository`, which is taken from the Springboot context, is injected to the `ChangeUnit-1`, but it's not managed by Mongock, so how does `ProductRepository` know which database to point to? The answer is simple: It doesn't. 

### The solution
Regardless of using Mongock, when interacting with a Springdata repository in a multitenant environment, it's required a mechanism to select the tenant's database you want to point to. 

<br />

This normally gets the shape of a *Tenant manager* , which is used by the internal Springdata classes to select the database is talking to, but also shared with any component that should be able to tell Springdata which tenant it wants to use at any moment.

To visualize this, lets imagine a scenario where we have a multitenant application(each tenant points to a different database) that exposes an API like:


`GET /api/{tenant}/clients` 

And the code for this could be as simple as

```java
@RestController
public class ClientController  {
  
  private final TenantManager tenantManager;
  private final ClientRepository clientRepository;

  public ClientController(TenantManager tenantManager, ClientRepository clientRepository) {
    this.tenantManager = tenantManager;
    this.clientRepository = clientRepository;
  }
  
  @GetMapping("/api/{tenant}/clients")
  public List<Client> getClients(@PathVariable("tenant") String tenant) {
    tenantManager.select(tenant);
    return clientRepository.findAll();
  } 

}
```
<br />
This will depend on the database, for example for SQL implementations, you need to extends the class **AbstractRoutingDataSource**, while for MongoDB, **SimpleMongoClientDatabaseFactory** is the one you need to extends.


