const { Model } = require("objection");

class Group extends Model {
  static get tableName() {
    return "groups";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "description"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Group;
