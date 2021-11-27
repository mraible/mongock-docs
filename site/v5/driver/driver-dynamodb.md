---
title: 'DynamoDB' 
date: 2014-04-18 11:30:00 
permalink: /v5/driver/dynamodb/index.html
toc: true
eleventyNavigation:
  version: v5
  order: 90 
  parent: driver
  key: driver dynamodb 
  title: 'Dynamdb'
---
[[TOC]]

## Introduction
This section explains the Mongock Driver for DynamoDB and how to use it.
<br />

-------------------------------------------

## DynamoDB driver options and compatibility

Mongock provides the `DynamoDBDriver`, which is compatible with the library `com.amazonaws:aws-java-sdk-dynamodb` 1.x.x.

You can also use the Mongock spring extension to get advantage from the autconfigure approach with Springboot.

<br />

-------------------------------------------

## DynamoDB common configuration

<p class="tipAlt">When setting configuration via properties file, it must be prefixed by <b>mongock.dynamo-db</b></p>

### Properties


| Property           | Description                                                                                  | Type                | Default value |
| -------------------|----------------------------------------------------------------------------------------------|---------------------|---------------|
| **provisionedThroughput.readCapacityUnits**   | Exactly the same DynamoDB parameter **readCapacityUnits**. For more information, visit the official DynamodDB documentation for [readCapacityUnits](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html/).  | Long      |`50` |  
| **provisionedThroughput.writeCapacityUnits**    | Exactly the same DynamoDB parameter **writeCapacityUnits**. For more information, visit the official DynamoDB documentation for [writeCapacityUnits](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html/).  | Long      | `50` |

<br />

------------------------------------------- 


## Get started 
Following the [get started section](/v5/get-started#steps-to-run-mongock), this covers steps 3 and 5 and 6.

### Add maven dependency for the driver (step 2)

#### Standalone 
```xml
<!--Standalone use-->
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>dynamodb-driver</artifactId>
</dependency>

```

#### With Springboot 
```xml
<dependency>
  <groupId>io.mongock</groupId>
  <artifactId>dynamodb-springboot-driver</artifactId>
</dependency>
```

### Build the driver (setps 5)

<p class="successAlt"><b>This step is only required for builder approach.</b> Mongock handles it when autoconfiguration is enabled.</p>
These classes provide the same two static initializers

- **withDefaultLock**(AmazonDynamoDBClient dynamoDBClient)
- **withLockStrategy**(AmazonDynamoDBClient dynamoDBClient, long lockAcquiredForMillis, long lockQuitTryingAfterMillis,long lockTryFrequencyMillis)

```java
DynamoDBDriver driver = DynamoDBDriver.withDefaultLock(dynamoDBClient);
```

### Driver extra configuration (step 6)

#### Transactions
Due to the DynamoDB API design, in order to work with transactions, the DynamoDB client needs to use `TransactWriteItemsRequest`. To abstract the user from this and provide the most convenient experience, a ChangeUnit needs to inject the class `DynamoDBTransactionItems` provided by Mongock, to add the items that will take part of the transaction

Also take into account that DynamoDB [only allows 25 elements in a single transaction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html) and one of those items must be the Mongock's ChangeEntry, so the user can add up to 24 items to the transaction.


<br /><br />
The following code shows how to use transactions with DynamoDB driver.
```java
  @Execution
  public void execution(DynamoDBTransactionItems client) {
    Put put = new Put().withTableName(tableName).withItem(myEntity.getMapTtributes());
    transactionItems.addChangeEntry(new TransactWriteItem().withPut(put))
  }
```

<br />

-------------------------------------------


## Examples 
<p class="successAlt">Please visit out example projects in [this repo](https://github.com/mongock/mongock-examples/tree/master/dynamodb) for more information</p>



#### Example autoconfiguration with Springboot

```yaml
mongock:
mongock:
  dynamo-db:
    provisionedThroughput:
      readCapacityUnits: 100
      writeCapacityUnits: 100
```

```java
@EnableMongock
@SpringBootApplication
public class QuickStartApp {


    public static void main(String[] args) {
        SpringApplicationBuilder().sources(QuickStartApp.class)().run(args);
    }
    
    @Bean
    public AmazonDynamoDBClient amazonDynamoDBClient() {
        return (AmazonDynamoDBClient) AmazonDynamoDBClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(SERVICE_ENDPOINT, REGION))
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY)))
                .build();
    }

}
```

### Example: DynamoDB standalone
```java
DynamoDBDriver driver = DynamoDBDriver.withDefaultLock(dynamoDBClient);
driver.setProvisionedThroughput(new ProvisionedThroughput(100L, 100L));
```


### Example: DynamoDB Springboot
```java
@EnableMongock
@SpringBootApplication
public class QuickStartApp {

    //AmazonDynamoDBClient beans needs to be injected, so the Mongock context can build the driver
    @Bean
    public AmazonDynamoDBClient amazonDynamoDBClient() {
        return (AmazonDynamoDBClient) AmazonDynamoDBClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(SERVICE_ENDPOINT, REGION))
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY)))
                .build();
    }
}
```
