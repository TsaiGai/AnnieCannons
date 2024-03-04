const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();

export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);
  console.log(data);
  let paginationToken;

  let params = {
    UserPoolId: process.env.USER_POOL,
    Filter: `email="${data.email}"`,
    Limit: 1,
    PaginationToken: paginationToken,
  };
  let result;
  try {
    result = await cognito.listUsers(params).promise();
    paginationToken = result.PaginationToken;
    console.log("listUsers", result);
  } catch (e) {
    console.log("checkIfUserExists error", e);
  }
  let userExists;
  if (result.Users && result.Users.length > 0) {
    userExists = true;
  } else {
    userExists = false;
  }
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ userExists: userExists }),
  };
  callback(null, response);
  return "success";
}
