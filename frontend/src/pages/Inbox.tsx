import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
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

export default function Inbox({
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
  const availableRecipients = activePersona ? personas.filter((persona) => persona.id !== activePersona.id) : [];

  function getOtherParticipant(conversation: Conversation) {
    if (!activePersona) return null;
    const otherId = conversation.participantIds.find((id) => id !== activePersona.id);
    return personas.find((persona) => persona.id === otherId) || null;
  }

  const activePartner = activeConversation ? getOtherParticipant(activeConversation) : null;

  return (
    <Stack spacing={{ xs: 3.5, md: 4.5 }}>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }} justifyContent="space-between" spacing={1.5}>
        <Box>
          <Typography variant="overline" color="info.main">Private conversation</Typography>
          <Typography variant="h2">Inbox</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Speak from the right persona, in the right context.</Typography>
        </Box>
        {activePersona && <Chip avatar={<Avatar>{activePersona.name.charAt(0).toUpperCase()}</Avatar>} label={`Messaging as ${activePersona.name}`} variant="outlined" sx={{ height: 44, px: .5 }} />}
      </Stack>

      <Card sx={{ borderRadius: 4, overflow: "hidden", p: 0 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "340px minmax(0,1fr)" }, minHeight: { md: 650 } }}>
          <Box sx={{ borderRight: { md: "1px solid rgba(235,229,255,.09)" }, borderBottom: { xs: "1px solid rgba(235,229,255,.09)", md: 0 }, background: "rgba(7,8,18,.28)" }}>
            <Stack spacing={2} sx={{ p: 2.25 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box><Typography variant="h6">Conversations</Typography><Typography variant="caption" color="text.secondary">{conversations.length} in this orbit</Typography></Box>
                <Box sx={{ width: 38, height: 38, borderRadius: 2.2, display: "grid", placeItems: "center", color: "primary.light", background: "rgba(169,139,255,.09)" }}><ForumRoundedIcon fontSize="small" /></Box>
              </Stack>

              {availableRecipients.length > 0 && (
                <Box sx={{ p: 1.5, borderRadius: 2.75, border: "1px solid rgba(235,229,255,.08)", background: "rgba(255,255,255,.02)" }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={.75} alignItems="center"><AddCommentRoundedIcon sx={{ fontSize: 17, color: "secondary.light" }} /><Typography variant="caption" sx={{ fontWeight: 750 }}>Start a conversation</Typography></Stack>
                    <TextField
                      select
                      size="small"
                      value={selectedRecipientId ?? ""}
                      onChange={(event) => onRecipientChange(event.target.value ? Number(event.target.value) : null)}
                      fullWidth
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>Choose a persona</MenuItem>
                      {availableRecipients.map((persona) => <MenuItem key={persona.id} value={persona.id}>{persona.name} · {persona.niche}</MenuItem>)}
                    </TextField>
                    <Button size="small" variant="outlined" disabled={!selectedRecipientId} onClick={onStartConversation}>Open thread</Button>
                  </Stack>
                </Box>
              )}

              <Divider />
              {conversations.length === 0 ? (
                <Stack alignItems="center" textAlign="center" spacing={1} sx={{ py: 4, px: 2 }}><AddCommentRoundedIcon sx={{ color: "text.secondary" }} /><Typography variant="body2" color="text.secondary">No conversations yet. Choose a persona above to begin.</Typography></Stack>
              ) : (
                <Stack spacing={.75}>
                  {conversations.map((conversation, index) => {
                    const otherPersona = getOtherParticipant(conversation);
                    const active = activeConversation?.id === conversation.id;
                    const gradient = index % 2 ? "linear-gradient(145deg,#287C79,#6862CA)" : "linear-gradient(145deg,#7659C9,#B85C7B)";
                    return (
                      <Box
                        key={conversation.id}
                        component="button"
                        onClick={() => onSelectConversation(conversation.id)}
                        sx={{
                          width: "100%",
                          p: 1.25,
                          borderRadius: 2.5,
                          border: "1px solid",
                          borderColor: active ? "rgba(169,139,255,.34)" : "transparent",
                          color: "text.primary",
                          textAlign: "left",
                          cursor: "pointer",
                          background: active ? "rgba(169,139,255,.10)" : "transparent",
                          "&:hover": { background: "rgba(255,255,255,.035)" },
                        }}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar sx={{ width: 43, height: 43, fontSize: ".95rem", fontWeight: 750, background: gradient }}>{otherPersona?.name.charAt(0).toUpperCase() || "?"}</Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}><Stack direction="row" justifyContent="space-between" spacing={1}><Typography variant="body2" sx={{ fontWeight: 750 }} noWrap>{otherPersona?.name || "Unknown"}</Typography><Typography variant="caption" color="text.secondary">{new Date(conversation.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}</Typography></Stack><Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>{conversation.lastMessage || "A new conversation"}</Typography></Box>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Box>

          <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", minHeight: { xs: 520, md: 650 } }}>
            {!activeConversation ? (
              <Stack sx={{ flex: 1, p: 4 }} alignItems="center" justifyContent="center" textAlign="center" spacing={1.5}>
                <Box sx={{ width: 72, height: 72, borderRadius: "50%", display: "grid", placeItems: "center", color: "primary.light", background: "radial-gradient(circle,rgba(169,139,255,.17),rgba(169,139,255,.05))", border: "1px solid rgba(169,139,255,.17)" }}><ForumRoundedIcon /></Box>
                <Box><Typography variant="h5">Choose a conversation</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5, maxWidth: 340 }}>Your private threads live here, separated by the persona speaking.</Typography></Box>
              </Stack>
            ) : (
              <>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: { xs: 2, sm: 2.75 }, py: 2, borderBottom: "1px solid rgba(235,229,255,.09)" }}>
                  <Stack direction="row" spacing={1.25} alignItems="center"><Avatar sx={{ width: 42, height: 42, background: "linear-gradient(145deg,#287C79,#6862CA)", fontWeight: 750 }}>{activePartner?.name.charAt(0).toUpperCase() || "?"}</Avatar><Box><Typography sx={{ fontWeight: 750 }}>{activePartner?.name || "Conversation"}</Typography><Typography variant="caption" color="info.main">{activePartner?.niche || "Private thread"}</Typography></Box></Stack>
                  <Stack direction="row" spacing={.5} alignItems="center" color="text.secondary"><LockRoundedIcon sx={{ fontSize: 14 }} /><Typography variant="caption" sx={{ display: { xs: "none", sm: "block" } }}>Persona scoped</Typography></Stack>
                </Stack>

                <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, sm: 2.75 }, maxHeight: { xs: 430, md: 500 } }}>
                  {activeMessages.length === 0 ? (
                    <Stack alignItems="center" justifyContent="center" textAlign="center" sx={{ minHeight: 300 }}><Typography variant="h6">Start with something real.</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>This conversation is yours to begin.</Typography></Stack>
                  ) : (
                    <Stack spacing={1.6}>
                      {activeMessages.map((message) => {
                        const mine = message.senderPersonaId === activePersona?.id;
                        const sender = personas.find((persona) => persona.id === message.senderPersonaId);
                        return (
                          <Stack key={message.id} alignItems={mine ? "flex-end" : "flex-start"}>
                            <Box sx={{ maxWidth: { xs: "88%", sm: "72%" }, px: 1.75, py: 1.35, borderRadius: mine ? "20px 20px 6px 20px" : "20px 20px 20px 6px", background: mine ? "linear-gradient(135deg,#9B7DEB,#755BC7)" : "rgba(255,255,255,.055)", border: mine ? 0 : "1px solid rgba(235,229,255,.08)", color: mine ? "#0B0915" : "text.primary" }}><Typography variant="caption" sx={{ display: "block", mb: .35, fontWeight: 750, opacity: .72 }}>{sender?.name || `Persona ${message.senderPersonaId}`}</Typography><Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>{message.text}</Typography></Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: .4, px: .7 }}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  )}
                </Box>

                <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ p: { xs: 1.5, sm: 2 }, borderTop: "1px solid rgba(235,229,255,.09)", background: "rgba(7,8,18,.25)" }}>
                  <TextField fullWidth multiline maxRows={4} placeholder={`Message ${activePartner?.name || "this persona"}…`} value={messageInput} onChange={(event) => onMessageInputChange(event.target.value)} />
                  <IconButton onClick={onSendMessage} disabled={!messageInput.trim() || !activePersona} aria-label="Send message" sx={{ width: 50, height: 50, color: "primary.contrastText", background: "linear-gradient(145deg,#B49CFF,#896BDE)", "&:hover": { background: "linear-gradient(145deg,#C1ADFF,#9577E7)" }, "&.Mui-disabled": { background: "rgba(255,255,255,.05)" } }}><SendRoundedIcon /></IconButton>
                </Stack>
              </>
            )}
          </Box>
        </Box>
      </Card>
    </Stack>
  );
}
