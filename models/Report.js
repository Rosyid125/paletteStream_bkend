const { Model } = require("objection");

class Report extends Model {
  static get tableName() {
    return "reports";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["reporter_id", "report_picture", "note"],
      properties: {
        id: { type: "integer" },
        reporter_id: { type: "integer" },
        report_picture: { type: "string", minLength: 1, maxLength: 255 },
        note: { type: "string", minLength: 1, maxLength: 1000 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    };
  }

  static get relationMappings() {
    const User = require("./User");

    return {
      reporter: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "reports.reporter_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Report;
