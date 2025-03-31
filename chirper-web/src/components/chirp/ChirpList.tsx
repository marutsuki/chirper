import { FC, useEffect, useRef, useCallback } from "react";
import Chirp, { ChirpData } from "./Chirp";

interface ChirpListProps {
  chirps: ChirpData[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const ChirpList: FC<ChirpListProps> = ({ 
  chirps, 
  isLoading, 
  isLoadingMore, 
  error, 
  hasMore, 
  onLoadMore 
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
        onLoadMore?.();
      }
    },
    [hasMore, isLoading, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    
    if (currentRef) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      });
      
      observerRef.current.observe(currentRef);
    }
    
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [handleObserver]);

  if (isLoading && chirps.length === 0) {
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
      
      {hasMore && (
        <div ref={loadMoreRef} className="text-center p-4">
          {isLoadingMore ? "Loading more chirps..." : ""}
        </div>
      )}
    </div>
  );
};

export default ChirpList;
