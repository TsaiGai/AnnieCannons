import AWS from "aws-sdk";

const MESSAGE_ACTION_RESEND = "RESEND";

const CognitoISP = new AWS.CognitoIdentityServiceProvider();

// function to handle resending temporary password
const resetTemporaryPasswordByEmail = async (email) => {
  const cognitoUser = await getAccountByEmail(email);
  const randomstring = "Ac12!" + Math.random().toString(36).slice(-8);
  console.log("cognitoUser", cognitoUser);

  let cognitoAdmin;
  try {
    cognitoAdmin = await CognitoISP.adminCreateUser({
      UserPoolId: process.env.USER_POOL,
      //   Username: cognitoUser.Username,
      Username: email,
      MessageAction: MESSAGE_ACTION_RESEND,
      TemporaryPassword: randomstring,
    }).promise();
    console.log("cognitoAdmin in resetTempPwd lambda", cognitoAdmin);
    return true;
  } catch (error) {
    console.log("resend error", error);
  }
};

// function to get user account by email
const getAccountByEmail = async (email) => {
  let paginationToken;

  do {
    let params = {
      UserPoolId: process.env.USER_POOL,
      Filter: `email="${email}"`,
      Limit: 1,
      PaginationToken: paginationToken,
    };

    let result = await CognitoISP.listUsers(params).promise();
    paginationToken = result.PaginationToken;
    console.log("listUsers", result);

    if (result.Users.length < 1) {
      continue;
    }

    return result.Users[0];
  } while (paginationToken !== undefined);

  throw new Error("Account not found");
};

// function to handle data from and back to frontend
export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);

  console.log(data);

  try {
    await resetTemporaryPasswordByEmail(data.email);
    console.log("resend temporary password email sent");
  } catch (error) {
    console.log(error);
  } finally {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ resendTempPassword: false }),
    };
    callback(null, response);
    return "success";
  }
}
