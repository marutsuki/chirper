import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { backend } from "@/config";

interface User {
    id: number;
    username: string;
    email: string;
}

const UserSearch: FC = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim()) {
                setUsers([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(
                    backend(`/api/users?q=${encodeURIComponent(query)}`),
                    {
                        headers: getAuthHeaders(),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to search users");
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error searching users:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(() => {
            searchUsers();
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [query, getAuthHeaders]);

    const handleUserClick = (userId: number) => {
        navigate(`/profile/${userId}`);
        setShowResults(false);
        setQuery("");
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    className="pl-8 w-full"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {showResults && (query.trim() !== "" || users.length > 0) && (
                <div className="absolute z-10 mt-1 w-96 bg-white rounded-md shadow-lg max-h-60 overflow-x-hidden overflow-y-auto">
                    {loading ? (
                        <div className="p-2 text-center text-gray-500">
                            Loading...
                        </div>
                    ) : users.length > 0 ? (
                        <ul>
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    <div className="font-medium">
                                        {user.username}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : query.trim() !== "" ? (
                        <div className="p-2 text-center text-gray-500">
                            No users found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
