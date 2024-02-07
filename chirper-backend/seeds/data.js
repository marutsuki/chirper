/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const info = await knex.table("sqlite_master").select();
  console.info(info);

  await knex("users").del();
  await knex("chirps").del();
  await knex("follows").del();
  await knex("profiles").del()

  const userIds = await knex.table("users").insert(
    [{ email: "alice@alice.com", username: "alice", password: "password" },
    { email: "bob@bob.com", username: "bob", password: "password" },
    { email: "charlie@charlie.com", username: "charlie", password: "password" },
    { email: "duck@duck.com", username: "duck", password: "password" }]
  ).returning("id");

  userIds.forEach((id) => {
      knex.table("chirps").insert(
          [{ user_id: id, text_content: "Hello, world!" },
          { user_id: id, text_content: "Goodbye, world!" }]
      ).then(result => console.info(`${result} chirps inserted`));
  });

  knex.table("users").select().then(result => console.log(result));


  userIds.slice(0, userIds.length - 1).forEach((id, index, array) => {
      knex.table("follows").insert(
          { follower_id: id, followee_id: array[index + 1] },
      ).then(result => console.info(`${result} follows inserted`));
  });

  userIds.forEach((id) => {
      knex.table("profiles").insert(
          { user_id: id, bio: "I am a person." }
      ).then(result => console.info(`${result} profiles inserted`));
  });
};
