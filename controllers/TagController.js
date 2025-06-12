const TagService = require("../services/TagService");

class TagController {
  static async getPopularTags(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const tags = await TagService.getPopularTags(limit);
      res.json({ success: true, data: tags });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = TagController;
