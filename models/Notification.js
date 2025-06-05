const { Model } = require("objection");

class Notification extends Model {
  static get tableName() {
    return "notifications";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "type", "data"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        type: { type: "string" },
        data: { type: "object" }, // JSON field
        is_read: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Notification;
