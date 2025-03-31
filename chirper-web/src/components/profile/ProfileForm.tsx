import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
    profile: ProfileData;
    onSave: (updatedProfile: ProfileData) => Promise<void>;
    onCancel: () => void;
}

export interface ProfileData {
    id?: number;
    user_id: number;
    bio: string;
    avatar_url: string;
    gender_pronouns?: string;
    location?: string;
    website?: string;
    display_name?: string;
}

const ProfileForm: FC<ProfileFormProps> = ({ profile, onSave, onCancel }) => {
    const [formData, setFormData] = useState<ProfileData>({
        ...profile,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await onSave(formData);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to save profile"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                    id="display_name"
                    name="display_name"
                    value={formData.display_name || ""}
                    onChange={handleChange}
                    placeholder="Display Name"
                />
            </div>

            <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="gender_pronouns">Gender Pronouns</Label>
                <Input
                    id="gender_pronouns"
                    name="gender_pronouns"
                    value={formData.gender_pronouns || ""}
                    onChange={handleChange}
                    placeholder="e.g. she/her, he/him, they/them"
                />
            </div>

            <div>
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    placeholder="e.g. Sydney, Australia"
                />
            </div>

            <div>
                <Label htmlFor="website">Website</Label>
                <Input
                    id="website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    placeholder="e.g. https://example.com"
                />
            </div>

            <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                    id="avatar_url"
                    name="avatar_url"
                    value={formData.avatar_url || ""}
                    onChange={handleChange}
                    placeholder="URL to your profile picture"
                />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
            </div>
        </form>
    );
};

export default ProfileForm;
