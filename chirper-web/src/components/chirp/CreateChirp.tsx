import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/app/AuthContext";

interface CreateChirpProps {
    onChirpCreated: () => void;
}

const CreateChirp: FC<CreateChirpProps> = ({ onChirpCreated }) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getAuthHeaders } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError("Chirp cannot be empty");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/chirps", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({ text_content: content }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create chirp");
            }

            setContent("");
            onChirpCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 border border-gray-200 p-4 rounded-lg"
        >
            <div className="mb-2">
                <Textarea
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setContent(e.target.value)
                    }
                    maxLength={280}
                    className="w-full resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                    {content.length}/280
                </div>
            </div>

            {error && <div className="text-red-500 mb-2">{error}</div>}

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Chirp"}
                </Button>
            </div>
        </form>
    );
};

export default CreateChirp;
