import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import BottomNav from "./BottomNav";
import MomentModal from "./MomentModal";
import Home from "../pages/Home";
import Sanctum from "../pages/Sanctum";
import World from "../pages/World";
import NotFound from "../pages/NotFound";
import Inbox from "../pages/Inbox";
import SoulLinks from "../pages/SoulLinks";
import type { Moment, Persona, Conversation, Message, SoulLink } from "../types/models";
import { useAuthStore } from "../store/authStore";
import { getMoments, createMoment } from "../api/momentApi";
import { getSoulLinks, createSoulLink, acceptSoulLink } from "../api/soulLinkApi";
import { getConversations, createConversation } from "../api/conversationApi";
import { getMessagesByConversation, createMessage } from "../api/messageApi";
import {
  DEMO_MODE,
  demoConversations,
  demoMessages,
  demoMoments,
  demoSoulLinks,
} from "../demoData";

export default function Layout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const personas = (user?.personas ?? []) as Persona[];

  const [moments, setMoments] = useState<Moment[]>(() => (DEMO_MODE ? demoMoments : []));
  const [momentInput, setMomentInput] = useState("");
  const [momentModalOpen, setMomentModalOpen] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<number | null>(null);
  const [soulLinks, setSoulLinks] = useState<SoulLink[]>(() => (DEMO_MODE ? demoSoulLinks : []));
  const [conversations, setConversations] = useState<Conversation[]>(() => (DEMO_MODE ? demoConversations : []));
  const [messages, setMessages] = useState<Message[]>(() => (DEMO_MODE ? demoMessages : []));
  const [activeConversationId, setActiveConversationId] = useState<number | null>(DEMO_MODE ? demoConversations[0]?.id ?? null : null);
  const [messageInput, setMessageInput] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);

  const resolvedActivePersonaId = personas.some((persona) => persona.id === activePersonaId)
    ? activePersonaId
    : personas[0]?.id ?? null;
  const activePersona = personas.find((persona) => persona.id === resolvedActivePersonaId) || null;
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) || null;
  const activeMessages = activeConversation
    ? messages.filter((message) => message.conversationId === activeConversation.id)
    : [];

  useEffect(() => {
    async function loadMoments() {
      if (DEMO_MODE) return;
      if (!token || !resolvedActivePersonaId) return;
      try {
        const data = await getMoments(token, resolvedActivePersonaId);
        setMoments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load moments:", error);
        setMoments([]);
      }
    }
    void loadMoments();
  }, [token, resolvedActivePersonaId]);

  useEffect(() => {
    async function loadSoulLinks() {
      if (DEMO_MODE) return;
      if (!token || !resolvedActivePersonaId) return;
      try {
        const data = await getSoulLinks(token, resolvedActivePersonaId);
        setSoulLinks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load soul links:", error);
        setSoulLinks([]);
      }
    }
    void loadSoulLinks();
  }, [token, resolvedActivePersonaId]);

  useEffect(() => {
    async function loadConversations() {
      if (DEMO_MODE) return;
      if (!token || !resolvedActivePersonaId) return;
      try {
        const data = await getConversations(token, resolvedActivePersonaId);
        setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setConversations([]);
      }
    }
    void loadConversations();
  }, [token, resolvedActivePersonaId]);

  useEffect(() => {
    async function loadMessages() {
      if (DEMO_MODE) return;
      if (!token || !activeConversationId || !resolvedActivePersonaId) return;
      try {
        const data = await getMessagesByConversation(token, activeConversationId, resolvedActivePersonaId);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessages([]);
      }
    }
    void loadMessages();
  }, [token, activeConversationId, resolvedActivePersonaId]);

  async function addMoment() {
    const text = momentInput.trim();
    if (!text || !resolvedActivePersonaId || !token) return;
    if (DEMO_MODE) {
      setMoments((current) => [{ id: Date.now(), personaId: resolvedActivePersonaId, personaName: activePersona?.name || "You", text, createdAt: new Date().toISOString(), likes: 0, views: 0 }, ...current]);
      setMomentInput("");
      setMomentModalOpen(false);
      return;
    }
    try {
      const newMoment = await createMoment(token, { personaId: resolvedActivePersonaId, text });
      setMoments((current) => [newMoment, ...current]);
      setMomentInput("");
      setMomentModalOpen(false);
    } catch (error) {
      console.error("Failed to create moment:", error);
    }
  }

  function switchPersona(id: number) {
    setActivePersonaId(id);
    setActiveConversationId(null);
    setMessages([]);
    setSelectedRecipientId(null);
  }

  async function sendSoulLinkRequest(recipientId: number) {
    if (!resolvedActivePersonaId || !token || resolvedActivePersonaId === recipientId) return;
    if (DEMO_MODE) {
      setSoulLinks((current) => [{ id: Date.now(), requesterPersonaId: resolvedActivePersonaId, recipientPersonaId: recipientId, status: "pending", createdAt: new Date().toISOString() }, ...current]);
      return;
    }
    try {
      const newLink = await createSoulLink(token, {
        requesterPersonaId: resolvedActivePersonaId,
        recipientPersonaId: recipientId,
      });
      setSoulLinks((current) => [newLink, ...current]);
    } catch (error) {
      console.error("Failed to create soul link:", error);
    }
  }

  async function acceptSoulLinkRequest(linkId: number) {
    if (!token || !resolvedActivePersonaId) return;
    if (DEMO_MODE) {
      setSoulLinks((current) => current.map((link) => (link.id === linkId ? { ...link, status: "accepted" } : link)));
      return;
    }
    try {
      const updatedLink = await acceptSoulLink(token, linkId, resolvedActivePersonaId);
      setSoulLinks((current) => current.map((link) => (link.id === updatedLink.id ? updatedLink : link)));
    } catch (error) {
      console.error("Failed to accept soul link:", error);
    }
  }

  async function startConversation() {
    if (!resolvedActivePersonaId || !selectedRecipientId || !token) return;
    if (resolvedActivePersonaId === selectedRecipientId) return;
    if (DEMO_MODE) {
      const existing = conversations.find((conversation) => conversation.participantIds.includes(resolvedActivePersonaId) && conversation.participantIds.includes(selectedRecipientId));
      if (existing) {
        setActiveConversationId(existing.id);
      } else {
        const conversation = { id: Date.now(), participantIds: [resolvedActivePersonaId, selectedRecipientId], lastMessage: "", updatedAt: new Date().toISOString() };
        setConversations((current) => [conversation, ...current]);
        setActiveConversationId(conversation.id);
      }
      setSelectedRecipientId(null);
      return;
    }
    try {
      const conversation = await createConversation(token, {
        participantIds: [resolvedActivePersonaId, selectedRecipientId],
      });
      setConversations((current) =>
        current.some((item) => item.id === conversation.id) ? current : [conversation, ...current],
      );
      setActiveConversationId(conversation.id);
      setSelectedRecipientId(null);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }

  async function sendMessage() {
    const text = messageInput.trim();
    if (!text || !activeConversationId || !resolvedActivePersonaId || !token) return;
    if (DEMO_MODE) {
      const createdAt = new Date().toISOString();
      setMessages((current) => [...current, { id: Date.now(), conversationId: activeConversationId, senderPersonaId: resolvedActivePersonaId, text, createdAt }]);
      setConversations((current) => current.map((conversation) => conversation.id === activeConversationId ? { ...conversation, lastMessage: text, updatedAt: createdAt } : conversation));
      setMessageInput("");
      return;
    }
    try {
      const newMessage = await createMessage(token, {
        conversationId: activeConversationId,
        senderPersonaId: resolvedActivePersonaId,
        text,
      });
      setMessages((current) => [...current, newMessage]);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeConversationId
            ? { ...conversation, lastMessage: text, updatedAt: newMessage.createdAt }
            : conversation,
        ),
      );
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  function closeMomentModal() {
    setMomentModalOpen(false);
    setMomentInput("");
  }

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", pb: { xs: 12, md: 5 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2.5 }, pt: { xs: 1.25, sm: 2 } }}>
        <Header
          activePersona={activePersona}
          onCreateMoment={() => setMomentModalOpen(true)}
          onCreatePersona={() => navigate("/persona-setup")}
        />

        <Box component="main" className="page-enter" sx={{ pt: { xs: 4, sm: 5.5 }, pb: 4 }}>
          <Routes>
            <Route path="/" element={<Home activePersona={activePersona} personas={personas} soulLinks={soulLinks} moments={moments} onDelete={(id) => setMoments((current) => current.filter((moment) => moment.id !== id))} onSwitchPersona={switchPersona} onCreateMoment={() => setMomentModalOpen(true)} onCreatePersona={() => navigate("/persona-setup")} />} />
            <Route path="/sanctum" element={<Sanctum activePersona={activePersona} moments={moments} personas={personas} soulLinks={soulLinks} onSwitchPersona={switchPersona} onOpenSoulLinks={() => navigate("/soul-links")} />} />
            <Route path="/soul-links" element={<SoulLinks activePersona={activePersona} personas={personas} soulLinks={soulLinks} onSendSoulLinkRequest={sendSoulLinkRequest} onAcceptSoulLinkRequest={acceptSoulLinkRequest} />} />
            <Route path="/world" element={<World />} />
            <Route path="/inbox" element={<Inbox conversations={conversations} activeConversation={activeConversation} activeMessages={activeMessages} activePersona={activePersona} personas={personas} selectedRecipientId={selectedRecipientId} messageInput={messageInput} onSelectConversation={setActiveConversationId} onRecipientChange={setSelectedRecipientId} onStartConversation={startConversation} onMessageInputChange={setMessageInput} onSendMessage={sendMessage} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        <MomentModal value={momentInput} onChange={setMomentInput} onPost={addMoment} onClose={closeMomentModal} activePersona={activePersona} open={momentModalOpen} />
        <BottomNav onCreateMoment={() => setMomentModalOpen(true)} onCreatePersona={() => navigate("/persona-setup")} onGoLive={() => navigate("/world")} />
      </Container>
    </Box>
  );
}
