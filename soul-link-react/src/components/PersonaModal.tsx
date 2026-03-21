type PersonaModalProps = {
    // current value of the persona name input
    name: string;

    // current value of the personas niche input
    niche: string;

    //current value of the personas bio input
    bio: string;

    // update the personas name field in the layout state
    onNameChange: (value:string) => void;

    // updates the personas niche field in the layout state
    onNicheChange: (value: string) => void;

    // updates the personas bio field in the layout state
    onBioChange: (value: string) => void;

    // called when the user submits the persona form

    onCreate: () => void;

    // called when the user closes the modal
    onClose: () => void;
};

function PersonaModal({
    name,
    niche,
    bio,
    onNameChange,
    onNicheChange,
    onBioChange,
    onCreate,
    onClose,
}: PersonaModalProps) {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Create Persona</h2>

                <input 
                    type="text"
                    placeholder="Persona name"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                />

                <input 
                   type="text"
                   placeholder="Persona niche"
                   value={niche}
                   onChange={(e) => onNicheChange(e.target.value)}
                />

                <input 
                   type="text"
                   placeholder="Persona bio"
                   value={bio}
                   onChange={(e) => onBioChange(e.target.value)}
                />

                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onCreate}>Create Persona</button>
                </div>
            </div>
        </div>
    );
}

export default PersonaModal;