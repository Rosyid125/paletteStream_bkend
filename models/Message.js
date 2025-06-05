const { Model } = require("objection");

class Message extends Model {
  static get tableName() {
    return "messages";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["sender_id", "receiver_id", "content"],
      properties: {
        id: { type: "integer" },
        sender_id: { type: "integer" },
        receiver_id: { type: "integer" },
        content: { type: "string" },
        is_read: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }
}

module.exports = Message;
