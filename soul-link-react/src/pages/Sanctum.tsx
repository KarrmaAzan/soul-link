// import the persona type so the prop is type correctly 
import type { Persona, Moment } from "../types/models";

// define the props this page receives from layout
type SanctumProps = {
    // the currently active persona, or null if none exist
    activePersona: Persona | null;

    // All moments passed down from the layout so we can filter
    // only the posts that belong to the active persona
    moments: Moment[];

    // All created personas so we can switch between them
    personas: Persona[];

    // Handler from a layout that changes the active persona
    onSwitchPersona: (id: number) => void;
};


function Sanctum({ activePersona, moments, personas, onSwitchPersona }: SanctumProps) {
    // only keep the moments that belong to the active persona
    const personaMoments = activePersona
         ? moments.filter((moment) => moment.personaId === activePersona.id)
         : [];

    return (
        <section>
            <h2>Sanctum</h2>
            {/* Temporary persona switcher for testing stage 3/4.
            Later this can move to the Sanctum header dropdown and BottomNav Long-press behavior. */}
            <div>
                <h3>Switch Persona</h3>

                {personas.length === 0 ? (
                    <p>No personas created yet.</p>
                ) : ( 
                    personas.map((persona) => (
                        <button
                             key={persona.id}
                             onClick={() => onSwitchPersona(persona.id)}
                             disabled={activePersona?.id === persona.id}
                             style={{ display: "block", marginBottom: "8px"}}
                            >
                                {activePersona?.id === persona.id
                                 ? `${persona.name} (Active)`
                                 : persona.name}
                            </button>
                    ))
                )}
            </div>
            {/* If there is an active persona, show its profile data */}
            {activePersona ? (
                <div>
                    <p><strong>Name:</strong>{activePersona.name}</p>
                    <p><strong>Niche</strong>{activePersona.niche}</p>
                    <p><strong>Bio</strong>{activePersona.bio}</p>
                </div>
            ) : (
                // if no persona exists yet, show an empty state
                <p>No active persona selected yet</p>
            )}

            <div>

                {/* Moments that belong only to the active persona */}
                <h3>Moments</h3>

                {!activePersona ? (
                    <p>Create and select a persona to view its moments.</p>
                ) : personaMoments.length === 0 ? (
                    <p>This persona has not posted any moments yet.</p>

                ) : (
                    personaMoments.map((moment) => (
                        <article key={moment.id} className="moment-card">
                            <p>{moment.text}</p>
                            <small>{moment.createdAt}</small>

                            <div>
                                <span>Likes: {moment.likes}</span>
                                <span style={{marginLeft: "12px"}}>
                                    Views: {moment.views}
                                </span>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}

export default Sanctum;