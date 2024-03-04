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

  // Get users who are connected to a provider who have status of Active

  var textUsers = `SELECT * FROM provider_participant_intake 
			WHERE provider = $1 AND participant_status = 'Active: Receiving Services Now'`;

  var valueUsers = [data.provider];

  var getProviderUsers = await client.query(textUsers, valueUsers);
  console.log(getProviderUsers.rows);

  // var filterArray = getProviderUsers.rows.filter(
  // 	(item) => item.participant_status === "Active: Receiving Services Now"
  // );

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(getProviderUsers.rows),
  };
  callback(null, response);

  await client.end();
  return "success";
}
