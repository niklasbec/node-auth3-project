const knex = require('knex')
const configuration = require ('../knexfile').development

module.exports = knex(configuration)