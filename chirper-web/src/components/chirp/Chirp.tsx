import { FC } from "react";

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

  return (
    <div className="border border-gray-200 p-4 mb-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="font-bold">{chirp.username || `User ${chirp.user_id}`}</div>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>
      <div className="mt-2">{chirp.text_content}</div>
    </div>
  );
};

export default Chirp;
