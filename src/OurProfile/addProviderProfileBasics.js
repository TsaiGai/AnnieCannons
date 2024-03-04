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
    "UPDATE provider_org_table SET updatedAt = $1, provider_start_hours = $2, provider_close_hours = $3, provider_phone = $4, provider_hotline = $5, provider_address1 = $6, provider_address2 = $7, provider_address3 = $8, provider_website = $9, provider_instagram = $10, provider_facebook = $11, provider_ages_served = $12,provider_services_offered = $13, provider_genders_served = $14, provider_other_characteristics = $15, provider_county = $16, avatar_colors=$17 WHERE provider_name = $18";

  var values = [
    timestamp,
    data.profileData.provider_start_hours,
    data.profileData.provider_close_hours,
    data.profileData.provider_phone,
    data.profileData.provider_hotline,
    data.profileData.provider_address1,
    data.profileData.provider_address2,
    data.profileData.provider_address3,
    data.profileData.provider_website,
    data.profileData.provider_instagram,
    data.profileData.provider_facebook,
    data.profileData.provider_ages_served,
    data.profileData.provider_services_offered,
    data.profileData.provider_genders_served,
    data.profileData.provider_other_characteristics,
    data.profileData.provider_county,
    data.avatar_colors,
    data.provider_name,
  ];

  var addProviderData = await client.query(text, values);
  console.log(addProviderData);

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
