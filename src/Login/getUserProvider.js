import AWS from "aws-sdk";
// const ses = new AWS.SES();
// const myEmail = process.env.EMAIL;
// const siteUrl = process.env.SITE_URL;

// // const USER_POOL = "";
// const MESSAGE_ACTION_RESEND = "RESEND";

// const CognitoISP = new AWS.CognitoIdentityServiceProvider();

const { Client } = require("pg");

// // function to handle resending temporary password
// const resetTemporaryPasswordByEmail = async (email) => {
//   const cognitoUser = await getAccountByEmail(email);
//   const randomstring = "Ac12!" + Math.random().toString(36).slice(-8);
//   console.log("cognitoUser", cognitoUser);

//   let cognitoAdmin;
//   try {
//     cognitoAdmin = await CognitoISP.adminCreateUser({
//       UserPoolId: process.env.USER_POOL,
//       //   Username: cognitoUser.Username,
//       Username: email,
//       MessageAction: MESSAGE_ACTION_RESEND,
//       TemporaryPassword: randomstring,
//     }).promise();
//     console.log("cognitoAdmin in resetTempPwd function", cognitoAdmin);
//     return true;
//   } catch (error) {
//     console.log("resend error", error);
//   }
// };

// // function to get user account by email
// const getAccountByEmail = async (email) => {
//   let paginationToken;

//   do {
//     let params = {
//       UserPoolId: process.env.USER_POOL,
//       Filter: `email="${email}"`,
//       Limit: 1,
//       PaginationToken: paginationToken,
//     };

//     let result = await CognitoISP.listUsers(params).promise();
//     paginationToken = result.PaginationToken;
//     console.log("listUsers", result);

//     if (result.Users.length < 1) {
//       continue;
//     }

//     return result.Users[0];
//   } while (paginationToken !== undefined);

//   throw new Error("Account not found");
// };

// function to handle data from and back to frontend
export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);

  console.log(data);

  //Connect to PostgresDB
  const client = new Client({
    user: process.env.USERNAME,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.POSTGRESQL_PORT,
  });

  // // check if resending temporary password is requested from frontend
  // if (data.resendTempPassword === true) {
  //   resetTemporaryPasswordByEmail(data.email);
  //   console.log("resend temporary password email sent");
  //   const response = {
  //     statusCode: 200,
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Credentials": true,
  //     },
  //     body: JSON.stringify({ resendTempPassword: false }),
  //   };
  //   callback(null, response);
  //   return "success";
  // } else {
    // if resending temporary password is not requested, then get provider data to enable login
    await client.connect();

    var text =
      "SELECT *, avatar_colors FROM provider_user_table INNER JOIN provider_org_table ON provider_user_table.provider = provider_org_table.provider_name WHERE user_id = $1";

    var value = [data.user_id];

    var getParticipantData = await client.query(text, value);
    console.log("get provider data", getParticipantData);
    // console.log("data.email", data.email);
    // const cognitoUser = await getAccountByEmail(data.email);

    // const cognitoUser = await CognitoISP.adminGetUser({
    //   Username: data.user_id,
    //   UserPoolId: process.env.USER_POOL,
    // }).promise();
    // console.log("cognitoUser", cognitoUser);

    // if (getParticipantData.rows[0].first_time_login) {
    //   let emailParams = {
    //     Source: myEmail,
    //     Destination: {
    //       // ToAddresses: [getParticipantData.rows[0].email_intake_notify],
    //       // ToAddresses: [cognitoUser.Attributes[2].Value],
    //       ToAddresses: [cognitoUser.UserAttributes[2].Value],
    //     },
    //     Message: {
    //       Body: {
    //         Html: {
    //           Charset: "UTF-8",
    //           Data: `<html><body><div style="text-align: center; font-size: 1.5em; font-family: 'Open Sans', sans-serif;">
    //         <div style="background-color: #0B7DB2; text-align: center;">
    //         <img style="max-width: 600px;" src="https://resourcefullapp.org/wp-content/uploads/2022/08/ResourceFull-Horizontal-FINAL.png" alt="resourcefull logo"/>
    //         </div>
    //         <p>Welcome to ResourceFull!</p>
    //         <p style="width: 50vw; margin: auto;">We are excited to feature your organization on the platform. To login, use your organization's primary email address.</p>
    //         <p>Primary email address: ${
    //           // getParticipantData.rows[0].email_intake_notify
    //           // cognitoUser.Attributes[2].Value
    //           cognitoUser.UserAttributes[2].Value
    //         }</p>
    //         <br></br>
    //         <a href="${siteUrl}"><img style="border-radius: 10px;" src="https://resourcefullapp.org/wp-content/uploads/2022/11/resourcefull-login-button-red.png" alt="login button"/></a>
    //         <p></p>
    //         <br></br>
    //         <div style="background-color: #0B7DB2;">
    //         <br></br>
    //         <p style="font-style: italic; text-align: center; color: white;">Copyright © 2022 ResourceFull. All rights reserved.</p>
    //         <br></br>
    //         </div>
    //         </div></body></html>`,
    //         },
    //       },
    //       Subject: {
    //         Charset: "UTF-8",
    //         Data: `Welcome to ResourceFull`,
    //       },
    //     },
    //   };
    //   console.log("emailParams", emailParams);
    //   ses.sendEmail(emailParams, (err, data) => {
    //     if (err) {
    //       console.log("error", err, err.stack);
    //     } else {
    //       console.log("ses", data);
    //     }
    //   });
    //   var text1 =
    //     "UPDATE provider_user_table SET first_time_login = $1 WHERE user_id = $2";
      
    //   //  var value1 = [false, cognitoUser.Attributes[0].Value];
    //   var value1 = [false, cognitoUser.UserAttributes[0].Value];

    //   var firstTimeLoginUpdate = await client.query(text1, value1);
    //   console.log("firstTimeLoginUpdate", firstTimeLoginUpdate);
    // }

    // let sendToFrontEnd =
    //   data.resendTempPassword === true
    //     ? false
    //     : JSON.stringify(getParticipantData.rows);
    // console.log("sendToFrontEnd", sendToFrontEnd);

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(getParticipantData.rows),
    };
    callback(null, response);

    await client.end();
    return "success";
  // }
}

// const { Client } = require("pg");

// export async function handler(event, context, callback) {
// 	var data = JSON.parse(event.body);

// 	console.log(data);

// 	//Connect to PostgresDB
// 	const client = new Client({
// 		user: process.env.USERNAME,
// 		host: process.env.POSTGRESQL_HOST,
// 		database: process.env.DB_NAME,
// 		password: process.env.PASSWORD,
// 		port: process.env.POSTGRESQL_PORT,
// 	});

// 	await client.connect();

// 	var text = "SELECT * FROM provider_user_table WHERE email = $1";

// 	var values = [data.email];

// 	var getUserRole = await client.query(text, values);
// 	console.log(getUserRole);

// 	var text2 =
// 		"SELECT avatar_colors FROM provider_org_table WHERE provider_name = $1";

// 	var values2 = [data.provider_name];

// 	var getColor = await client.query(text2, values2);
// 	console.log(getColor);

// 	var arr = {
// 		user_data: getUserRole.rows,
// 		colors: getColor.rows,
// 	};

// 	const response = {
// 		statusCode: 200,
// 		headers: {
// 			"Access-Control-Allow-Origin": "*",
// 			"Access-Control-Allow-Credentials": true,
// 		},
// 		body: JSON.stringify(arr),
// 	};
// 	callback(null, response);

// 	await client.end();
// 	return "success";
// }
