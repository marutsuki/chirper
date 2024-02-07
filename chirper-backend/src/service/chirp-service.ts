import knex from "@db/db";
import Chirp from "@/model/chirp";

export async function createChirp(chirp: Chirp): Promise<number> {
    try {
        const [id] = await knex("chirps").insert(chirp);
        console.info("Chirp created with id: " + id);
        return id;
    } catch (error) {
        throw error;
    }
}

export async function getAllChirps(): Promise<Chirp[]> {
    try {
        const chirps = await knex("chirps").select("*");
        console.info("Retrieved all chirps from database.");
        return chirps;
    } catch (error) {
        throw error;
    }
}

export async function getChirpById(id: number): Promise<Chirp> {
    try {
        const chirp = await knex("chirps").where({ id }).first();
        console.info("Retrieved chirp with id: " + id);
        return chirp;
    } catch (error) {
        throw error;
    }
}

export async function updateChirpById(id: number, chirp: Partial<Chirp>): Promise<Chirp> {
    try {
        const [updatedChirp] = await knex("chirps").where({ id }).update(chirp).returning("*");
        console.info("Updated chirp with id: " + id);
        return updatedChirp as Chirp;
    } catch (error) {
        throw error;
    }
}

export async function deleteChirpById(id: number): Promise<boolean> {
    try {
        const deletedChirp = await knex("chirps").where({ id }).del();
        console.info("Deleted chirp with id: " + id);
        return deletedChirp !== 0;
    } catch (error) {
        throw error;
    }
}