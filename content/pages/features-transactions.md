---
title: 'Transactions and manual rollbacks' 
date: Last Modified 
permalink: /features/transactions-and-manual-rollbacks/index.html
toc: true
eleventyNavigation:
  order: 1115 
  parent: features
  key: features transactions and rollbacks 
  title: 'Transactions and rollbacks'
---


## Introduction 

We already discussed the [Mongock process](/technical-overview#mongock-process) and the [migration component](/migration) in previous sections. 

A migration is composed by smaller pieces that run the perform the actual changes. This pieces are the changeUnit(and deprecated changeLog).

As it's name suggests, a changeUnit is the unit of a migration. By default each changeUnit is wrapped in a independent transaction. This can be change by configuration, but it's not recommended.

## Configuration



## How it works

The concept is easy, let see it in an example.

Mongock finds 3 ordered changeUnits pending for execution(c1, c2 and c3) and executes them. However when executing c2, something happens and the changeUnit fails. It's ok! Mongock rollback the change and everything good.


### Status after a changeUnit failure

Everything is ok? Well, it gracefully failed, but that's far from OK. Although c2 was rolled back, so it didn't affect the database's state, the entire migration is half done. What next?

Well, the default scenario(and the normal one) is that the application aborts the startup after the c2 failure(because Mongock throws an exception). This leaves us with the application stopped, c1 executed, c2 failed and c3 untouched. This is actually what is reflected in the Mongock's table/collection. It has an entry per changeUnit with the state(and no entry for c3 as it was never executed).

### What next?
 
 Mongock expects to be executed again, because he wants to finish what he started. So in the next execution, c1 is ignored because it's already executed, but c2 and c3 are executed. 

This process is noramlly handled by an orchestator like Kubernetes who will get into a loop to try to start the service. If c2 keeps failing, it's probably due to an develop error and needs to be sorted. Meanwhile, the the service is not deployed and the older version shuld be still deployed and working.

### Migration half done

You may think: Ok, the migration eventually  takes place, but there is a moment where it's half done and the old deployment is on going. That can produce data incosistency. Yes, correct and that's why we recommend to take the _two steps approach_, specially when your application requires high availability. The _two steps approach_ basically means that you run your migration in two steps(could be two different changeUnits). The first one just provide additions and allows the old version of the code to work with this version of the data with the addition. And the second one perform the removal job. This almost erradicates the chances to fall into an incosistency state.

### @RollbackExecution
This annotation is already explained in the [migration page](/migration). From the transactional point of view, it's important for two reasons:
- It's the way to rollback changes in non-transactional environments(old versions of MongoDB or any other non-transactional engine)
- It's the base of the undo operation. Visit the [undo](#cli#undo) section for more information.

### @BeforeExecution and @RollbackBeforeExecution
Also explained in the [migration section](/migration)

From the transaction point of view is worthy to highlight that the method annotated with @BeforeExecution is always executed before the transaction, and therefore doesn't take part of it.
