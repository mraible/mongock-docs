---
title: FAQ
date: 2014-04-18 11:30:00 
permalink: /faq/index.html
eleventyNavigation:
  root: true
  order: 90
---

[[TOC]]

## Why we have added the ChangeUnit annotation and deprecated ChangeLog
Mogock team is aware of the implications of this change, that's why is totally backguard compatible. All the old code related to `@ChangeLog`, `@ChangeSet` will remain compatible.

However, the Mongock team has identified that the old changelog strucutre starts to strugle handling new features. The configuration was cumbersome and a bit more complex that needed.

This the reason we have added the `@ChangeUnit`. A more practical version of the `@ChangeLog`, which can be see as a changeLog, wich a unique and mandatory changeSet(`@Execution`) that also requires a complementary method `@RollbackExecution`

More information in the [migration section](/migration)


## I've migrated to Mongock 5 and there are some existing @ChangeLog classes in my project. Should I remove or change them?
No. Your old changeLogs should remain untouched. Although deprecated, they will remain in the code for backguard compatibility. 

For more information about the recommended approach, please visit [this section](/migration#changelog)

## What happens if a changeUnit fails
Mongock always try to rollback the failed changes. In a transactional environment, Mongock relies on the database transactional mechanism to rollback the migration changes(`@Ececution` method) as well as the mongock metatadata associted to the change. In summary it would be like that change nwas never started. In a non-transactional environment, Mongock manually tries to rollback the migration change by executing the `@RollbackExecution` method and marks the change entry as `ROLLED_BACK` in the database. Please notice that although Mongock will try its best to achieve this, it's not guranteed.

Once that rollback operation is performed, Mongock will abort the migration and throw an exception. The next time Mongock is executed will carry on from the failed changeUnit. You need to understand that if the changeUnit keep failing, Mongock will keep aborting. In an self-deployed infrastructure like Kubernetes this potentitally means get into an infitnie loop.  

## Should I implment the @RollbackExecution method in transactional environments?
Yes, we highly recommend to implement the `@RollbackExecution` method. 

The main reason for this is that some other operations like undo, rely on this methods to work. However it's a very good practice as it provides a robust system that is less affected when moving to non-transactional environments. 


## Can Mongock be used in applications deployed in Kubernetes?
Yes. Actually the main use of Mongock is as part of the application start up, shipping together code and data changes, providing safer migratios in distributed systems.

## Does the CLL change something in my application?
No. The CLI just takes from your application what is needed to run the migration.

With Mongock standalone, it takes the `MongockBuilderProvider` implementations and retrieves the builder. For Springboot, by default it loads the entire Springboot context, but you can filter which configuration class to load by annotating the main class with `@MongockCliCOnfiguration`. For more information please visit the [cli page](/cli)

## Until which Spring data version is MongockTemplate compatible with?
4.2.3. But you can use more recent version of Spring Data. MongockTemplate won't refect the new API, but it won't complain.

## I have some references to MongockTemplate in my project and I've upgraded to version 5, should I remove them?
No, even if you use a more updated version of Spring Data. You just use Spring MongoTemplate for now on.

## What's the difference between undo and rollback?
**Rollback** is the act of reverting a change when it fails at execution time. On the other hand **undo** is the act of reverting a change some time after being successfully executed.



<!--## My migrations take long and it impacts my startup time... what should I do?

## What if we have an environmment with the latest changes and others out of synch?
## How manage HA in changes-> two step changes-->