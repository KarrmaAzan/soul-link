// DEfine the shaoe of one moment object

import type { Moment } from "../types/models";

// Define the props for the card component

type MomentCardProps = {
    // the moment to display
    moment: Moment;

    // function used to delete this moment 

    onDelete: (id:number) => void;
};

// Component that renders one single moment card

function MomentCard({moment, onDelete}: MomentCardProps) {
    return (
        // main wrapper for the moment card
  <article className="moment-card">
    <h3>{moment.author}</h3>
    <p>{moment.text}</p>
    <small>{moment.createdAt}</small>

    {/* Placeholder analytics shown in the feed too. 
    These are static for now until the real interaction logic is added. */}
    <div>
        <span>Likes: {moment.likes}</span>
        <span style={{marginLeft: "12px"}}>Views: {moment.views}</span>
    </div>

    <div>
        <button onClick={() => onDelete(moment.id)}>Delete</button>
    </div>
  </article>
    );
}

export default MomentCard;