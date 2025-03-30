import { FC } from "react";
import Chirp, { ChirpData } from "./Chirp";

interface ChirpListProps {
  chirps: ChirpData[];
  isLoading?: boolean;
  error?: string;
}

const ChirpList: FC<ChirpListProps> = ({ chirps, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center p-4">Loading chirps...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (chirps.length === 0) {
    return <div className="text-center p-4">No chirps to display. Follow some users to see their chirps!</div>;
  }

  return (
    <div className="space-y-4">
      {chirps.map((chirp) => (
        <Chirp key={chirp.id} chirp={chirp} />
      ))}
    </div>
  );
};

export default ChirpList;
