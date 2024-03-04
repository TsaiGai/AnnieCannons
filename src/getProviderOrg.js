const { Client } = require("pg");
// import {
//   KmsKeyringNode,
//   buildClient,
//   CommitmentPolicy,
// } from "@aws-crypto/client-node";

// const { encrypt, decrypt } = buildClient(
//   CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
// );

export async function handler(event, context, callback) {
  var data = JSON.parse(event.body);
  const timestamp = new Date();
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

  var getProviders = "SELECT * FROM provider_org_table WHERE created_by = $1";

  let addProvidersQuery;
  // if (process.env.NODE_ENV === "production") {
  //   const generatorKeyId = process.env.GENERATOR_KEY;
  //   const keyIds = [process.env.ENCRYPTION_KEY];
  //   /* Create the KMS keyring */
  //   const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });
  //   const context = {
  //     stage: "dev", //actually prod
  //     purpose: "ReferAll Production Encryption",
  //     origin: "us-east-2",
  //   };
  //   const encryptedUserId = await encrypt(keyring, data.user_id, {
  //     encryptionContext: context,
  //   });
  //   let getProvidersValue = [encryptedUserId];
  //   addProvidersQuery = await client.query(getProviders, getProvidersValue);
  // } else {
  let getProvidersValue = [data.user_id];
  addProvidersQuery = await client.query(getProviders, getProvidersValue);
  // }

  // Getting the updated list of providers to send to the FE
  var dataArray;

  //This is for decryption in production ONLY, don't be confused by 'dev' on the next line, this is actually production
  // if (process.env.NODE_ENV === "production") {
  //   console.log("PRODUCTION TRUE");
  //   const generatorKeyId = process.env.GENERATOR_KEY;
  //   const keyIds = [process.env.ENCRYPTION_KEY];
  //   /* Create the KMS keyring */
  //   const keyring = new KmsKeyringNode({ generatorKeyId, keyIds });
  //   const context = {
  //     stage: "dev", //actually prod
  //     purpose: "ReferAll Production Encryption",
  //     origin: "us-east-2",
  //   };
  //   dataArray = addProvidersQuery.rows.map(async (item) => {
  //     for (var key in item) {
  //       /* Decrypt each item in the object */
  //       const { plaintext, messageHeader } = await decrypt(keyring, item[key]);
  //       console.log(plaintext);
  //       item[key] = plaintext;
  //     }
  //   });
  //   console.log(dataArray);
  // } else {
  dataArray = addProvidersQuery.rows;
  // }

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
}
