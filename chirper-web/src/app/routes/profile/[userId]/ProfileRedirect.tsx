import { useAuth } from "@/app/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileRedirect = () => {
    const navigate = useNavigate();
    const { currentUserId } = useAuth();

    useEffect(() => {
        if (currentUserId) {
            navigate(`/profile/${currentUserId}`);
        }
    }, [currentUserId, navigate]);

    return null;
};

export default ProfileRedirect;
