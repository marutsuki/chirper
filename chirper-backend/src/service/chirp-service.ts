import knex from "@/config/db";
import Chirp from "@/model/chirp";
import logger from "@/config/logging";

export async function createChirp(chirp: Chirp): Promise<number> {
    try {
        const [id] = await knex("chirp.chirps").insert(chirp).returning("id");
        logger.info("Chirp created with id: " + id);
        return id;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while creating a chirp");
        throw new Error("An error occurred while creating a chirp.");
    }
}

export async function getAllChirps(limit: number = 100): Promise<Chirp[]> {
    try {
        const chirps = await knex("chirp.chirps")
            .orderBy("created_at", "desc")
            .limit(limit)
            .select("*");
        logger.info(`Retrieved ${chirps.length} chirps from database.`);
        return chirps;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while retrieving chirps");
        throw new Error("An error occurred while retrieving chirps.");
    }
}

export async function getChirpsByUserId(
    userId: number,
    pagination: PaginationParams = {}
): Promise<PaginatedResult<Chirp>> {
    try {
        const { limit = 10, cursor } = pagination;
        let query = knex("chirp.chirps")
            .where({ user_id: userId })
            .orderBy("created_at", "desc")
            .orderBy("id", "desc")
            .limit(limit + 1); // Get one extra to check if there are more

        // Apply cursor-based pagination if cursor is provided
        if (cursor) {
            const [timestamp, id] = cursor.split("@");
            // Parse the timestamp from ISO format
            const parsedTimestamp = new Date(timestamp).toISOString();
            
            query = query.where(function () {
                this.where("created_at", "<", parsedTimestamp).orWhere(function () {
                    this.where("created_at", "=", parsedTimestamp).andWhere(
                        "id",
                        "<",
                        id
                    );
                });
            });
        }

        const chirps = await query.select("*");

        // Check if there are more results
        const hasMore = chirps.length > limit;
        const results = hasMore ? chirps.slice(0, limit) : chirps;

        // Create the next cursor
        let nextCursor = null;
        if (hasMore && results.length > 0) {
            const lastChirp = results[results.length - 1];
            // Format the timestamp in ISO format to ensure consistency
            const timestamp = new Date(lastChirp.created_at).toISOString();
            nextCursor = `${timestamp}@${lastChirp.id}`;
        }

        logger.info(
            { userId, limit, cursor },
            `Retrieved ${results.length} chirps for user id: ${userId}`
        );

        return {
            data: results,
            nextCursor,
            hasMore,
        };
    } catch (error: unknown) {
        logger.error(
            error,
            "An error occurred while retrieving chirps by user id"
        );
        throw new Error(
            "An error occurred while retrieving chirps by user id."
        );
    }
}

export interface PaginationParams {
    limit?: number;
    cursor?: string; // Format: "timestamp@id"
}

export interface PaginatedResult<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

export async function getChirpsByUserIds(
    userIds: number[],
    pagination: PaginationParams = {}
): Promise<PaginatedResult<Chirp>> {
    try {
        const { limit = 10, cursor } = pagination;
        let query = knex("chirp.chirps")
            .whereIn("user_id", userIds)
            .orderBy("created_at", "desc")
            .orderBy("id", "desc")
            .limit(limit + 1); // Get one extra to check if there are more

        // Apply cursor-based pagination if cursor is provided
        if (cursor) {
            const [timestamp, id] = cursor.split("@");
            // Parse the timestamp from ISO format
            const parsedTimestamp = new Date(timestamp).toISOString();
            
            query = query.where(function () {
                this.where("created_at", "<", parsedTimestamp).orWhere(function () {
                    this.where("created_at", "=", parsedTimestamp).andWhere(
                        "id",
                        "<",
                        id
                    );
                });
            });
        }

        const chirps = await query.select("*");

        // Check if there are more results
        const hasMore = chirps.length > limit;
        const results = hasMore ? chirps.slice(0, limit) : chirps;

        // Create the next cursor
        let nextCursor = null;
        if (hasMore && results.length > 0) {
            const lastChirp = results[results.length - 1];
            // Format the timestamp in ISO format to ensure consistency
            const timestamp = new Date(lastChirp.created_at).toISOString();
            nextCursor = `${timestamp}@${lastChirp.id}`;
        }

        logger.info(
            { userIds, limit, cursor },
            `Retrieved ${results.length} chirps for user ids`
        );

        return {
            data: results,
            nextCursor,
            hasMore,
        };
    } catch (error: unknown) {
        logger.error(
            error,
            "An error occurred while retrieving chirps by user ids"
        );
        throw new Error(
            "An error occurred while retrieving chirps by user ids."
        );
    }
}

export async function getChirpById(id: number): Promise<Chirp> {
    try {
        const chirp = await knex("chirp.chirps").where({ id }).first();
        logger.debug({ id }, "Retrieved chirp");
        return chirp;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while retrieving a chirp by id");
        throw new Error("An error occurred while retrieving a chirp by id.");
    }
}

export async function updateChirpById(
    id: number,
    chirp: Partial<Chirp>
): Promise<Chirp> {
    try {
        const [updatedChirp] = await knex("chirp.chirps")
            .where({ id })
            .update(chirp)
            .returning("*");
        logger.info({ id }, "Chirp updated");
        return updatedChirp as Chirp;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while updating a chirp by id");
        throw new Error("An error occurred while updating a chirp by id.");
    }
}

export async function deleteChirpById(id: number): Promise<boolean> {
    try {
        const deletedChirp = await knex("chirp.chirps").where({ id }).del();
        logger.info({ id }, "Chirp deleted");
        return deletedChirp !== 0;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while deleting a chirp by id");
        throw new Error("An error occurred while deleting a chirp by id.");
    }
}
