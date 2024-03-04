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

  var responseText;
  // *************************************************PARTICIPANT SEARCH***********************************************************
  if (data.newSearchObj.participant_id) {
    // check search_name on provider_participant_saved_searches
    var checkParticipantSearch =
      "SELECT * FROM provider_participant_saved_searches WHERE search_name = $1 AND participant_id = $2";
    var checkSearchParticipantValues = [
      data.newSearchObj.search_name,
      data.newSearchObj.participant_id,
    ];
    var queryParticipantSearch = await client.query(
      checkParticipantSearch,
      checkSearchParticipantValues
    );
    if (queryParticipantSearch.rows.length > 0) {
      responseText = "The Name Search already exists.";
    } else if (data.newSearchObj.isEditing) {
      // var findSearchId =
      //   "SELECT * FROM provider_participant_saved_searches WHERE search_id = $1";
      // var findSearchIdValue = [data.newSearchObj.search_id];
      // var findSearchIdRow = await client.query(findSearchId, findSearchIdValue);
      // console.log(findSearchIdRow);

      // once we have the correct row, then comment out the above code and replace with update
      var editSearchId =
        "UPDATE provider_participant_saved_searches SET search_name = $1, search_filter_configuration = $2 WHERE search_id = $3";
      var editSearchIdValues = [
        data.newSearchObj.search_name,
        data.newSearchObj.search_filter_configuration,
        data.newSearchObj.search_id,
      ];
      var editSearchIdRow = await client.query(
        editSearchId,
        editSearchIdValues
      );
      console.log(editSearchIdRow);

      // update value of isEditing; should object be returned as false?
      data.newSearchObj.isEditing = false;
    } else {
      //Add Search To Database
      var text =
        //TODO: Update syntax for Insert query
        "INSERT INTO provider_participant_saved_searches(search_date, search_id, participant_id, search_name, search_filter_configuration, provider_email, provider) VALUES($1, $2, $3, $4, $5, $6, $7)";

      //TODO: Check data coming from frontend
      var values = [
        timestamp,
        data.newSearchObj.search_id,
        data.newSearchObj.participant_id,
        data.newSearchObj.search_name,
        data.newSearchObj.search_filter_configuration,
        data.provider_email,
        data.provider,
      ];

      var addProviderSearch = await client.query(text, values);
      console.log(addProviderSearch);
    }
    // *************************************************PROVIDER SAVED SEARCH***********************************************************
  } else {
    // check search_name on provider_saved_searches
    var checkSearch =
      "SELECT * FROM provider_saved_searches WHERE search_name = $1 AND provider = $2";
    var checkSearchValues = [
      data.newSearchObj.search_name,
      // data.provider_email,
      data.provider,
    ]; // TODO: Add provider value
    var queryProviderSearch = await client.query(
      checkSearch,
      checkSearchValues
    );

    //TODO: Add if/else to check if search_name exists for that provider, if not insert a new row into the provider_search table
    if (queryProviderSearch.rows.length > 0) {
      responseText = "The Name Search already exists.";
      // must add else if statement to handle edit of title and/or search configurations
      // have front end send key of "isEditing" with value being true
      // if true, then replace title and/or search configurations
      // ensure that data.isEditing turns back to false

    } else if (data.newSearchObj.isEditing) {
      // var findSearchId =
      //   "SELECT * FROM provider_saved_searches WHERE search_id = $1";
      // var findSearchIdValue = [data.newSearchObj.search_id];
      // var findSearchIdRow = await client.query(findSearchId, findSearchIdValue);
      // console.log(findSearchIdRow);

      // once we have the correct row, then comment out the above code and replace with update
      var editSearchId =
        "UPDATE provider_saved_searches SET search_name = $1, search_filter_configuration = $2 WHERE search_id = $3";
      var editSearchIdValues = [
        data.newSearchObj.search_name,
        data.newSearchObj.search_filter_configuration,
        data.newSearchObj.search_id,
      ];
      var editSearchIdRow = await client.query(
        editSearchId,
        editSearchIdValues
      );
      console.log(editSearchIdRow);

      // update value of isEditing; should object be returned as false?
      data.newSearchObj.isEditing = false;

    } else {
      //Add Search To Database
      var text =
        //TODO: Update syntax for Insert query
        "INSERT INTO provider_saved_searches (search_date, search_id, search_name, search_filter_configuration, provider) VALUES ($1, $2, $3, $4, $5)";

      // INSERT INTO provider_saved_searches (search_date=$1, search_name = $2, search_filter_configuration= $3)
      // SELECT *
      // FROM provider_saved_searches
      // WHERE provider_email=$4;

      //TODO: Check data coming from frontend
      var values = [
        timestamp,
        data.newSearchObj.search_id,
        data.newSearchObj.search_name,
        data.newSearchObj.search_filter_configuration,
        data.provider,
      ];

      // ALTER TABLE provider_saved_searches
      // ADD COLUMN provider_email VARCHAR,
      // ADD COLUMN search_name VARCHAR,
      // ADD COLUMN search_date TIMESTAMP,
      // ADD COLUMN search_filter_configuration VARCHAR[],

      var addProviderSearch = await client.query(text, values);
      console.log(addProviderSearch);
    }
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(responseText),
  };
  callback(null, response);

  await client.end();
  return "success";
}
