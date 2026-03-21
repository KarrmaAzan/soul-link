// Import the single card component

import MomentCard from "./MomentCard";
import type { Moment } from "../types/models";

// Define the props for the feed component

type MomentsFeedProps = {
    // array of all moments to render
    moments: Moment[];

    // function used to delete a moment
    onDelete: (id: number) => void;
};

// Component that renders the full feed of moments

function MomentsFeed({moments, onDelete}: MomentsFeedProps) {
 return (
    <div>
        {moments.length === 0 ? (
            <p>No moments yet.</p>
        ) : ( 
            moments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  moment={moment}
                  onDelete={onDelete}
                />
            ))
        )}
    </div>
 );
}

export default MomentsFeed;