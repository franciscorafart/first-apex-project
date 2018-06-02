Application to send mass sms with AWS lambdas and SQS workers and the Twilio API.


- Create Configuration files.

For APEX you need a project.json file with your environmental variables and a function.json file for each function that requires special cinfigurations (role, timeout, for example).

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
