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

  //Updating information in DB table for Provider Profile
  // email is no longer a column in provider_user_table; use user_id instead
  var text = "UPDATE provider_user_table SET updatedAt = $1 WHERE email= $2";

  var values = [timestamp, data.email];

  var addProviderSearch = await client.query(text, values);
  console.log(addProviderSearch);

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
