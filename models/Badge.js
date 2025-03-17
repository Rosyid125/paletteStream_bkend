const { Model } = require("objection");

class Badge extends Model {
  static get tableName() {
    return "badges";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "icon", "description"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        icon: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1, maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Badge;
