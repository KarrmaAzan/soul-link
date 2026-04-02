import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Conversation, Message, Persona } from "../types/models";

type InboxProps = {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeMessages: Message[];
  activePersona: Persona | null;
  personas: Persona[];
  selectedRecipientId: number | null;
  messageInput: string;
  onSelectConversation: (id: number) => void;
  onRecipientChange: (id: number | null) => void;
  onStartConversation: () => void;
  onMessageInputChange: (value: string) => void;
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
  const availableRecipients = activePersona
    ? personas.filter((persona) => persona.id !== activePersona.id)
    : [];

  function getOtherParticipant(conversation: Conversation) {
    if (!activePersona) return null;

    const otherParticipantId = conversation.participantIds.find(
      (id) => id !== activePersona.id
    );

    return personas.find((persona) => persona.id === otherParticipantId) || null;
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Inbox
        </Typography>
        <Typography color="text.secondary">
          Persona-scoped conversations and messages.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Start Conversation</Typography>

          {!activePersona ? (
            <Typography color="text.secondary">
              Select an active persona first.
            </Typography>
          ) : availableRecipients.length === 0 ? (
            <Typography color="text.secondary">
              No other personas available yet.
            </Typography>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                Sending as <strong>{activePersona.name}</strong>
              </Typography>

              <TextField
                select
                fullWidth
                label="Choose a persona"
                value={selectedRecipientId ?? ""}
                onChange={(e) =>
                  onRecipientChange(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <MenuItem value="">Choose a persona</MenuItem>
                {availableRecipients.map((persona) => (
                  <MenuItem key={persona.id} value={persona.id}>
                    {persona.name}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="contained" onClick={onStartConversation}>
                Start Conversation
              </Button>
            </>
          )}
        </Stack>
      </Card>

      <Stack spacing={2}>
        <Typography variant="h6">Conversations</Typography>

        {conversations.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography color="text.secondary">
              No conversations yet.
            </Typography>
          </Card>
        ) : (
          <Stack spacing={1.25}>
            {conversations.map((conversation) => {
              const otherPersona = getOtherParticipant(conversation);
              const isActive = activeConversation?.id === conversation.id;

              return (
                <Card
                  key={conversation.id}
                  elevation={0}
                  onClick={() => onSelectConversation(conversation.id)}
                  sx={{
                    p: 1.75,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: isActive ? "primary.main" : "divider",
                    cursor: "pointer",
                    transition: "0.2s ease",
                    backgroundColor: isActive ? "action.selected" : "background.paper",
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar>
                      {otherPersona?.name?.charAt(0).toUpperCase() || "?"}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {otherPersona?.name || "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {conversation.lastMessage || "No messages yet"}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>

      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Active Chat</Typography>

          {!activeConversation ? (
            <Typography color="text.secondary">
              Select a conversation to view messages.
            </Typography>
          ) : (
            <>
              <Box
                sx={{
                  maxHeight: 360,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                <Stack spacing={1.25}>
                  {activeMessages.length === 0 ? (
                    <Typography color="text.secondary">
                      No messages in this conversation yet.
                    </Typography>
                  ) : (
                    activeMessages.map((message) => {
                      const isMine = message.senderPersonaId === activePersona?.id;
                      const sender = personas.find(
                        (persona) => persona.id === message.senderPersonaId
                      );

                      return (
                        <Stack
                          key={message.id}
                          alignItems={isMine ? "flex-end" : "flex-start"}
                        >
                          <Box
                            sx={{
                              maxWidth: "78%",
                              px: 1.5,
                              py: 1.2,
                              borderRadius: 3,
                              backgroundColor: isMine
                                ? "primary.main"
                                : "action.hover",
                              color: isMine ? "primary.contrastText" : "text.primary",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mb: 0.5,
                                opacity: 0.8,
                                fontWeight: 600,
                              }}
                            >
                              {sender?.name || `Persona #${message.senderPersonaId}`}
                            </Typography>

                            <Typography variant="body2">
                              {message.text}
                            </Typography>
                          </Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, px: 0.5 }}
                          >
                            {new Date(message.createdAt).toLocaleString()}
                          </Typography>
                        </Stack>
                      );
                    })
                  )}
                </Stack>
              </Box>

              <Divider />

              {!activePersona ? (
                <Typography color="text.secondary">
                  Select an active persona before sending messages.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="Write a message..."
                    value={messageInput}
                    onChange={(e) => onMessageInputChange(e.target.value)}
                  />
                  <Button variant="contained" onClick={onSendMessage}>
                    Send
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

export default Inbox;