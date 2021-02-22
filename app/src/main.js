const elastic = require("./elastic");
const server = require("./server");
const data = require("./data");
require("dotenv").config();

(async function main() {
  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {
    const elasticIndex = await elastic.esclient.indices.exists({
      index: elastic.index,
    });
    console.log({ elasticIndex });
    server.start();
  }
})();
