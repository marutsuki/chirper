import { FC, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { ChirpData } from "@/components/chirp/Chirp";
import ChirpList from "@/components/chirp/ChirpList";
import { Button } from "@/components/ui/button";

interface UserProfile {
    id: number;
    username: string;
    email: string;
}

interface ChirpResponse {
    data: ChirpData[];
    nextCursor: string | null;
    hasMore: boolean;
}

const Profile: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { getAuthHeaders, isAuthenticated, currentUserId } = useAuth();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [chirps, setChirps] = useState<ChirpData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        // Check if this is the current user's profile
        if (currentUserId && userId) {
            setIsOwnProfile(currentUserId === parseInt(userId));
        }

        const fetchUserProfile = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch user data
                const userResponse = await fetch(
                    `http://localhost:3000/api/users/${userId}`,
                    {
                        headers: getAuthHeaders(),
                    }
                );

                if (userResponse.status === 401) {
                    navigate("/login");
                    return;
                }

                if (!userResponse.ok) {
                    throw new Error("Failed to fetch user profile");
                }

                const userData = await userResponse.json();
                setUser(userData);

                // Check if this is the current user's profile
                if (currentUserId) {
                    setIsOwnProfile(currentUserId === userData.id);
                }

                // Fetch user's chirps
                const chirpsResponse = await fetch(
                    `http://localhost:3000/api/chirps/user/${userId}?limit=10`,
                    {
                        headers: getAuthHeaders(),
                    }
                );

                if (!chirpsResponse.ok) {
                    throw new Error("Failed to fetch user chirps");
                }

                const chirpsData: ChirpResponse = await chirpsResponse.json();
                setChirps(chirpsData.data);
                setNextCursor(chirpsData.nextCursor);
                setHasMore(chirpsData.hasMore);

                // Check if current user is following this profile
                const followsResponse = await fetch(
                    `http://localhost:3000/api/follows/check/${userId}`,
                    {
                        headers: getAuthHeaders(),
                    }
                );

                if (followsResponse.ok) {
                    const { following } = await followsResponse.json();
                    setIsFollowing(following);
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, navigate, isAuthenticated, getAuthHeaders, currentUserId]);

    const handleLoadMore = useCallback(async () => {
        if (!nextCursor || isLoadingMore) return;
        
        setIsLoadingMore(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/chirps/user/${userId}?cursor=${nextCursor}&limit=10`,
                {
                    headers: getAuthHeaders(),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch more chirps");
            }

            const data: ChirpResponse = await response.json();
            setChirps(prevChirps => [...prevChirps, ...data.data]);
            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoadingMore(false);
        }
    }, [userId, nextCursor, isLoadingMore, getAuthHeaders]);

    const handleFollowToggle = async () => {
        try {
            const url = `http://localhost:3000/api/follows/${isFollowing ? "unfollow" : "follow"}/${userId}`;
            const response = await fetch(url, {
                method: "POST",
                headers: getAuthHeaders(),
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
            } else {
                throw new Error(
                    `Failed to ${isFollowing ? "unfollow" : "follow"} user`
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!user) {
        return <div className="text-center p-8">User not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    {!isOwnProfile && (
                        <Button
                            variant={isFollowing ? "outline" : "default"}
                            onClick={handleFollowToggle}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                    {isOwnProfile && (
                        <div className="text-sm text-gray-500 italic">
                            This is your profile
                        </div>
                    )}
                </div>
                <div className="text-gray-600">
                    <p>Email: {user.email}</p>
                    <p className="mt-2">User ID: {user.id}</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Chirps</h2>
            <ChirpList 
                chirps={chirps} 
                isLoading={false} 
                isLoadingMore={isLoadingMore}
                error={undefined} 
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
};

export default Profile;
