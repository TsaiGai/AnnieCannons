import AWS from "aws-sdk";
const ses = new AWS.SES();
const myEmail = process.env.EMAIL;
const siteUrl = process.env.SITE_URL;

// function to handle data from and back to frontend
export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);

  console.log(data);

  let emailParams = {
    Source: myEmail,
    Destination: {
      ToAddresses: [data.email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html><body><div style="text-align: center; font-size: 1.5em; font-family: 'Open Sans', sans-serif;">
            <div style="background-color: #0B7DB2; text-align: center;">
            <img style="max-width: 600px;" src="https://resourcefullapp.org/wp-content/uploads/2022/08/ResourceFull-Horizontal-FINAL.png" alt="resourcefull logo"/>
            </div>
            <p>Welcome to ResourceFull!</p>
            <p style="width: 50vw; margin: auto;">We are excited to feature your organization on the platform. To login, use your organization's primary email address.</p>
            <p>Primary email address: ${data.email}</p>
            <br></br>
            <a href="${siteUrl}"><img style="border-radius: 10px;" src="https://resourcefullapp.org/wp-content/uploads/2022/11/resourcefull-login-button-red.png" alt="login button"/></a>
            <p></p>
            <br></br>
            <div style="background-color: #0B7DB2;">
            <br></br>
            <p style="font-style: italic; text-align: center; color: white;">Copyright © 2022 ResourceFull. All rights reserved.</p>
            <br></br>
            </div>
            </div></body></html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Welcome to ResourceFull`,
      },
    },
  };
  console.log("emailParams", emailParams);

  try {
    ses.sendEmail(emailParams, (err, data) => {
      if (err) {
        console.log("error", err, err.stack);
      } else {
        console.log("ses", data);
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: false,
    };
    callback(null, response);
    return "success";
  }
}
