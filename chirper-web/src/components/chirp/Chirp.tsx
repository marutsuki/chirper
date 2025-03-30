import { FC } from "react";
import { Link } from "react-router-dom";

export interface ChirpData {
  id: number;
  text_content: string;
  user_id: number;
  username?: string;
  created_at: string;
}

interface ChirpProps {
  chirp: ChirpData;
}

const Chirp: FC<ChirpProps> = ({ chirp }) => {
  const formattedDate = new Date(chirp.created_at).toLocaleString();
  const displayName = chirp.username || `User ${chirp.user_id}`;

  return (
    <div className="border border-gray-200 p-4 mb-4 rounded-lg">
      <div className="flex justify-between items-start">
        <Link 
          to={`/profile/${chirp.user_id}`} 
          className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          {displayName}
        </Link>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>
      <div className="mt-2">{chirp.text_content}</div>
    </div>
  );
};

export default Chirp;
