const config = require('../../knex.js');
const knex = require('knex')(config['development']);

module.exports = knex;

knex.ensureSchema = () => {
  return Promise.all([
    knex.schema.hasTable('Users')
      .then( (exists) => {
        if(!exists) {
          knex.schema.createTableIfNotExists('Users', (table) => {
            table.increments('id').primary();
            table.string('username', 25);
            table.string('password', 255);
            table.string('email', 255);
            table.string('salt', 255);
            table.boolean('isLoggedIn').defaultTo(false);
            table.string('securityQuestion1', 255);
            table.string('securityAnswer1', 255);
          })
          .then( (table) => {
            console.log('Users table has been created!');
          });
        }
      })
  ]);
};