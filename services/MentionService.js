const UserRepository = require("../repositories/UserRepository.js");
const NotificationService = require("../services/NotificationService.js");

class MentionService {
  /**
   * Extract mentions from text content
   * Matches @username patterns
   */
  static extractMentions(content) {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]); // Extract username without @
    }

    return [...new Set(mentions)]; // Remove duplicates
  }

  /**
   * Process mentions in content and send notifications
   */
  static async processMentions(content, mentionerId, postId, commentId = null, context = "comment") {
    try {
      const usernames = this.extractMentions(content);

      if (usernames.length === 0) return;

      // Find users by usernames
      const users = await this.findUsersByUsernames(usernames);

      // Send notifications to mentioned users
      for (const user of users) {
        // Don't notify if user mentions themselves
        if (user.id === mentionerId) continue;

        try {
          await NotificationService.notifyMention(user.id, mentionerId, postId, commentId, context);
        } catch (notificationError) {
          console.error(`Failed to send mention notification to user ${user.id}:`, notificationError);
        }
      }

      console.log(`Processed ${users.length} mention notifications`);
      return users;
    } catch (error) {
      console.error("Error processing mentions:", error);
      return [];
    }
  }
  /**
   * Find users by array of usernames
   */
  static async findUsersByUsernames(usernames) {
    try {
      // This would need to be implemented in UserRepository
      // For now, we'll implement it here directly
      const User = require("../models/User.js");

      const users = await User.query().withGraphJoined("profile").whereIn("profile.username", usernames).select("users.id", "users.email").distinct();

      return users;
    } catch (error) {
      console.error("Error finding users by usernames:", error);
      return [];
    }
  }

  /**
   * Replace mentions in content with clickable links (for frontend)
   * This could be used when returning content to frontend
   */
  static formatMentionsForDisplay(content) {
    const mentionRegex = /@(\w+)/g;

    return content.replace(mentionRegex, (match, username) => {
      return `[@${username}](/user/${username})`;
    });
  }

  /**
   * Validate if username exists before allowing mention
   */
  static async validateMentions(content) {
    const usernames = this.extractMentions(content);

    if (usernames.length === 0) return { valid: true, invalidUsernames: [] };

    const users = await this.findUsersByUsernames(usernames);
    const foundUsernames = users.map((user) => user.profile?.username).filter(Boolean);
    const invalidUsernames = usernames.filter((username) => !foundUsernames.includes(username));

    return {
      valid: invalidUsernames.length === 0,
      invalidUsernames,
      validUsernames: foundUsernames,
    };
  }
}

module.exports = MentionService;
