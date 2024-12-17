import knex from "@/config/db";
import User from "@/model/user";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

import logger from "@/config/logging";
import {
    JWT_AUDIENCE,
    JWT_SECRET,
    JWT_SIGN_OPT,
    SALT_ROUNDS,
} from "@/config/auth-config";

export async function loginUser(
    username: string,
    password: string
): Promise<string | null> {
    try {
        const user = await getUserByUsername(username);
        if (user !== null && (await bcrypt.compare(password, user.password))) {
            logger.info({ userId: user.id }, "User logged in");
            return jwt.sign(
                { sub: user.id, aud: JWT_AUDIENCE },
                JWT_SECRET,
                JWT_SIGN_OPT
            );
        }
    } catch (error: unknown) {
        logger.error(error, "An error occurred attempting to log user in");
        throw new Error("An error occurred attempting to log user in.");
    }

    return null;
}
export async function createUser(user: User): Promise<number | null> {
    try {
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        const id = await knex("iam.users").insert(user).returning("id");
        if (!id) return null;
        logger.info(
            { id, username: user.username, email: user.email },
            "User created"
        );
        return id[0];
    } catch (error: unknown) {
        logger.error(error, "An error occurred while creating a user");
        throw new Error("An error occurred while creating a user.");
    }
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const users = await knex("iam.users").select("*");
        logger.debug("Retrieved all users from database.");
        return users;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while retrieving all users");
        throw new Error("An error occurred while retrieving all users.");
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const user = await knex("iam.users").where({ id });
        if (!user) return null;
        logger.debug({ id }, "Retrieved user");
        return user[0];
    } catch (error: unknown) {
        logger.error(error, "An error occurred while retrieving a user by id");
        throw new Error("An error occurred while retrieving a user by id.");
    }
}

export async function getUserByUsername(
    username: string
): Promise<User | null> {
    try {
        const user = await knex("iam.users").where({ username });
        if (!user) return null;
        logger.debug({ username }, "Retrieved user");
        return user[0];
    } catch (error: unknown) {
        logger.error(
            error,
            "An error occurred while retrieving a user by username"
        );
        throw new Error(
            "An error occurred while retrieving a user by username."
        );
    }
}

export async function updateUserById(
    id: number,
    user: Partial<User>
): Promise<User | null> {
    try {
        const updatedUser = await knex("iam.users")
            .where({ id })
            .update(user)
            .returning("*");
        if (!updatedUser) return null;
        logger.info({ id }, "User updated");
        return updatedUser[0] as User;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while updating a user by id");
        throw new Error("An error occurred while updating a user by id.");
    }
}

export async function deleteUserById(id: number): Promise<boolean> {
    try {
        const deletedUser = await knex("iam.users").where({ id }).del();
        if (deletedUser === 0) return false;
        logger.info("Deleted user with id: " + id);
        return true;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while deleting a user by id");
        throw new Error("An error occurred while deleting a user by id.");
    }
}
