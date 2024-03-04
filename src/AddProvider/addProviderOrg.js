const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();
const { Client } = require("pg");
// import {
// 	KmsKeyringNode,
// 	buildClient,
// 	CommitmentPolicy,
//   } from '@aws-crypto/client-node'

//const { encrypt, decrypt } = buildClient(
//	CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
//)

const getUserAttributes = async (params) => {
  let cognitoUser;
  try {
    cognitoUser = await cognito.adminCreateUser(params).promise();
    console.log("cognitoUser", cognitoUser);
    console.log(cognitoUser.User.Attributes); // {Name: 'sub', Value: ''},{ Name: "email_verified", Value: true },{Name: 'email', Value: ''}
  } catch (error) {
    console.log("get attributes error", error);
  }
  return cognitoUser;
};

export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);
  const timestamp = new Date().toISOString();
  console.log("data", data);

  //Connect to PostgresDB
  const client = new Client({
    user: process.env.USERNAME,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.POSTGRESQL_PORT,
  });

  await client.connect();

  // Check if provider has already been added
  // If they exist, update the value
  // Else, add a new provider

  var newProviderCheck =
    "SELECT * FROM provider_org_table WHERE created_by = $1 AND provider_id = $2";

  var newProviderCheckValue = [data.user_id, data.data.provider_id];
  var newProviderCheckQuery = await client.query(
    newProviderCheck,
    newProviderCheckValue
  );
  console.log("newProviderCheckQuery", newProviderCheckQuery);
  // check if addProviderOrg is connected to the Save button. once get to lambda, is it updating properly.
  if (newProviderCheckQuery.rows.length > 0) {
    let text =
      "UPDATE provider_org_table SET provider_name = $1, provider_start_hours = $2, provider_close_hours = $3, provider_phone = $4, provider_hotline = $5, provider_website = $6, provider_instagram = $7, provider_facebook = $8, org_for_who = $9, org_our_services = $10, org_we_are = $11,required_variables_intake = $12, required_variables_general = $13, provider_ages_served = $14, provider_services_offered = $15, provider_genders_served = $16, provider_other_characteristics = $17, provider_county = $18, provider_address1 = $19, provider_address2 = $20, provider_address3 = $21, email_help = $22, email_intake_notify = $23, activity_level = $24, updatedat = $25, avatar_colors= $26 WHERE created_by = $27 AND provider_id = $28";

    let values = [
      data.data.provider_name,
      data.data.provider_start_hours,
      data.data.provider_close_hours,
      data.data.provider_phone,
      data.data.provider_hotline,
      data.data.provider_website,
      data.data.provider_instagram,
      data.data.provider_facebook,
      data.data.org_for_who,
      data.data.org_our_services,
      data.data.org_we_are,
      data.data.required_variables_intake,
      data.data.required_variables_general,
      data.data.provider_ages_served,
      data.data.provider_services_offered,
      data.data.provider_genders_served,
      data.data.provider_other_characteristics,
      data.data.provider_county,
      data.data.provider_address1,
      data.data.provider_address2,
      data.data.provider_address3,
      data.data.email_help,
      data.data.email_intake_notify,
      data.data.activity_level,
      timestamp,
      data.data.avatar_colors,
      data.user_id,
      data.data.provider_id,
    ];
    var updateProvider = await client.query(text, values);
    console.log("updateProvider", updateProvider);

    let getProviders = "SELECT * FROM provider_org_table WHERE created_by = $1";

    let getProvidersValue = [data.user_id];
    let addProvidersQuery = await client.query(getProviders, getProvidersValue);
    console.log("addProvidersQuery.rows", addProvidersQuery.rows);

    // let getRole = "";

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(addProvidersQuery.rows),
    };
    callback(null, response);

    await client.end();
    return "success";
  } else {
    console.log("else statement");
    let randomstring = "Ac12!" + Math.random().toString(36).slice(-8);
    const params = {
      UserPoolId: process.env.USER_POOL,
      Username: data.data.email && data.data.email.toLowerCase(),
      TemporaryPassword: randomstring,
      UserAttributes: [
        {
          Name: "email",
          Value: `${data.data.email && data.data.email.toLowerCase()}`,
        },
        { Name: "email_verified", Value: "true" },
      ],
    };
    console.log("params", params);
    //1. login to try various lambdas over a course of 2-3 days. if work, stop here. if not, 2.
    //2. move resources to us west 2, limit token in cognito to 24 hours,
    // use try catch and log to see what the error is.
    // let cognitoAdmin;
    // try {
    //   cognitoAdmin = await cognito.adminCreateUser(params).promise();
    //   console.log("cognitoAdmin", cognitoAdmin);
    //   console.log(cognitoAdmin.User.Attributes); // {Name: 'sub', Value: ''},{ Name: "email_verified", Value: true },{Name: 'email', Value: ''}
    // } catch (error) {
    //   console.log("error", error);
    // } finally {
    let cognitoAdmin;
    try {
      cognitoAdmin = await getUserAttributes(params);
      console.log("cognitoAdmin", cognitoAdmin);
    } catch (error) {
      console.log(error, error.stack);
      if (error) {
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: "An error occurred. Please try again",
        };
        callback(null, response);

        await client.end();
        return "error";
      }
    } finally {
      var newProviderCheck = `SELECT * FROM provider_user_table WHERE user_id = '${cognitoAdmin.User.Username}'`;

      var newProviderCheckQuery = await client.query(newProviderCheck);
      console.log("newProviderCheckQuery", newProviderCheckQuery);

      if (newProviderCheckQuery.rows.length >= 1) {
        console.log("userAlreadyExists");
      } else {
        let textNew =
          "INSERT INTO provider_user_table (user_id, provider, role, createdAt, updatedAt) VALUES($1,$2,$3,$4,$4)";
        // "INSERT INTO provider_user_table (user_id, provider, role, first_time_login) VALUES($1,$2,$3,$4)";

        let valuesNew = [
          cognitoAdmin.User.Username,
          data.data.provider_name,
          data.data.role,
          timestamp,
          // true,
        ];
        let newUser = await client.query(textNew, valuesNew);
        console.log("newUser", newUser);
      }
      let text =
        "INSERT INTO provider_org_table(updatedat, provider_name, provider_start_hours, provider_close_hours, provider_phone, provider_hotline, provider_website, provider_instagram, provider_facebook, org_for_who, org_our_services, org_we_are,required_variables_intake, required_variables_general, provider_ages_served, provider_services_offered, provider_genders_served, provider_other_characteristics, provider_county, provider_address1, provider_address2, provider_address3, email_help, email_intake_notify, activity_level, avatar_colors, created_by, is_visible) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)";

      let values = [
        timestamp,
        data.data.provider_name,
        data.data.provider_start_hours,
        data.data.provider_close_hours,
        data.data.provider_phone,
        data.data.provider_hotline,
        data.data.provider_website,
        data.data.provider_instagram,
        data.data.provider_facebook,
        data.data.org_for_who,
        data.data.org_our_services,
        data.data.org_we_are,
        data.data.required_variables_intake,
        data.data.required_variables_general,
        data.data.provider_ages_served,
        data.data.provider_services_offered,
        data.data.provider_genders_served,
        data.data.provider_other_characteristics,
        data.data.provider_county,
        data.data.provider_address1,
        data.data.provider_address2,
        data.data.provider_address3,
        data.data.email_help,
        data.data.email.toLowerCase(),
        data.data.activity_level,
        // data.data.role,
        data.data.avatar_colors,
        data.user_id,
        true,
      ];

      //This is for encryption in production ONLY, don't be confused by 'dev' on the next line, this is actually production
      // if (process.env.NODE_ENV === 'production') {
      //  console.log("PRODUCTION TRUE")
      //  const generatorKeyId = process.env.GENERATOR_KEY;
      //  const keyIds = [process.env.ENCRYPTION_KEY];
      //  /* Create the KMS keyring */
      //  const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })
      //  const context = {
      //    stage: 'dev', //actually prod
      //   purpose: 'ReferAll Production Encryption',
      //   origin: 'us-east-2'
      // }

      //   let valuesArray = await Promise.all(
      //    values.map((item) => {
      //     if (Array.isArray(item)){
      //      console.log("ARRAY")
      //     var newArray = item.map( (string) => {
      //      const result = encrypt(keyring, string, {
      //       encryptionContext: context,
      //    })
      //   console.log(result)
      //  return result;
      // })
      // return newArray;
      // } else {
      //  const result = encrypt(keyring, item, {
      //   encryptionContext: context,
      // })
      // return result;
      // }
      // })
      // )
      // console.log(valuesArray)

      // var encryptedValues = values.map(async (item) => {
      //   if (Array.isArray(item)){
      //     console.log("ARRAY")
      //     var newArray = item.map( async (string) => {
      //       const result = await encrypt(keyring, string, {
      //         encryptionContext: context,
      //       })
      //       console.log(result)
      //       return result;
      //     })
      //     return newArray;
      //   } else {
      //     console.log("STRING")
      //     const result = await encrypt(keyring, item, {
      //       encryptionContext: context,
      //     })
      //     console.log(result)

      //     return result;
      //   }
      // })
      // console.log(encryptedValues)

      //    let addProvider = await client.query(text, valuesArray);
      //    console.log(addProvider);

      //     } else {
      let addProvider = await client.query(text, values);
      console.log("addProvider", addProvider);
      //   }

      //Once database has been updated with new provider, get the full and complete list of providers to send back to the frontend.

      let getProviders =
        "SELECT * FROM provider_org_table WHERE created_by = $1";

      let addProvidersQuery;
      //     if (process.env.NODE_ENV === 'production') {
      //       const generatorKeyId = process.env.GENERATOR_KEY;
      //       const keyIds = [process.env.ENCRYPTION_KEY];
      //       /* Create the KMS keyring */
      //       const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })
      //       const context = {
      //         stage: 'dev', //actually prod
      //         purpose: 'ReferAll Production Encryption',
      //         origin: 'us-east-2'
      //       }
      //       const encryptedUserId = await encrypt(keyring, data.user_id, {
      //         encryptionContext: context,
      //       })
      //       let getProvidersValue = [encryptedUserId];
      //       addProvidersQuery = await client.query(getProviders, getProvidersValue);
      //     } else {
      let getProvidersValue = [data.user_id];
      addProvidersQuery = await client.query(getProviders, getProvidersValue);
      console.log("addProvidersQuery", addProvidersQuery);
      //     }

      // Getting the updated list of providers to send to the FE
      var dataArray;

      //This is for encryption in production ONLY, don't be confused by 'dev' on the next line, this is actually production
      //     if (process.env.NODE_ENV === 'production') {
      //       console.log("PRODUCTION TRUE")
      //       const generatorKeyId = process.env.GENERATOR_KEY;
      //      const keyIds = [process.env.ENCRYPTION_KEY];
      //       /* Create the KMS keyring */
      //       const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })
      //       const context = {
      //         stage: 'dev', //actually prod
      //         purpose: 'ReferAll Production Encryption',
      //         origin: 'us-east-2'
      //       }
      //
      //       dataArray = addProvidersQuery.rows.map(async (item) => {
      //        for (var key in item){
      //           /* Decrypt each item in the object */
      //           const { plaintext, messageHeader } = await decrypt(keyring, item[key])
      //           console.log(plaintext)
      //           item[key] = plaintext;
      //         }
      //       })

      //       console.log(dataArray);

      //     } else {
      dataArray = addProvidersQuery.rows;
      console.log("dataArray", dataArray);
      //     }

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(dataArray),
      };
      callback(null, response);

      await client.end();
      return "success";
      // } catch (error) {
      //   console.log(error, error.stack);
      // }
    }
  }
}
