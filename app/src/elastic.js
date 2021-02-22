const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const esclient = new Client({ node: elasticUrl });
const index = "lyrics";
const type = "lyrics";

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

async function createIndex(index) {
  try {
    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);
  }
}

async function deleteIndex(index) {
  try {
    await esclient.indices.delete({ index });
    console.log(`Deleted index ${index}`);
  } catch (err) {
    console.error(`An error occurred while deleting the index ${index}:`);
    console.error(err);
  }
}

/**
 * @function setLyricsMapping,
 * @returns {void}
 * @description Sets the lyrics mapping to the database.
 */

async function setLyricsMapping() {
  try {
    const schema = {
      lyrics: {
        type: "text",
      },
      artist: {
        type: "text",
      },
      title: {
        type: "text",
      },
    };

    await esclient.indices.putMapping({
      index,
      type,
      include_type_name: true,
      body: {
        properties: schema,
      },
    });

    console.log("Lyrics mapping created successfully");
  } catch (err) {
    console.error("An error occurred while setting the lyrics mapping:");
    console.error(err);
  }
}

/**
 * @function checkConnection
 * @returns {Promise<Boolean>}
 * @description Checks if the client is connected to ElasticSearch
 */

function checkConnection() {
  let counter = 0;
  return new Promise((resolve, reject) => {
    console.log("Checking connection to ElasticSearch...");

    async function recursive_timeout() {
      try {
        //resolve if elastic comes alive, else - run the recursion again
        await esclient.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        resolve(true);
      } catch (err) {
        counter += 1;
        console.log("try connecting to ElasticSearch: " + counter);
        setTimeout(recursive_timeout, 3000);
      }
    }

    recursive_timeout();
  });
}

module.exports = {
  esclient,
  setLyricsMapping,
  checkConnection,
  createIndex,
  deleteIndex,
  index,
  type,
};
