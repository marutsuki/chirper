import knex from "@/config/db";
import User from "@/model/user";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "@/config/auth-config";

export async function createUser(user: User): Promise<number | null> {
    try {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        const id = await knex("users").insert(user).returning("id").first();
        if (!id) return null;
        console.info("User created with id: " + id);
        return id;
    } catch (error) {
        throw error;
    }
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const users = await knex("users").select("*");
        console.info("Retrieved all users from database.");
        return users;
    } catch (error) {
        throw error;
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const user = await knex("users").where({ id }).first();
        if (!user) return null;
        console.info("Retrieved user with id: " + id);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function getUserByUsername(username: string): Promise<User | null> {
    try {
        const user = await knex("users").where({ username }).first();
        if (!user) return null;
        console.info("Retrieved user with username: " + username);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function updateUserById(id: number, user: Partial<User>): Promise<User | null> {
    try {
        const updatedUser = await knex("users").where({ id }).update(user).returning("*").first();
        if (!updatedUser) return null;
        console.info("Updated user with id: " + id);
        return updatedUser as User;
    } catch (error) {
        throw error;
    }
}

export async function deleteUserById(id: number): Promise<boolean> {
    try {
        const deletedUser = await knex("users").where({ id }).del();
        if (deletedUser === 0) return false;
        console.info("Deleted user with id: " + id);
        return true;
    } catch (error) {
        throw error;
    }
}