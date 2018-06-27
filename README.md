Application to send mass sms with AWS lambdas, SQS workers and the Twilio API. Built with APEX.

1) Download the Files
2) Install Apex (apex.run) and configure
3) 
4) Create Configuration files.
5) Create corresponding IAM roles for each function in AWS
    a. consumer -> LambdaBasicExecution
    b. readDB -> LambdaBasicExecution, DynamoDB read permissions (scan in particular)
    c. send_sqs -> SQS send message
    d. sms -> LambdaBasicExecution
    e. sns_to_sms -> LambdaBasicExecution, SNS
    f. worker -> LambdaBasicExecution, SQS
    g. writeDB -> LambdaBasicExecution, DynamoDB write


6) Create DynamoDB with three tables: 'contacts', 'messages' and 'twilionumbers'
7) Create API gateway in AWS with POST methods that trigger the following lambdas: sns_to_sms, write_db and send_sqs

For APEX you need a project.json file with your environmental variables and a function.json file for each function that requires special configurations (role, timeout, for example).

# project.json

{
  "name": "your-project-name",
  "description": "Your description",
  "memory": 128,
  "timeout": 5,
  "role": "arn:your-lambda-role",
  "environment": {
      "authToken": "your-twilio-token",
      "accountSid": "your-twilio-SID",
      "myName": "your-name",
      "testNumber": "your-test-number",
      "fromNumber": "from-number",
      "queue_url": "your-sqs-url"
  }
}

# function.js (for send_sqs function)

{
  "timeout": 15,
  "role": "arn:your-sqs-role"
}
