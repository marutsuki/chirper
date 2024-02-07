export default interface Chirp {
    id?: number;
    user_id: number;
    text_content: string;
    created_at?: Date;
}
