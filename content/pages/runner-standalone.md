---
title: 'Runner: Standalone' 
date: Last Modified 
permalink: /runner/standalone/index.html
toc: true
eleventyNavigation:
  order: 60 
  parent: runner
  key: runner standalone
  title: 'Standalone'
---



The standalone runner is the vanilla runner. It's a good option when no framework is used. As there is no framework managing the dependency injection, events, etc. these features have to be handled manually, Mongock provide the setter methods for the developer to provide the handler:

 ## Injecting your own dependencies
 This fearure allows you to inject your own dependencies to you changeUnit classes, in the methods directly or at constructor level. Mongock is intelligent enough to handle it. However you need to somehow provide these dependencies. The standalone builder provides the following methods:

 - **addDependency(Object instance):** Manually adds a dependency to be used in your changeUnits, which can be retrieved by its own type.
 - **addDependency(String name, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a name
 - **addDependency(Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type. This is useful when you have multiple dependencies for the same super type, the way to force to finde by its super type is this method.
 - **addDependency(String name, Class<?> type, Object instance):** Manually adds a dependency to be used in the  changeUnits, which can be retrieved by a type or name

 ## Event listener
 Basically there are 3 Mongock events: 
 - **Migration started event:** Triggered just before starting the migration.
 - **Migration Success event:** Triggered at the end of the migration, if the process successfully finished
 - **Migration failure event:** Triggered at the end of the migration, if process failed

 These events are trigger regardless even when the Mongock process throws an exception.

The standalone builder provides the following methods:
- **setMigrationStartedListener(Consumer<MigrationStartedEvent> listener)**
- **setMigrationSuccessListener(Consumer<MigrationSuccessEvent> listener)**
- **setMigrationFailureListener(Consumer<MigrationFailureEvent> listener)**
