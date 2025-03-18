const { Model } = require("objection");

class Challenge extends Model {
  static get tableName() {
    return "challenges";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1, maxLength: 1000 },
        images: { type: ["string", "null"], maxLength: 255 },
        start_date: { type: "string", format: "date" },
        end_date: { type: "string", format: "date" },
        status: { type: "string", enum: ["open", "closed"] },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Challenge;
