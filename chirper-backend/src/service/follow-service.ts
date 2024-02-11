import knex from "@/config/db";
import Follow from "@/model/follow";

export async function followUser(followerId: number, followeeId: number): Promise<Follow | null> {
    if (followerId === followeeId) {
        throw new Error("User cannot follow themselves.");
    }
    try {
        const follow = await knex("follows").insert({ follower_id: followerId, followee_id: followeeId }).returning("*").first();
        console.info("User with id " + followerId + " followed user with id " + followeeId);

        if (!follow) {
            return null;
        }
        return follow;
    } catch (error: unknown) {
        console.error("An error occurred while following a user: ", error);
        throw new Error("An error occurred while following a user.");
    }
}

export async function unfollowUser(followerId: number, followeeId: number): Promise<boolean> {
    try {
        const deletedFollow = await knex("follows").where({ follower_id: followerId, followee_id: followeeId }).del();

        if (deletedFollow === 0) {
            return false;
        }
        console.info("User with id " + followerId + " unfollowed user with id " + followeeId);
        return true;
    } catch (error: unknown) {
        console.error("An error occurred while unfollowing a user: ", error);
        throw new Error("An error occurred while unfollowing a user.");
    }
}

export async function getAllFollowers(userId: number): Promise<Follow[]> {
    try {
        const followers = await knex("follows").where({ followee_id: userId }).select("*");
        console.info("Retrieved all followers for user with id: " + userId);
        return followers;
    } catch (error: unknown) {
        console.error("An error occurred while retrieving all followers for a user: ", error);
        throw new Error("An error occurred while retrieving all followers for a user.");
    }
}

export async function getAllFollowees(userId: number): Promise<Follow[]> {
    try {
        const followees = await knex("follows").where({ follower_id: userId }).select("*");
        console.info("Retrieved all followees for user with id: " + userId);
        return followees;
    } catch (error: unknown) {
        console.error("An error occurred while retrieving all followees for a user: ", error);
        throw new Error("An error occurred while retrieving all followees for a user.");
    }
}