---
title: How it works?
date: Last Modified 
permalink: /how-it-works/index.html
eleventyNavigation:
  key: how-it-works 
  title: How it works
  order: 1
---

Mongock is essentially a migration tool. It offers many operations and ways of using it, but the main and traditional approach is to use it as part of the application's startup in a distributed environment, where more than one agent can potentially execute the migration. 

The main goal is to deploy the data and the code together, to avoid any inconssistency. This obviously implies some challenges that we'll discuss in further sections, but lets explain how it works in an common scenario.


### 1. Scenario
The easiest way to explain the basic use og Mongock, lets describe an imaginary scenario:
We have a microservice called **client-service**, which uses the table/collection `clients`

As part of the development, we have a new user story which requires your application to get some clients data from a third party system and persist them into database, in the `clients` table/collection. This is only required once and must be performed as part of the release.

Another aspect to take into account is that the **client-service** can be potentially scalled horizontally.

### 2. Your migration changes ([changelog](/changelog/))
We first need is to code the migration to retrieve the data from the third party system and persist it in the database. For this we have the changelog, where we write the code. 

Please, visit the [changelog section](/changelog/) for more information.

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

<p class="noteAlt"> Please note that a <b>changelog represents an unit of migration</b>, which means that <b>each changelog is wrapped in a transaction</b>. As soon as it's finished, it's commited.</p>


### ... other ways of running Mongock
As said, the explained way of running Mongock is the common and traditional one, however Mongock offers more.

You can use the Mongock CLI to run the same migration, but also other operations like undo, list and mucho more we'll provide.

Please, visit the [cli section](/cli/) for more information.

But we are also working in other tools, like a a dashboard, centralized server and more.