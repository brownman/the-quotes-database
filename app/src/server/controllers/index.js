const model = require("../models");
const elastic = require("../../elastic");
const data = require("../../data");

/**
 * @function getLyrics
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function getLyrics(req, res) {
  const query = req.query;

  if (!query.lyrics) {
    return res.status(422).json({
      error: true,
      data: "Missing required parameter: lyrics",
    });
  }

  try {
    const result = await model.getLyrics(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error." });
  }
}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function addLyrics(req, res) {
  const body = req.body;

  if (!body.lyrics || !body.artist || !body.title) {
    return res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body' or 'artist' or 'title'",
    });
  }

  try {
    const result = await model.insertNewLyrics(
      body.lyrics,
      body.artist,
      body.title
    );

    return res.json({
      success: true,
      data: {
        id: result.body._id,
        artist: body.artist,
        lyrics: body.lyrics,
        title: body.title,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error." });
  }
}

/**
 * @function deleteIndex
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */
async function deleteIndex(req, res) {
  const elasticIndex = await elastic.esclient.indices.exists({
    index: elastic.index,
  });
  try {
    if (elasticIndex.body) {
      await elastic.deleteIndex(elastic.index);
    }

    return res.json({
      success: true,
      msg: "index deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error." });
  }
}

/**
 * @function createIndex
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */
async function createIndex(req, res) {
  const elasticIndex = await elastic.esclient.indices.exists({
    index: elastic.index,
  });

  try {
    if (!elasticIndex.body) {
      await elastic.createIndex(elastic.index);
      await elastic.setLyricsMapping();
      await data.populateDatabase();
    }

    return res.json({
      success: true,
      msg: "index created successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error." });
  }
}

module.exports = {
  getLyrics,
  addLyrics,
  createIndex,
  deleteIndex
};
