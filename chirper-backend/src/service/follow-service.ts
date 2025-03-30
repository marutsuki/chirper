import knex from "@/config/db";
import Follow from "@/model/follow";
import logger from "@/config/logging";

export async function followUser(
    followerId: number,
    followeeId: number
): Promise<Follow | null> {
    // Prevent users from following themselves
    if (followerId === followeeId) {
        logger.warn({ followerId }, "User attempted to follow themselves");
        return null;
    }
    
    try {
        const follow = await knex("social.follows")
            .insert({ follower_id: followerId, followee_id: followeeId })
            .returning("*");
        logger.info({ followerId, followeeId }, "User follow");

        if (!follow || follow.length === 0) {
            return null;
        }
        return follow[0];
    } catch (error: unknown) {
        logger.error(error, "An error occurred while following a user");
        throw new Error("An error occurred while following a user.");
    }
}

export async function unfollowUser(
    followerId: number,
    followeeId: number
): Promise<boolean> {
    try {
        const deletedFollow = await knex("social.follows")
            .where({ follower_id: followerId, followee_id: followeeId })
            .del();

        if (deletedFollow === 0) {
            return false;
        }
        logger.info({ followerId, followeeId }, "User unfollow");
        return true;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while unfollowing a user: ");
        throw new Error("An error occurred while unfollowing a user.");
    }
}

export async function getAllFollowers(userId: number): Promise<Follow[]> {
    try {
        const followers = await knex("social.follows")
            .where({ followee_id: userId })
            .select("*");
        logger.info({ userId }, "Retrieved all followers for user with id");
        return followers;
    } catch (error: unknown) {
        logger.error(
            error,
            "An error occurred while retrieving all followers for a user: "
        );
        throw new Error(
            "An error occurred while retrieving all followers for a user."
        );
    }
}

export async function getAllFollowees(userId: number): Promise<Follow[]> {
    try {
        const followees = await knex("social.follows")
            .where({ follower_id: userId })
            .select("*");
        logger.info({ userId }, "Retrieved all followees for user with id");
        return followees;
    } catch (error: unknown) {
        logger.error(
            error,
            "An error occurred while retrieving all followees for a user: "
        );
        throw new Error(
            "An error occurred while retrieving all followees for a user."
        );
    }
}
