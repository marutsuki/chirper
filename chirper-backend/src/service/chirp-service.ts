import knex from "@db/db";
import Chirp from "@/model/chirp";

export async function createChirp(chirp: Chirp): Promise<number> {
    try {
        const [id] = await knex("chirps").insert(chirp);
        return id;
    } catch (error) {
        throw error;
    }
}

export async function getAllChirps(): Promise<Chirp[]> {
    try {
        const chirps = await knex("chirps").select("*");
        console.log(JSON.stringify(chirps.map(user => user.user_id)));
        return chirps;
    } catch (error) {
        throw error;
    }
}

export async function getChirpById(id: number): Promise<Chirp> {
    try {
        const chirp = await knex("chirps").where({ id }).first();
        return chirp;
    } catch (error) {
        throw error;
    }
}

export async function updateChirpById(id: number, chirp: Partial<Chirp>): Promise<Chirp> {
    try {
        const [updatedChirp] = await knex("chirps").where({ id }).update(chirp).returning("*");
        return updatedChirp as Chirp;
    } catch (error) {
        throw error;
    }
}

export async function deleteChirpById(id: number): Promise<boolean> {
    try {
        const deletedChirp = await knex("chirps").where({ id }).del();
        console.log(deletedChirp);
        return deletedChirp !== 0;
    } catch (error) {
        throw error;
    }
}