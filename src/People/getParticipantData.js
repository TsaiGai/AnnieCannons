const { Client } = require("pg");

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

  await client.connect();

  var text = "SELECT * FROM provider_participant_table WHERE provider = $1";

  var value = [data.provider];

  var getParticipantData = await client.query(text, value);
  console.log(getParticipantData);

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
}
