
// Import the feed ui
import MomentsFeed from "../components/MomentsFeed";
import type { Moment } from "../types/models";

// define props for home component
type HomeProps = {
    // array of moments to display
    moments: Moment[];

    // function to delete a moment
    onDelete: (id: number) => void;
};

// home page component

function Home({moments, onDelete}: HomeProps) {
    return (
        <section>
            <h2>Home</h2>
            <MomentsFeed moments={moments} onDelete={onDelete} />
        </section>
    );
}

export default Home;