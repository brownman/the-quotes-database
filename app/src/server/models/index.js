const { esclient, index, type } = require("../../elastic");

async function getLyrics(req) {
  const arr = req.lyrics.split(' ');
  if (arr.length !=2)
      return null;

  const query = {
 
      "query": {
        "span_near": {
          "clauses": [
            {
              "span_multi": {
                "match": {
                  "fuzzy": {
                    "lyrics": {
                      "fuzziness": "1",
                      "value": arr[0]
                    }
                  }
                }
              }
            },
            {
              "span_multi": {
                "match": {
                  "fuzzy": {
                    "lyrics": {
                      "fuzziness": "1",
                      "value": arr[1]
                    }
                  }
                }
              }
            }
          ],
          "slop": 1,
          "in_order": "true"
        }
      }
    
  }

  const { body: { hits } } = await esclient.search({
    from:  req.page  || 0,
    size:  req.limit || 100,
    index: index, 
    type:  type,
    body:  query
  });

  const results = hits.total.value;
  const values  = hits.hits.map((hit) => {
    return {
      id:     hit._id,
      lyrics:  hit._source.lyrics,
      artist: hit._source.artist,
      title: hit._source.title,
      score:  hit._score
    }
  });

  return {
    results,
    values
  }

}

async function insertNewLyrics(lyrics, artist, title) {
  return esclient.index({
    index,
    type,
    body: {
      lyrics,
      artist,
      title
    }
  })
}

module.exports = {
  getLyrics,
  insertNewLyrics
}