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

  var textParticipants =
    "SELECT participant_id FROM provider_participant_table WHERE provider=$1";
  var valueParticipants = [data.provider];
  var getParticipants = await client.query(textParticipants, valueParticipants);
  console.log(getParticipants);
  var participantArray = getParticipants.rows;
  console.log(participantArray);

  for (let i = 0; i < participantArray.length; i++) {
    // Based on the participant_id, select general variables for each participant
    let textParticipantGeneralVariables = `SELECT preferred_name, participant_id FROM survivor_general_form WHERE participant_id = ${participantArray[i].participant_id}`;
    console.log(participantArray[i].participant_id);
    // var valueParticipantGeneralVariables = [data.participant_id];
    // TODO: Add query
    var participantGeneralVariables = await client.query(
      textParticipantGeneralVariables
    );
    // console.log(participantGeneralVariables);
    // TODO: Select intake variables for each participant
    // TODO: Add query

    // Add the results to the participant object
    participantArray[i].participant_data = participantGeneralVariables.rows;
  }
  console.log(participantArray);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(participantArray),
  };
  callback(null, response);

  await client.end();
  return "success";
}
