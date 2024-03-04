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

  // Update on survivor app table
  var textSurvivorUpdate =
    "UPDATE participant_survivor_connection SET participant_status = $1 WHERE participant_id = $2 AND provider= $3";

  var valuesSurvivorUpdate = [
    data.participant_status,
    data.participant_id,
    data.provider,
  ];
  var updateSurvivorApp = await client.query(
    textSurvivorUpdate,
    valuesSurvivorUpdate
  );
  console.log(updateSurvivorApp);

  // Update provider participant table, this is to keep track of all submitted intakes for the provider
  var text =
    "UPDATE provider_participant_table SET participant_status = $1 WHERE participant_id = $2 AND provider= $3";

  var values = [data.participant_status, data.participant_id, data.provider];
  var addProviderPeopleNotes = await client.query(text, values);
  console.log(addProviderPeopleNotes);

  // Update the pariticpant_status_notification, aka red dots to alert the user that there is an update, based on the change in status, initiated by the provider
  var textTwo =
    "UPDATE provider_participant_table SET participant_status_notification = true WHERE participant_id = $1 ";

  var valuesTwo = [data.participant_id];
  var addProviderPeopleNotification = await client.query(textTwo, valuesTwo);
  console.log(addProviderPeopleNotification);

  // Update the pariticpant_status_notification, aka red dots to alert the survivor that there is an update, based on the change in status, initiated by the provider
  var textTwo =
    "UPDATE participant_survivor_connection SET participant_status_notification = true WHERE participant_id = $1 ";

  var valuesTwo = [data.participant_id];
  var addProviderPeopleNotification = await client.query(textTwo, valuesTwo);
  console.log(addProviderPeopleNotification);

  //Adding the new status to the intake form, this will allow for sorting between the getClients and getIntakes for the provider side
  var textThree =
    "UPDATE provider_participant_intake SET participant_status = $1 WHERE participant_id = $2 AND provider = $3";

  var valuesThree = [
    data.participant_status,
    data.participant_id,
    data.provider,
  ];
  var addNewStatusIntake = await client.query(textThree, valuesThree);
  console.log(addNewStatusIntake);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: "success",
  };
  callback(null, response);

  await client.end();
  return "success";
}
