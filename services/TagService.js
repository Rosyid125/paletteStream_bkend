const TagRepository = require("../repositories/TagRepository");

class TagService {
  static async getPopularTags(limit = 10) {
    return TagRepository.popularTags(limit);
  }
}

module.exports = TagService;
