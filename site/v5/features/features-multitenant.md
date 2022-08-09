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
There are situations when you need to setup multiple tenants in a single project. A common scenario is when a consultancy provies a SaaS product in which, instead of having a shared database for all the clients, they have their own and independent database, but sharing the same deployment and source code.

## Configuration

There are two points where the transactions are configured to be enforced or disabled, the property `mongock.transactionEnabled`(setTransactionEnabled method in the builder) and the **driver**.

In every driver's page, you will find enough information about how to enable the native transactions. Sometimes they are enabled by default and other times, like in the Springboot ecosystems, the transactions manager needs to be injected in the context.


As explained in the [runner properties table](/v5/runner#Configuration), the Mongock native transactionability follows the next logic:

<div class="success">
<p >When <b>mongock.transactionEnabled</b> is true, it enforces native transactions, throwing an exception is the driver is not capable of it.</p>
<p >When <b>mongock.transactionEnabled</b> is false, it disables the transactions and ignores the transactionability of the driver.</p>
<p >When <b>mongock.transactionEnabled</b> is null, it totally delegates on the driver the transactionability of the migration.</p>
</div>
 

## How it works

The easiest way to understand how Mongock handles the transactions is by looking at [this section](/v5/technical-overview#process-steps).


## Best practices

- Always set explicitly the `mongock.transactionEnabled` property to true/false.
- DDL operations placed in the @BeforeExecution method of the changeUnit.