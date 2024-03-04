const { Client } = require("pg");

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

  // To add a new provider in database, run the following SQL query: INSERT INTO provider_org_table (createdAt, provider_name, provider_id) VALUES('2021-03-16', 'AnnieCannons' , '1')

  //Updating information in DB table for Provider Profile
  var text =
    "UPDATE provider_org_table SET updatedAt = $1, provider_nonpublic_info = $2   WHERE provider_name= $3";

  var values = [
    timestamp,
    data.profileData.provider_nonpublic_info,
    data.provider_name,
  ];

  var addProviderNonpublic = await client.query(text, values);
  console.log(addProviderNonpublic);

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
