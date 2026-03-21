import type { Persona } from "../types/models";

type MomentsModalProps = {
    //current textarea value
    value:string;

    //function to update textarea value
    onChange: (value: string) => void;

    // function to submit the moment
    onPost: () => void;

    //function to close the modal

    onClose: () => void;

    // Active persona so the ui can show who is posting
    activePersona: Persona | null;
};


// modal like composer for creating a moment

function MomentModal({value, onChange, onPost, onClose, activePersona,}: MomentsModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Create a Moment</h2>

                {/* show which persona is posting */}
                {activePersona ? (
                    <p>Posting as: {activePersona.name}</p>
                ) : (
                    <p>No active persona selected.</p>
                )}

                <textarea 
                   placeholder="write a moment..."
                   value={value}
                   onChange={(event) => onChange(event.target.value)}
                />

                <div className="modal-actions">
                     <button onClick={onClose}>Cancel</button>

                     {/* Disable posting if there is no active persona or no text */}
                     <button onClick={onPost} disabled={!activePersona || !value.trim()}>
                        Post
                     </button>
                </div>
            </div>
        </div>

    );
}

export default MomentModal;