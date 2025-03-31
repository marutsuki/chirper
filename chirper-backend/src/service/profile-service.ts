import knex from "@/config/db";
import Profile from "@/model/profile";
import logger from "@/config/logging";

export async function getProfileByUserId(userId: number): Promise<Profile | null> {
    try {
        const profile = await knex("social.profiles").where({ user_id: userId }).first();
        logger.debug({ userId }, "Retrieved profile");
        return profile || null;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while retrieving a profile by user id");
        throw new Error("An error occurred while retrieving a profile by user id.");
    }
}

export async function createProfile(profile: Profile): Promise<number | null> {
    try {
        const id = await knex("social.profiles").insert(profile).returning("id");
        if (!id) return null;
        logger.info({ id, userId: profile.user_id }, "Profile created");
        return id[0];
    } catch (error: unknown) {
        logger.error(error, "An error occurred while creating a profile");
        throw new Error("An error occurred while creating a profile.");
    }
}

export async function updateProfileByUserId(
    userId: number,
    profile: Partial<Profile>
): Promise<Profile | null> {
    try {
        // Remove user_id from the update object if it exists
        const { user_id, ...updateData } = profile;
        
        const updatedProfile = await knex("social.profiles")
            .where({ user_id: userId })
            .update(updateData)
            .returning("*");
            
        if (!updatedProfile || updatedProfile.length === 0) return null;
        logger.info({ userId }, "Profile updated");
        return updatedProfile[0] as Profile;
    } catch (error: unknown) {
        logger.error(error, "An error occurred while updating a profile by user id");
        throw new Error("An error occurred while updating a profile by user id.");
    }
}

export async function createDefaultProfile(userId: number): Promise<number | null> {
    try {
        const defaultProfile: Profile = {
            user_id: userId,
            bio: "",
            avatar_url: "",
        };
        
        return await createProfile(defaultProfile);
    } catch (error: unknown) {
        logger.error(error, "An error occurred while creating a default profile");
        throw new Error("An error occurred while creating a default profile.");
    }
}
