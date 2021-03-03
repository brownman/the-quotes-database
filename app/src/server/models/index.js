const { esclient, index, type } = require("../../elastic");

async function getLyrics(req) {
  const query = {
    min_score: 1.0,
    query: {
      match: {
        lyrics: {
          query: req.lyrics,
          operator: "and",
          fuzziness: 1,
        }
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