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

### The challenge
Springdata hides all the complexity to connect to the database, which helps a lot, but it also means the developer needs to give some flexibility up . In this case, it's not straightforward specifying the database which we want to connect to.

Lets imagine the following scneario...
<br />

- We have 3 tenants(one database per each) and an API(`GET /api/{tenant}/products`) that returns the list of products per tenant. 

<br />

```java
@RestController
public class ClientController  {
  
  private final ClientRepository clientRepository;

  public ClientController(ClientRepository clientRepository) {
    this.clientRepository = clientRepository;
  }
  
  @GetMapping("/api/{tenant}/clients")
  public List<Client> getClients(@PathVariable("tenant") String tenant) {
    return clientRepository.findAll();
  } 
}
```

The above code wouldn't work because of:
- The tenant parameter in the controller's method(`getClients()`) is supposed to be used to retrieve the list of products for a given tenant. However, the above code doesn't use it at all. First thought may be to pass it to the repository's method, like `clientRepository.findAll(tenant)`, but remember that each tenant has its own database, it's not a column in a table which cab be used as query filter. 
- If each tenant has it's own database, which database is `clientRepository` pointing to? 

### The solution
When interacting with a Springdata repository in a multitenant environment, a mechanism to select the tenant's database you want to point to is required. 

<br />

This normally gets the shape of a *Tenant manager or selector* , which is used by the internal Springdata classes, but also shared with any component that should be able to tell Springdata which tenant's database it wants to talk to.

Following the previous example, the solution would look like this:

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

Springdata would use the `tenantManager` to know which database point to. The implemenation depends on the database. For example for SQL, it requires to extend the class `AbstractRoutingDataSource`, while for MongoDB(example [here](https://github.com/mongock/mongock-examples/blob/master/mongodb/springboot-multitenant/src/main/java/io/mongock/professional/examples/config/MultiTenantMongoDBFactory.java)), `SimpleMongoClientDatabaseFactory`.

<br />

The only bit missing is how to link all this to Mongock(it needs the `tenantManager` to select the tenant when applying the change units). For this, Mongock provides the interface `TenantManager`, whose implementation needs to be injected as a bean. There are two options:

- Using the default implemenation, `TenantManagerDefault`. 
- Implementing the interface `TenantManager`, if custom implementation is required.


## Resources

- [MongoDB + standalone example](https://github.com/mongock/mongock-examples/tree/master/mongodb/standalone-mongodb-multitenant)
- [MongoDB + Springdata example](https://github.com/mongock/mongock-examples/tree/master/mongodb/springboot-multitenant)


