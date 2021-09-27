---
title: What is Mongock?
date: Last Modified 
permalink: /what-is-mongock/index.html
eleventyNavigation:
  key: what is mongock 
  title: What is Mongock?
  order: 0
---

1. [What is Mongock?](#what-is-mongock%3F)
2. [Why Mongock?](#why-mongock%3F)
4. [How it works](#how-it-works)


# What is Mongock?
Mongock is a Java based Migration tool as part of your Application code. It allows Developers to have ownership and control over Data migrations during the deployment process, allowing safer migrations in Distributed Systems as code and data changes are shipped together. 

It was originally designed for MongoDB Data migrations and the product is evolving to provide a wider suite of NoSQL / SQL Database compatibility and cover other feautures for transactional execution use cases that require state management in Distributed systems. 

------------------------------------------------

## Why Mongock?
Our mission is to enable Developers to deploy and manage stateful Data migrations in Distributed Systems in a safe and reliable manner. If you are looking for migrating data for your Java Application Services in a safe and reliable manner via Code, Mongock is your best bet.

There are several features Mongock enables you in your project:
- Mongock is a Java-based tool that you can import in your Application.
- Mongock promotes a Code-first approach for Migrations, allowing you to write your migration scripts in Java wh will ship with your Application code.
- Mongock persists in your DB the changes made, allowing you to gain more control over the management of DB changes via Migrations, Rollbacks + other amazing features.
- It is the most reliable production-grade solution for MongoDB migrations currently in the market, compatible with Mongo Atlas and different MongoDB versions.
- Distributed solution with solid locking mechanism.
- Our team offers great support and is very responsive.
- We are an open source tool, operating under the Apache License 2.0 
- We maintain and update features regularly.
- Currently used by several tech companies in different industries.
- Adopted by well known frameworks such as JHipster as part of the scaffolding.
- Can be used together with most, if not all, frameworks.
- Can run in Standalone projects without depending on frameworks.
- Great support with the Spring framework overall, with native implementations in SpringBoot.

Get more information about our support model at dev@cloudyrock.io​ and we can help you walking you to production. 

------------------------------------------------

## How it works

### 1. Scenario
The easiest way to explain the basic use og Mongock, lets describe an imaginary scenario:
We have a microservice called **client-service**, which uses the table/collection `clients`

As part of the development, we have a new user story which requires your application to get some clients data from a third party system and persist them into database, in the `clients` table/collection. This is only required once and must be performed as part of the release.

Another aspect to take into account is that the **client-service** can be potentially scalled horizontally.

### 2. Your migration changes ([ChangeUnit](/migration/))
We first need is to code the migration to retrieve the data from the third party system and persist it in the database. For this we have the changeUnit, where we write the code. 


Please, visit the [changeUnit section](/migration/) for more information.


<div class="successAlt">
<b>From version 5, ChangeLog annotation is deprecated. It's been replaced by ChangeUnit</b>
<p style="margin-left:2em">Old ChangeLog annotation won't be removed from the code for backward comptability, although its use is not recommended from now on</p>
<p style="margin-left:2em">We rcommended the following approach:</p>
<p style="margin-left:2em">- For existing migrations created prior version 5: Leave them untouched (use with the deprecated annotation)</p>
<p style="margin-left:2em">- <b>For new migrations: Use @ChangeUnit annotation.</b></p>
</div>


### 3. The persistent layer ([driver](/driver/))
Obviously we need to access the database for multiple reasons:
- We need to persist the client data we just retrieved
- Mongock needs to track the changelogs that have been executed, so the **client-service** doesn't execute them twice
- As we mentioned, the **client-service** can be scalled horizontally, so more than one instance of the **client-service** may be deployed simultaneously, trying to execute the same migration. To prevent this, Mongock uses a pesimistic lock that is persisted in database.

For this we have the **Mongock driver**. Which contains all the information and mechanisms to acces to the database. Mongock provides multiple drivers for different databases, we just need to pick the relevant one for us and configure them provding some information like the the target schema, etc.

Please, visit the [driver section](/driver/) for more information.

### 4. Run the migration
Once we have coded our migration in our changelog and configured the persistent layer using a Mongock driver, we need to run the migration. Forthis we have the **Mongock runner**.

The mongock runner is a kind of orchestator in charge of the environment aspects(framework, etc.), taking all the configuration, the driver and the changelogs and run the migration in an orderly manner. The common use requires the application not to start until the migration has been succesfully finalized(although this is behaviour can be altered), this means that if the migration fails, the application stops its startup process and exits. This should be tried again and Mongock will continue where he left.

Mongock provides multiple runner(and more coming), for standalone applications that don't use any framework, springboot, micronaut(coming soon), etc. 

Please, visit the [runner section](/runner/) for more information.

### ... Cool, but we got a new user story! :scream:

Great, we have the migration done, rtested, deployed and working nicely. Great! But now we got another user story to add a new field. Well, we already have Mongock setup, we only need to another changelog to address this change in the same way we did previously. Don't worry, Mongock will take care of running only the changelog that haven't been executed yet.

<p class="noteAlt"> Note that a <b>changelog represents an unit of migration</b>, which means that <b>each changelog is wrapped in a transaction</b>. As soon as it's finished, it's commited.</p>


### ... other ways of running Mongock
As said, the explained way of running Mongock is the common and traditional one, however Mongock offers more.

You can use the Mongock CLI to run the same migration, but also other operations like undo, list and mucho more we'll provide.

Please, visit the [cli section](/cli/) for more information.

But we are also working in other tools, like a a dashboard, centralized server and more.