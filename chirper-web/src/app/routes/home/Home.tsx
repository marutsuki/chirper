import { FC, useEffect, useState } from "react";
import ChirpList from "@/components/chirp/ChirpList";
import CreateChirp from "@/components/chirp/CreateChirp";
import { ChirpData } from "@/components/chirp/Chirp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";

const Home: FC = () => {
    const [chirps, setChirps] = useState<ChirpData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();

    const fetchTimeline = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/timeline", {
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

            const data = await response.json();
            setChirps(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeline();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Home</h1>
            
            <CreateChirp onChirpCreated={fetchTimeline} />

            <ChirpList
                chirps={chirps}
                isLoading={isLoading}
                error={error ? error : undefined}
            />
        </div>
    );
};

export default Home;
