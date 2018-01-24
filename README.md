# serverless CRUD Orders
Creating serverless rest api application to perform simple CRUD operation using MYSQL database with Sequelize ORM

### Setup

```
  export AWS_ACCESS_KEY_ID=<key>
  export AWS_SECRET_ACCESS_KEY=<key>
  export AWS_DEFAULT_REGION=<region>

  npm install
  npm run package
  serverless deploy
 ``` 
###  For Database configuration
    Edit your database credentials in `lib/config/env.json`
  

# To Run locally via [lambda-local](https://www.npmjs.com/package/lambda-local)

This example demonstrates how to run a serverless locally for testing purpose

```
  npm install
  npm run package
```

Create 
  Command:
     `lambda-local -l lib/create -h create -e data-local/create.js -t 20`

ListAll 
  Command:
    `lambda-local -l lib/list -h list -e data-local/list.js -t 20`
    
ListSpecific 
  Command:
    `lambda-local -l lib/get -h get -e data-local/get.js -t 20`

Update 
  Command:
    `lambda-local -l lib/update -h update -e data-local/update.js -t 20`

Delete 
  Command:
    `lambda-local -l lib/delete -h delete -e data-local/delete.js -t 20`   


### Notes:    
`callbackWaitsForEmptyEventLoop`
The default value is true. This property is useful only to modify the default behavior of the callback. By default, the callback will wait until the Node.js runtime event loop is empty before freezing the process and returning the results to the caller. You can set this property to false to request AWS Lambda to freeze the process soon after the callback is called, even if there are events in the event loop. AWS Lambda will freeze the process, any state data and the events in the Node.js event loop (any remaining events in the event loop processed when the Lambda function is called next and if AWS Lambda chooses to use the frozen process). For more information about callback, see Using the Callback Parameter.





    
 







