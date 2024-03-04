const { Client } = require("pg");
const AWS = require("aws-sdk");
const ses = new AWS.SES();
const myEmail = process.env.EMAIL;

// const Cryptr = require('cryptr');
// const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
// import {
// 	KmsKeyringNode,
// 	buildClient,
// 	CommitmentPolicy,
//   } from '@aws-crypto/client-node'

// const { encrypt, decrypt } = buildClient(
// 	CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
// )

export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);

  const timestamp = new Date().toISOString();
  console.log(data);

  //Connect to PostgresDB
  const client = new Client({
    user: process.env.USERNAME,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.POSTGRESQL_PORT,
  });

  await client.connect();

  //Updating information in DB table for Provider Profile
  var text =
    //"INSERT INTO provider_help_form_table( provider_user_name, provider_organization_name, provider_email, provider_message) VALUES($1, $2, $3, $4)";
    "INSERT INTO provider_help_form_table(user_id, provider_name, provider_message, created_at) VALUES($1, $2, $3, $4)";

  var values = [
    data.user_id,
    data.provider_name ? data.provider_name : data.data.provider_name,
    //data.data.provider_email,
    data.data.provider_message,
    timestamp,
  ];

  //This is for encryption in production ONLY, don't be confused by 'dev' on the next line, this is actually production
  // if (process.env.NODE_ENV === 'production') {
  // 	console.log("PRODUCTION TRUE")
  // 	const generatorKeyId = process.env.GENERATOR_KEY;
  // 	const keyIds = [process.env.ENCRYPTION_KEY];
  // 	/* Create the KMS keyring */
  // 	const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })
  // 	const context = {
  // 		stage: 'dev', //actually prod
  // 		purpose: 'ReferAll Production Encryption',
  // 		origin: 'us-east-2'
  // 	}

  // 	//var encryptedValues = async () => {
  // 		let valuesArray = await Promise.all(
  // 			values.map((item) => {
  // 				const result = encrypt(keyring, item, {
  // 					encryptionContext: context,
  // 				})
  // 				return result;
  // 			})
  // 		)
  // 		console.log(valuesArray)
  // 		//return valuesArray;
  // 	//}

  // 	// var encryptedValues = values.map(async (item) => {
  // 	// 	const { result } = await encrypt(keyring, item, {
  // 	// 		encryptionContext: context,
  // 	// 	})
  // 	// 	return result;
  // 	// })

  // 	let addHelpform = await client.query(text, valuesArray);
  // 	console.log(addHelpform);
  // } else {
  // 	let addHelpform = await client.query(text, values);
  // 	console.log(addHelpform);
  // }
  let addHelpform = await client.query(text, values);
  console.log(addHelpform);

  let email = "resourcefull@anniecannons.com";
  let emailParams = {
    Source: myEmail,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html><body><p>Provider Help Form from ${
            data.data.provider_name
              ? data.data.provider_name
              : data.provider_name
          }:</p> 
          <ul>
          <li>Organization: ${
            data.data.provider_name
              ? data.data.provider_name
              : data.provider_name
          }</li>
		      <li>Email: ${data.data.email ? data.data.email : data.email}</li>
          <li>Message: ${data.data.provider_message}</li>
          <li>Form Submitted: ${timestamp}</li>
          <p>Sincerely, the ResourceFull Team</p></body></html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Provider Help Form Submitted`,
      },
    },
  };
  ses.sendEmail(emailParams, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: "Success",
  };
  callback(null, response);

  await client.end();
  return "success";
}
