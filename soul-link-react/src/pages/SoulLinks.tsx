import { useState } from "react";
import type { Persona, SoulLink } from "../types/models";

type SoulLinkProps = {
    // persona currently active
    activePersona: Persona | null

    // All personas in the app so we can search/filter them
    personas: Persona[];

    // All soul link relationships
    soulLinks: SoulLink[];

    // handler to send a new soul link request
    onSendSoulLinkRequest: (recipientId: number) => void;

    // handler to accept pending requests
    onAcceptSoulLinkRequest: (linkId: number) => void;

};

function SoulLinks({
    activePersona,
    personas,
    soulLinks,
    onSendSoulLinkRequest,
    onAcceptSoulLinkRequest,
}: SoulLinkProps) {
    // local search state for filtering personas by name
    const [searchTerm, setSearchTerm] = useState("");

    // if there is an active persona, do not show that persona in search results
    const searchablePersonas = activePersona
    ? personas.filter((persona) => persona.id !== activePersona.id)
    : [];

    // simple local search: only keep personas whose names include the typed text
    const filteredPersonas = searchablePersonas.filter((persona) => 
    persona.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// pending requests sent to the active persona
    const pendingRequests = activePersona ? soulLinks.filter((link) =>
    link.recipientPersonaId === activePersona.id && link.status === "pending") : [];

    // accepted soul links involving active persona
    const acceptedLinks = activePersona 
       ? soulLinks.filter(
        (link) =>
        link.status === "accepted" && 
        (link.requesterPersonaId === activePersona.id ||
         link.recipientPersonaId === activePersona.id)
      ) : [];


      // Helper: given a soul link, get the "other" persona in that relationship

      function getOtherPersonaName(link:SoulLink) {
        if (!activePersona) return "Unknown";

        const otherPersonaId = 
        link.requesterPersonaId === activePersona.id
        ? link.recipientPersonaId 
        : link.requesterPersonaId;

        const otherPersona = personas.find((persona) => persona.id === otherPersonaId);
        return otherPersona ? otherPersona.name : "Unknown";
      }

      // Helper: check if the active persona already has any soul link relationship
      // (pending or accepted) with the target persona
      function hasExistingSoulLink(targetPersonaId: number) {
        if (!activePersona) return false;

        return soulLinks.some(
            (link) => 
            (link.requesterPersonaId === activePersona.id && 
                link.recipientPersonaId === targetPersonaId) ||
                (link.requesterPersonaId === targetPersonaId &&
                    link.recipientPersonaId === activePersona.id
                )
        )
      }

      return (
    <section>
      <h2>Soul Links</h2>

      {!activePersona ? (
        <p>Select an active persona before managing Soul Links.</p>
      ) : (
        <>
          <p>Managing links as: <strong>{activePersona.name}</strong></p>

          {/* Simple local search */}
          <div>
            <h3>Find Personas</h3>

            <input
              type="text"
              placeholder="Search personas by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredPersonas.length === 0 ? (
              <p>No personas match your search.</p>
            ) : (
              filteredPersonas.map((persona) => (
                <div key={persona.id} style={{ marginBottom: "8px" }}>
                  <p>
                    <strong>{persona.name}</strong> — {persona.niche}
                  </p>

                  <button
                    onClick={() => onSendSoulLinkRequest(persona.id)}
                    disabled={hasExistingSoulLink(persona.id)}
                  >
                    {hasExistingSoulLink(persona.id)
                      ? "Already Linked / Pending"
                      : "Send Soul Link Request"}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pending requests */}
          <div>
            <h3>Pending Requests</h3>

            {pendingRequests.length === 0 ? (
              <p>No pending Soul Link requests.</p>
            ) : (
              pendingRequests.map((link) => {
                const requester = personas.find(
                  (persona) => persona.id === link.requesterPersonaId
                );

                return (
                  <div key={link.id} style={{ marginBottom: "8px" }}>
                    <p>
                      <strong>{requester ? requester.name : "Unknown"}</strong> wants to Soul Link.
                    </p>
                    <button onClick={() => onAcceptSoulLinkRequest(link.id)}>
                      Accept
                    </button>
                  </div>
                );
              })
            )}
          </div>


3           {/* Accepted links */}
          <div>
            <h3>Accepted Soul Links</h3>

            {acceptedLinks.length === 0 ? (
              <p>No accepted Soul Links yet.</p>
            ) : (
              acceptedLinks.map((link) => (
                <p key={link.id}>
                  Linked with: <strong>{getOtherPersonaName(link)}</strong>
                </p>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default SoulLinks;
