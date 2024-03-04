const { Client } = require("pg");

export async function handler(event, context, callback) {
	var data = JSON.parse(event.body);

	console.log(data);
	//The data from the frontend needs to include the name of the provider, for example "AnnieCannons"

	//Connect to PostgresDB
	const client = new Client({
		user: process.env.USERNAME,
		host: process.env.POSTGRESQL_HOST,
		database: process.env.DB_NAME,
		password: process.env.PASSWORD,
		port: process.env.POSTGRESQL_PORT,
	});

	await client.connect();

	//Write a SQL query that calls the provider_org_table to get the list of variables that are associated with the provider, both the required_variables_general and the required_variables_intake

	//SELECT for required_variables_general
	var textGeneralVariables =
		"SELECT required_variables_general FROM provider_org_table WHERE provider_name= $1";
	var valueGeneralVariables = [data.provider_name];

	var getProviderGeneralVariables = await client.query(
		textGeneralVariables,
		valueGeneralVariables
	);
	console.log(getProviderGeneralVariables.rows);

	var providerGeneralVariables = getProviderGeneralVariables.rows;

	//SELECT for required_variables_intake
	var textIntakeVariables =
		"SELECT required_variables_intake FROM provider_org_table WHERE provider_name= $1";

	var valueIntakeVariables = [data.provider_name];

	var getProviderIntakeVariables = await client.query(
		textIntakeVariables,
		valueIntakeVariables
	);
	console.log(getProviderIntakeVariables.rows);
	var providerIntakeVariables = getProviderIntakeVariables.rows;

	// Get all of the people in the provider_participant_table that have a provider value equal to the one tied to the user, for example, find all the rows in the provider_participant_table that have "AnnieCannons" as the value of the provider
	//SELECT for provider_participant_table
	var textParticipants =
		"SELECT * FROM provider_participant_table WHERE provider=$1";
	var valueParticipants = [data.provider];
	var getParticipants = await client.query(textParticipants, valueParticipants);
	console.log(getParticipants);
	var participantArray = getParticipants.rows;
	console.log(participantArray);
	var peopleArr = [];
	// console.log(participantArray[i].participant_id);

	//For each participant, call the survivor_intake_form and the survivor_general_form tables to get the values authorized for that provider. For example, if AnnieCannons had ["survivorship"] as the only value in the required_variables_general, query for that column for each participant in the survivor_general_form
	//Create a for loop or a map to go through each participant

	for (let i = 0; i < participantArray.length; i++) {
		// Based on the participant_id, select general variables for each participant
		let textParticipantGeneralVariables = `SELECT ${providerGeneralVariables[0].required_variables_general.join(
			", "
		)} FROM survivor_general_form WHERE participant_id = ${
			participantArray[i].participant_id
		} `;
		console.log(participantArray[i].participant_id);
		// var valueParticipantGeneralVariables = [data.participant_id];
		// TODO: Add query

		var participantGeneralVariables = await client.query(
			textParticipantGeneralVariables
		);

		if (participantGeneralVariables.rows.length === 0) {
			return (participantArray[i].general = {
				participant_id: "",
				preferred_name: "",
				date_of_birth: "",
				survivorship: "",
				county_services: "",
				county_location: "",
				phone: "",
				email: "",
				general_form_completed: "",
				created_at: "",
				providers: "",
				last_name: "",
			});
		}

		let textParticipantIntakeVariables = `SELECT ${providerIntakeVariables[0].required_variables_intake.join(
			", "
		)} FROM survivor_intake_form WHERE participant_id = ${
			participantArray[i].participant_id
		}`;
		var participantIntakeVariables = await client.query(
			textParticipantIntakeVariables
		);
		console.log(participantIntakeVariables);
		// Add the results to the participant object
		participantArray[i].general = participantGeneralVariables.rows;
		participantArray[i].intake = participantIntakeVariables.rows;
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
