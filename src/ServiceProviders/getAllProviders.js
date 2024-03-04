const { Client } = require("pg");

//const Cryptr = require('cryptr');
//const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

// import {
// 	KmsKeyringNode,
// 	buildClient,
// 	CommitmentPolicy,
//   } from '@aws-crypto/client-node'

// const { encrypt, decrypt } = buildClient(
// 	CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
// )


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

	var text = "SELECT * FROM provider_org_table";
	var getAllProviders = await client.query(text);
	console.log(getAllProviders);


	//const decryptedString = cryptr.decrypt(getAllProviders.rows);
	//console.log(decryptedString);

	//var dataArray;

	//This is for encryption in production ONLY, don't be confused by 'dev' on the next line, this is actually production
	// if (process.env.NODE_ENV === 'production') {
	// 	console.log("PRODUCTION TRUE")
	// 	const generatorKeyId = process.env.GENERATOR_KEY;
	// 	const keyIds = [process.env.ENCRYPTION_KEY];
	// 	/* Create the KMS keyring */
	// 	const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })
	// 	const context = {
	// 		stage: 'dev', //actually prod
	// 		purpose: 'ReferAll Production Encryption',
	// 		origin: 'us-east-2'
	// 	}
		
	// 	dataArray = getAllProviders.rows.map(async (item) => {
	// 		for (var key in item){
	// 			/* Decrypt each item in the object */
	// 			const { plaintext, messageHeader } = await decrypt(keyring, item[key].result)
	// 			console.log(plaintext)
	// 			item[key] = plaintext;
	// 		}
	// 	})

	// 	//TODO: We were able to get encryption working in the Help Form and Add Provider, we have not been able to get decryption to work on getAllProviders, next steps: delete all clear text providers from table and test with just encrypted strings. Then work on matching user ids for the getproviderOrg
		

	// 	console.log(dataArray);

	// } else {
	// 	dataArray = getAllProviders.rows;
	// }

	const response = {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		//body: JSON.stringify(dataArray),
		body: JSON.stringify(getAllProviders.rows),
	};
	callback(null, response);

	await client.end();
	return "success";
}
