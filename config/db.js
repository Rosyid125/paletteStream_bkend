// This file is used for connecting to the database using knex and objection.js. This sets up objection.js too, since it's built on top of knex. This file is used in the models and migrations files
const Knex = require("knex");
const { Model } = require("objection");
const knexConfig = require("../knexfile");

const knex = Knex(knexConfig.development);

Model.knex(knex);

module.exports = knex;
