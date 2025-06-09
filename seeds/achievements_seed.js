exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("achievements").del();

  const now = new Date();
  await knex("achievements").insert([
    { id: 1, title: "Community Favorite", icon: "heart", description: "Your post received 10 likes from 10 different users", goal: 10, created_at: now, updated_at: now },
    { id: 2, title: "Rising Star", icon: "flame", description: "Your post received 50 likes from 30 different users", goal: 50, created_at: now, updated_at: now },
    { id: 3, title: "Well Commented", icon: "message-circle", description: "Your post received 20 comments from 10 different users", goal: 20, created_at: now, updated_at: now },
    { id: 4, title: "Talk of the Thread", icon: "repeat", description: "Your comment got 10 replies from different users", goal: 10, created_at: now, updated_at: now },
    { id: 5, title: "Saved by Many", icon: "bookmark", description: "Your post was bookmarked by 20 different users", goal: 20, created_at: now, updated_at: now },
    { id: 6, title: "Known in the Community", icon: "users", description: "You were followed by 50 users", goal: 50, created_at: now, updated_at: now },
    { id: 7, title: "Becoming Influential", icon: "star", description: "You were followed by 100 users", goal: 100, created_at: now, updated_at: now },
    { id: 8, title: "Active Connections", icon: "message-square", description: "You had active chats with 10 different users (2-way)", goal: 10, created_at: now, updated_at: now },
    { id: 9, title: "Engaging Commenter", icon: "reply", description: "You replied to comments from 10 different users", goal: 10, created_at: now, updated_at: now },
    { id: 10, title: "Mini Viral", icon: "zap", description: "Your post received 5 likes from different users in 1 hour", goal: 5, created_at: now, updated_at: now },
    { id: 11, title: "Daily Leader", icon: "trophy", description: "Your post ranked in the top 10 daily leaderboard", goal: 1, created_at: now, updated_at: now },
    { id: 12, title: "Weekly Highlight", icon: "bar-chart", description: "Your post ranked in the top 10 weekly leaderboard", goal: 1, created_at: now, updated_at: now },
    { id: 13, title: "One Tag to Rule...", icon: "tag", description: "10 consecutive posts using the same tag", goal: 10, created_at: now, updated_at: now },
    { id: 14, title: "Gallery Post", icon: "images", description: "Uploaded 10 posts, each with 3+ images", goal: 10, created_at: now, updated_at: now },
    { id: 15, title: "Saved by the Crowd", icon: "book", description: "One post was bookmarked by 30 different users", goal: 30, created_at: now, updated_at: now },
  ]);
};
