import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserSettings {
    username: string;
    email: string;
}

const Settings: FC = () => {
    const navigate = useNavigate();
    const { getAuthHeaders, isAuthenticated, currentUserId } = useAuth();

    const [user, setUser] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!isAuthenticated || !currentUserId) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `http://localhost:3000/api/users/${currentUserId}`,
                    {
                        headers: getAuthHeaders(),
                    }
                );

                if (response.status === 401) {
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const userData = await response.json();
                setUser(userData);
                setUsername(userData.username);
                setEmail(userData.email);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, isAuthenticated, currentUserId, getAuthHeaders]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!currentUserId) return;

        try {
            const response = await fetch(
                `http://localhost:3000/api/users/${currentUserId}`,
                {
                    method: "PUT",
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setSuccessMessage("Profile updated successfully");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update profile"
            );
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!currentUserId) return;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (!currentPassword) {
            setError("Current password is required");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/users/${currentUserId}/password`,
                {
                    method: "PUT",
                    headers: {
                        ...getAuthHeaders(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update password");
            }

            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSuccessMessage("Password updated successfully");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update password"
            );
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading settings...</div>;
    }

    if (!user) {
        return <div className="text-center p-8">User not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            <div className="mb-8 p-6 border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit">Update Profile</Button>
                </form>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit">Change Password</Button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
