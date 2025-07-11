// Import model
const Tag = require("../models/Tag");
// For error handling
const currentRepo = "TagRepository";

class TagRepository {
  // Get all tags
  static async findAll() {
    try {
      const tags = await Tag.query();
      return tags;
    } catch (error) {
      throw error;
    }
  }

  // Get tag by id
  static async findById(id) {
    try {
      const tag = await Tag.query().findOne({ id });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  // Get tag by name
  static async findByName(name) {
    try {
      const tag = await Tag.query().findOne({ name });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  // Get tag ids by names
  static async findTagIdsByNames(tagNames) {
    try {
      const tags = await Tag.query().whereIn("name", tagNames);
      return tags.map((tag) => tag.id);
    } catch (error) {
      throw error;
    }
  }

  // Get tags by ids
  static async findTagsByIds(tagIds) {
    try {
      return await Tag.query().whereIn("id", tagIds);
    } catch (error) {
      throw error;
    }
  }

  // Create a new tag
  static async create(name) {
    try {
      const tag = await Tag.query().insert({ name });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  // Update tag
  static async update(id, name) {
    try {
      const tag = await Tag.query().findOne({ id });
      if (!tag) {
        return null;
      }
      await Tag.query().findOne({ id }).patch({ name });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  // Delete a tag
  static async delete(id) {
    try {
      const tag = await Tag.query().findOne({ id });
      if (!tag) {
        return null;
      }
      await Tag.query().findOne({ id }).delete();
      return tag;
    } catch (error) {
      throw error;
    }
  }

  // Find and create tag if not exist
  static async findOrCreate(name) {
    try {
      let tag = await Tag.query().findOne({ name });
      if (!tag) {
        tag = await Tag.query().insert({ name });
      }
      return tag;
    } catch (error) {
      throw error;
    }
  }

  // Get popular tags (by post count)
  static async popularTags(limit = 10) {
    try {
      // Join ke post_tags dan hitung jumlah post untuk setiap tag
      const result = await Tag.query().select("tags.id", "tags.name").count("post_tags.post_id as post_count").join("post_tags", "tags.id", "post_tags.tag_id").groupBy("tags.id", "tags.name").orderBy("post_count", "desc").limit(limit);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TagRepository;
