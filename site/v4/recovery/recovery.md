---
title: Recovery
date: 2014-04-18 11:30:00 
permalink: /v4/recovery/index.html
eleventyNavigation:
  version: v4
  root: true
  order: 12
---

# Recovery\(coming soon\)

<div style="info">
**Coming soon**
</div>

In non-transactional environments, the recovery mechanism will allow you to execute some actions when a changeSet fails to simulate your manual "rollback". It works retrospectively in reverse order, so when a changeSet fails, it will run all the recovery methods associated with the executed changeSets, starting from the most recently executed.

‌

#### Scenario

| Execution order | ChangeSet | Recovery | State |
| :--- | :--- | :--- | :--- |
| 1st | changeSet1 | recovery\_changeSet1 | EXECUTED |
| 2nd | changeSet2 | no\_recovery | EXECUTED |
| 3rd | changeSet3 | recovery\_changeSet3 | EXECUTED |
| 4th | changeSet4 | recovery\_changeSet4 | FAILED |

‌

Assuming a non-transactional environment, after changeSet4 fails, as it's not marked with failFast to false, Mongock will run the recovery process, which will run in order: recovery\_changeSet4, recovery\_changeSet3, recovery\_changeSet1.

‌

Please notice that changeSet2 does not provide any recovery, so it's ignored.  


