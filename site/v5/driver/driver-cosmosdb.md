---
title: 'CosmosDB' 
date: 2014-04-18 11:30:00 
permalink: /v5/driver/cosmosdb/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 90 
  parent: driver
  key: driver cosmosdb 
  title: 'CosmosDB'
---

<h1 class="title">CosmosDB Driver</h1>


[[TOC]]

<p class="success">You can manage your <b>CosmosDB</b> migrations by using the Mongock drivers for MongoDB</p>


## Introduction
[Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) provides multiple APIs to connect to it. One of them it's the API for MongoDB, which makes it easy to use Cosmos DB as if it were a MongoDB database. 

You can leverage your MongoDB experience and continue to use your favorite MongoDB drivers, SDKs, and tools by pointing your application to the API for MongoDB account's connection string.

## Getting started
**You can use Mongock to manage your Cosmos DB migrations in the same way you would do with MongoDB**, using one of the drivers Mongock provides for MongoDB. You can see how to use it in our [MongoDB driver section](/v5/driver/mongodb)
 
## Important notes
### Sharding the Mongock ChangeLog collection
If you want to shard the Mongock changeLog collection, you need to use the key `executionId` as shard key. This is due to the fact that the `executionId` is the prefix of the Mongock's compound index and the MongoDB official documentation states:

`...The index can be an index on the shard key or a compound index where the shard key is a prefix of the index.`

You can find more information about [shard keys](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-indexes) and [prefixes](https://docs.mongodb.com/manual/core/index-compound/#prefixes)

### Transactions
 Although MongoDB does support Multi-document transactions(in a single or multiple, and sharded collections), they are not supported across collections or in sharded collections in version 4.0.



## Resources

You can find more information about Cosmos DB with MongoDB API and Java, here:

- [Azure Cosmos DB API for MongoDB](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/mongodb-introduction)
- [Quickstart: Create a console app with Java and the MongoDB API in Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/create-mongodb-java)
- [Use Multi-document transactions in Azure Cosmos DB API for MongoDB](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/use-multi-document-transactions)
- [MongoDB transactions](https://docs.mongodb.com/v5.0/core/transactions/)
- [MongoDB shard keys](https://docs.mongodb.com/manual/core/sharding-shard-key/#shard-key-indexes)
- [MongoDB compound indexes](https://docs.mongodb.com/manual/core/index-compound/#prefixes)
