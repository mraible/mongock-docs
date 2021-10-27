---
title: Reactive
date: 2014-04-18 11:30:00 
permalink: /v4/reactive/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 12
---

# Reactive

Although support to reactive streams and repositories is in the roadmap and will e supported by Mongock, it's not yet. Anyway, of course that doesn't mean you cannot use Mongock in a project where you are using reactive streams to connect to MongoDB.  We will explain in the next section what really means and the few implications.

<div class="tip">
You can use Mongock in a project where you are connecting to MongoDB via reactive streams or repositories. Keep reading to understand how 😉 
</div>

## Then, what does it really mean?

1. You need to import the non-reactive MongoDB library in addition to the reactive one.
2. In  case you are using `@EnabledMongock` approach, a MongoTemplate bean needs to be injected to the Spring context.
3. You should NOT use reactive repositories or streams in your changeLogs. Technically you could use them as explained in section [Using custom beans in changeSet methods](/v4/injecting-custom-dependencies-to-changesets), but you can get unexpected results.

## Libraries you need to import

### MongoDb driver

If you are using MongoDB driver directly, you would be probably importing `mongodb-driver-reactivestreams` , in that case you would need to import `mongodb-driver-sync` as well.

### Spring data

On the other hand, if you are using Spring data in your project, you are probably importing `spring-boot-starter-data-mongodb-reactive`, in this case you need to import `spring-boot-starter-data-mongodb` as well.