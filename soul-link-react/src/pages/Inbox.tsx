import type { Conversation, Message, Persona } from "../types/models";

type InboxProps = {
    // All conversation threads in the app
    conversations: Conversation[];

    //  the currently open conversation
    activeConversation: Conversation | null;

    // Messages that belong to the active conversation
    activeMessages: Message[];

    // the currently active persona sending messages
    activePersona: Persona | null;

    // all personas so we can choose a recipient
    personas: Persona[];

    // selected recipient when starting a new conversation
    selectedRecipientId: number | null;

    // controlled input value for the message composer
    messageInput: string;

    // Handlers fromLayout.tsx

    // called when the user selects a conversation
    onSelectConversation: (id: number) => void;

    // called when a recipient is selected
    onRecipientChange: (id: number | null) => void;
    
    // called when a persona starts a conversation with another persona
    onStartConversation: () => void;

    // called when the user types into the composer
    onMessageInputChange: (value: string) => void;

    // called when the user send a message
    onSendMessage: () => void;


};

function Inbox({
    conversations,
    activeConversation,
    activeMessages,
    activePersona,
    personas,
    selectedRecipientId,
    messageInput,
    onSelectConversation,
    onRecipientChange,
    onStartConversation,
    onMessageInputChange,
    onSendMessage,
}: InboxProps) {
    // build a list of possible recipients by excluding the active persona
    const availableRecipients = activePersona
    ? personas.filter((persona) => persona.id !== activePersona.id)
    : [];

    // helper to find the other person in a conversation.
    // since direct messages currently only have 2 participants,
    // we find the participant whose id is not the matching active persona


    function getOtherParticipantName(conversation: Conversation) {
        if (!activePersona) return "Unknown";

        const otherParticipantId = conversation.participantIds.find(
            (id) => id !== activePersona.id
        );

        const otherPersona = personas.find(
        (persona) => persona.id === otherParticipantId
        );

        return otherPersona ? otherPersona.name : "Unknown";
    }

    return (
    <section>
      <h2>Inbox</h2>

      {/* Start a new direct-message conversation */}
      <div>
        <h3>Start Conversation</h3>

        {!activePersona ? (
          <p>Select an active persona before creating a conversation.</p>
        ) : availableRecipients.length === 0 ? (
          <p>Create another persona first so there is someone to message.</p>
        ) : (
          <>
            <p>Sending as: {activePersona.name}</p>

            <select
              value={selectedRecipientId ?? ""}
              onChange={(e) =>
                onRecipientChange(
                  e.target.value ? Number(e.target.value) : null
                )
              }
            >
              <option value="">Choose a persona</option>

              {availableRecipients.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>

            <button onClick={onStartConversation}>
              Start Conversation
            </button>
          </>
        )}
      </div>

      {/* Conversation list */}
      <div>
        <h3>Conversations</h3>

        {conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              style={{ display: "block", marginBottom: "8px" }}
            >
              With: {getOtherParticipantName(conversation)}
              {conversation.lastMessage
                ? ` — ${conversation.lastMessage}`
                : " — No messages yet"}
            </button>
          ))
        )}
      </div>

      {/* Active chat thread */}
      <div>
        <h3>Active Chat</h3>

        {!activeConversation ? (
          <p>Select a conversation to view messages.</p>
        ) : activeMessages.length === 0 ? (
          <p>No messages in this conversation yet.</p>
        ) : (
          activeMessages.map((message) => {
            const sender = personas.find(
              (persona) => persona.id === message.senderPersonaId
            );

            return (
              <article key={message.id} style={{ marginBottom: "12px" }}>
                <p>
                  <strong>{sender ? sender.name : "Unknown"}:</strong>{" "}
                  {message.text}
                </p>
                <small>{message.createdAt}</small>
              </article>
            );
          })
        )}
      </div>

      {/* Message composer */}
      <div>
        <h3>Send Message</h3>

        {!activePersona ? (
          <p>Select an active persona before sending messages.</p>
        ) : !activeConversation ? (
          <p>Open a conversation first.</p>
        ) : (
          <>
            <p>Sending as: {activePersona.name}</p>

            <input
              type="text"
              placeholder="Write a message..."
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
            />

            <button onClick={onSendMessage}>Send</button>
          </>
        )}
      </div>
    </section>
  );
}

export default Inbox;