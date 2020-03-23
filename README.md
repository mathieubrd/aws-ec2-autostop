# AWS Lambda Stop Running EC2 Instances

An AWS Lambda that stops all running EC2 instances based on tags.  
This Lambda could be run automatically by a CloudWatch Event (every day or so).  
The main purpose of this lambda is to help you reduce your AWS bills.

## How it works

This Lambda is based on EC2 tags to decide whateven an instance must be keep running or not.  
It uses the ```RunMode``` tag that can take two values:
* ```OnDemand```  
The instance is automatically stopped by the Lambda nad must be restarted manually.
* ```AlwaysOn```  
The instance will not be stopped by the Lambda.

**If an instance does not have the ```RunMode``` tag nor it has an unrecognized value, the Lambda assumes the ```OnDemand``` value.**

## IAM Role

This Lambda requires an execution role to work properly.  
The IAM role must have the following policies:
* The ```AWSLambdaBasicExecutionRole``` AWS-managed policy.  
* A customer-managed policy with these permissions:
    * ```ec2:DescribeInstances```
    * ```ec2:StopInstances```

## Return values

This Lambda returns to different values:

- If no instance has been shutted down, the Lambda returns ```No OnDemand instance running.```
- If one or many instances have been shutted down, the Lambda returns the list of the stopped instance's IDs.

These values are logged to CloudWatch by using the ```console.log``` function.
