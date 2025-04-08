import { FC, useCallback, useEffect, useState } from "react";
import ChirpList from "@/components/chirp/ChirpList";
import CreateChirp from "@/components/chirp/CreateChirp";
import { ChirpData } from "@/components/chirp/Chirp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { backend } from "@/config";

interface TimelineResponse {
    data: ChirpData[];
    nextCursor: string | null;
    hasMore: boolean;
}

const Home: FC = () => {
    const [chirps, setChirps] = useState<ChirpData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();

    const fetchTimeline = useCallback(async (cursor?: string, append: boolean = false) => {
        if (!append) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        setError(null);

        try {
            const url = new URL(backend("/api/timeline"));
            if (cursor) {
                url.searchParams.append("cursor", cursor);
            }
            url.searchParams.append("limit", "10");

            const response = await fetch(url.toString(), {
                headers: getAuthHeaders(),
            });

            if (response.status === 401) {
                // User is not authenticated, redirect to login
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch timeline");
            }

            const data: TimelineResponse = await response.json();
            
            if (append) {
                setChirps(prevChirps => [...prevChirps, ...data.data]);
            } else {
                setChirps(data.data);
            }
            
            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            if (!append) {
                setIsLoading(false);
            } else {
                setIsLoadingMore(false);
            }
        }
    }, [getAuthHeaders, navigate]);

    const handleLoadMore = useCallback(() => {
        if (nextCursor && !isLoadingMore) {
            fetchTimeline(nextCursor, true);
        }
    }, [fetchTimeline, nextCursor, isLoadingMore]);

    const handleChirpCreated = useCallback(() => {
        // Reset and fetch from the beginning when a new chirp is created
        setChirps([]);
        setNextCursor(null);
        fetchTimeline();
    }, [fetchTimeline]);

    useEffect(() => {
        fetchTimeline();
    }, [fetchTimeline]);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-heading">Home</h1>

            <CreateChirp onChirpCreated={handleChirpCreated} />

            <ChirpList
                chirps={chirps}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                error={error ? error : undefined}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
            />
        </div>
    );
};

export default Home;
