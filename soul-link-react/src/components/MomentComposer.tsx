// Define the shape of the props this component expects
type MomentComposerProps = {
    // the current value in the textarea
    value: string;

    //function that updates the textarea value
    onChange: (value: string) => void;

    //function that runs when user clicks the post button
    onPost: () => void;
};

//MomentComposer is the UI for writing a new moment.

function MomentComposer({value, onChange, onPost}: MomentComposerProps) {
    return (
        //wrapper section for the composer UI
        <section className="composer">
            {/*section title*/}
            <h2>Create a Moment</h2>
            
            {/* Controlled textarea */}
            <textarea
                placeholder="Write a moment..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                />

                {/* Button to post the moment */}
                <button onClick={onPost}>Post Moment</button>
        </section>
    );
}

export default MomentComposer;