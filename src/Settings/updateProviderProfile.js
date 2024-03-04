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

  if (data.request === "delete") {
    //Updating information in DB table for Provider Profile
    var text =
      "UPDATE provider_org_table SET updatedat = $1, deleted_date = $1, deleted_reason = $2, deleted_other = $3, is_visible = $4 WHERE provider_name = $5";

    var values = [
      timestamp,
      data.deleted_reason,
      data.deleted_other,
      false,
      data.provider,
    ];

    var isProfileRemovedQuery = await client.query(text, values);
    console.log(isProfileRemovedQuery);

    //Updating information in DB table for participant_survivor_connection
    var statusCardHideText =
      "UPDATE participant_survivor_connection SET provider_is_visible = $1 WHERE provider = $2";

    var statusCardHideValue = [false, data.provider];
    var isProviderHiddenQuery = await client.query(
      statusCardHideText,
      statusCardHideValue
    );
    console.log(isProviderHiddenQuery);
  } else {
    //Updating visibility in DB table for Provider Profile
    var visibilityText =
      "UPDATE provider_org_table SET updatedat = $1, reinstated_date = $1, is_visible = $2 WHERE provider_name = $3";

    var visibilityValues = [timestamp, true, data.provider];

    var isProfileVisibleQuery = await client.query(
      visibilityText,
      visibilityValues
    );
    console.log(isProfileVisibleQuery);

    //Updating information in DB table for participant_survivor_connection
    var statusCardShowText =
      "UPDATE participant_survivor_connection SET provider_is_visible = $1 WHERE provider = $2";

    var statusCardShowValue = [true, data.provider];
    var statusVisibleQuery = await client.query(
      statusCardShowText,
      statusCardShowValue
    );
    console.log(statusVisibleQuery);
  }
  var checkVisibilityText =
    "SELECT is_visible FROM provider_org_table WHERE provider_name = $1";
  var checkVisibilityValue = [data.provider];

  var checkVisibilityQuery = await client.query(
    checkVisibilityText,
    checkVisibilityValue
  );
  console.log("is_visible", checkVisibilityQuery.rows[0].is_visible);

  var checkStatusText =
    "SELECT provider_is_visible FROM participant_survivor_connection WHERE provider = $1";
  var checkStatusValue = [data.provider];

  var checkStatusQuery = await client.query(checkStatusText, checkStatusValue);
  console.log(
    "provider_is_visible",
    checkStatusQuery.rows[0].provider_is_visible
  );

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: checkVisibilityQuery.rows[0].is_visible ? true : false,
  };
  callback(null, response);

  await client.end();
  return "success";
}
