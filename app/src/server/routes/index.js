const express    = require("express");
const controller = require("../controllers");
const routes     = express.Router();

//get
routes.route("/look_for_song").get(controller.getLyrics);
routes.route("/create_index").get(controller.createIndex); //populate elastic using lyrics.json
routes.route("/delete_index").get(controller.deleteIndex);

//post
routes.route("/new").post(controller.addLyrics);


module.exports = routes;