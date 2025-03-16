const { model } = require("objection");

class User extends model {
  static get tableName() {
    return "users";
  }
}

module.exports = User;
