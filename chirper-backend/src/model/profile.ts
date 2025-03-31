export default interface Profile {
    id?: number;
    user_id: number;
    bio: string;
    avatar_url: string;
    gender_pronouns?: string;
    location?: string;
    website?: string;
    display_name?: string;
}
