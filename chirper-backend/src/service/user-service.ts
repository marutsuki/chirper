import knex from "@/config/db";
import User from "@/model/user";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "@/config/auth-config";

export async function createUser(user: User): Promise<number> {
    try {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        const [id] = await knex("users").insert(user);
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

export async function getUserById(id: number): Promise<User> {
    try {
        const user = await knex("users").where({ id }).first();
        console.info("Retrieved user with id: " + id);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function getUserByUsername(username: string): Promise<User> {
    try {
        const user = await knex("users").where({ username }).first();
        console.info("Retrieved user with username: " + username);
        return user;
    } catch (error) {
        throw error;
    }
}

export async function updateUserById(id: number, user: Partial<User>): Promise<User> {
    try {
        const [updatedUser] = await knex("users").where({ id }).update(user).returning("*");
        console.info("Updated user with id: " + id);
        return updatedUser as User;
    } catch (error) {
        throw error;
    }
}

export async function deleteUserById(id: number): Promise<boolean> {
    try {
        const deletedUser = await knex("users").where({ id }).del();
        console.info("Deleted user with id: " + id);
        return deletedUser !== 0;
    } catch (error) {
        throw error;
    }
}