/**
 * @param { import("knex").Knex } db
 * @returns { Promise<void> } 
 */
exports.seed = async function(db) {
  // Deletes ALL existing entries
  const userIds = await db.table("users").insert(
    [{ email: "alice@alice.com", username: "alice", password: "password" },
    { email: "bob@bob.com", username: "bob", password: "password" },
    { email: "charlie@charlie.com", username: "charlie", password: "password" },
    { email: "duck@duck.com", username: "duck", password: "password" }]
  ).returning("id");

  userIds.forEach((id) => {
      db.table("chirps").insert(
          [{ user_id: id, text_content: "Hello, world!" },
          { user_id: id, text_content: "Goodbye, world!" }]
      ).then(result => console.info(`${result} chirps inserted`));
  });

  db.table("users").select().then(result => console.log(result));


  userIds.slice(0, userIds.length - 1).forEach((id, index, array) => {
      db.table("follows").insert(
          { follower_id: id, followee_id: array[index + 1] },
      ).then(result => console.info(`${result} follows inserted`));
  });

  userIds.forEach((id) => {
      db.table("profiles").insert(
          { user_id: id, bio: "I am a person." }
      ).then(result => console.info(`${result} profiles inserted`));
  });
};
