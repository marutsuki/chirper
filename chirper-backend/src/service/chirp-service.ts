import knex from "@/config/db";
import Chirp from "@/model/chirp";
import logger from "@/config/logging";

export async function createChirp(chirp: Chirp): Promise<number> {
    try {
        const [id] = await knex("chirps").insert(chirp);
        logger.info("Chirp created with id: " + id);
        return id;
    } catch (error: unknown) {
        logger.error("An error occurred while creating a chirp: ", error);
        throw new Error("An error occurred while creating a chirp.");
    }
}

export async function getAllChirps(limit: number = 100): Promise<Chirp[]> {
    try {
        const chirps = await knex("chirps").orderBy("created_at", "desc").limit(limit).select("*");
        logger.info(`Retrieved ${chirps.length} chirps from database.`);
        return chirps;
    } catch (error: unknown) {
        logger.error("An error occurred while retrieving chirps: ", error);
        throw new Error("An error occurred while retrieving chirps.");
    }
}

export async function getChirpsByUserId(userId: number, limit: number = 10): Promise<Chirp[]> {
    try {
        const chirps = await knex("chirps").where({ user_id: userId }).orderBy("created_at", "desc").limit(limit).select("*");
        logger.info(`Retrieved ${chirps.length} chirps for user with id: ${userId}`);
        return chirps;
    } catch (error: unknown) {
        logger.error(
            "An error occurred while retrieving chirps by user id: ",
            error
        );
        throw new Error("An error occurred while retrieving chirps by user id.");
    }
}

export async function getChirpsByUserIds(userIds: number[], limit: number = 100): Promise<Chirp[]> {
    try {
        const chirps = await knex("chirps").whereIn("user_id", userIds).orderBy("created_at", "desc").limit(limit).select("*");
        logger.info(`Retrieved ${chirps.length} chirps for user ids: userIds`);
        return chirps;
    } catch (error: unknown) {
        logger.error(
            "An error occurred while retrieving chirps by user ids: ",
            error
        );
        throw new Error("An error occurred while retrieving chirps by user ids.");
    }
}

export async function getChirpById(id: number): Promise<Chirp> {
    try {
        const chirp = await knex("chirps").where({ id }).first();
        logger.info("Retrieved chirp with id: " + id);
        return chirp;
    } catch (error: unknown) {
        logger.error(
            "An error occurred while retrieving a chirp by id: ",
            error
        );
        throw new Error("An error occurred while retrieving a chirp by id.");
    }
}

export async function updateChirpById(
    id: number,
    chirp: Partial<Chirp>
): Promise<Chirp> {
    try {
        const [updatedChirp] = await knex("chirps")
            .where({ id })
            .update(chirp)
            .returning("*");
        logger.info("Updated chirp with id: " + id);
        return updatedChirp as Chirp;
    } catch (error: unknown) {
        logger.error(
            "An error occurred while updating a chirp by id: ",
            error
        );
        throw new Error("An error occurred while updating a chirp by id.");
    }
}

export async function deleteChirpById(id: number): Promise<boolean> {
    try {
        const deletedChirp = await knex("chirps").where({ id }).del();
        logger.info("Deleted chirp with id: " + id);
        return deletedChirp !== 0;
    } catch (error: unknown) {
        logger.error(
            "An error occurred while deleting a chirp by id: ",
            error
        );
        throw new Error("An error occurred while deleting a chirp by id.");
    }
}
