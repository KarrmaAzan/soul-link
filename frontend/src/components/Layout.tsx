import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";

import Header from "./Header";
import BottomNav from "./BottomNav";
// import CreateMenu from "./CreateMenu";
import MomentModal from "./MomentModal";

import Home from "../pages/Home";
import Sanctum from "../pages/Sanctum";
import World from "../pages/World";
import NotFound from "../pages/NotFound";
import Inbox from "../pages/Inbox";
import SoulLinks from "../pages/SoulLinks";

import type {
  Moment,
  Persona,
  Conversation,
  Message,
  SoulLink,
} from "../types/models";

import { useAuthStore } from "../store/authStore";
import { getMoments, createMoment } from "../api/momentApi";
import {
  getSoulLinks,
  createSoulLink,
  acceptSoulLink,
} from "../api/soulLinkApi";
import { getConversations, createConversation } from "../api/conversationApi";
import { getMessagesByConversation, createMessage } from "../api/messageApi";

function Layout() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const personas = (user?.personas ?? []) as Persona[];

  const [moments, setMoments] = useState<Moment[]>([]);
  const [momentInput, setMomentInput] = useState<string>("");
  const [, setMenuOpen] = useState<boolean>(false);
  const [momentModalOpen, setMomentModalOpen] = useState<boolean>(false);

  const [activePersonaId, setActivePersonaId] = useState<number | null>(null);

  const [soulLinks, setSoulLinks] = useState<SoulLink[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    null,
  );

  const activePersona =
    personas.find((persona) => persona.id === activePersonaId) || null;

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) || null;

  const activeMessages = activeConversation
    ? messages.filter(
        (message) => message.conversationId === activeConversation.id,
      )
    : [];

  useEffect(() => {
    setMoments([]);
    setSoulLinks([]);
    setConversations([]);
    setMessages([]);
    setActiveConversationId(null);
    setSelectedRecipientId(null);
    setActivePersonaId(null);
  }, [user?.id, token]);

  useEffect(() => {
    if (personas.length > 0 && activePersonaId === null) {
      setActivePersonaId(personas[0].id);
    }
  }, [personas, activePersonaId]);

  useEffect(() => {
    async function loadMoments() {
      if (!token || !activePersonaId) {
        setMoments([]);
        return;
      }

      try {
        const data = await getMoments(token, activePersonaId);
        setMoments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load moments:", err);
        setMoments([]);
      }
    }

    loadMoments();
  }, [token, activePersonaId]);

  useEffect(() => {
    async function loadSoulLinks() {
      if (!token || !activePersonaId) {
        setSoulLinks([]);
        return;
      }

      try {
        const data = await getSoulLinks(token, activePersonaId);
        setSoulLinks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load soul links:", err);
        setSoulLinks([]);
      }
    }

    loadSoulLinks();
  }, [token, activePersonaId]);

  useEffect(() => {
    async function loadConversations() {
      if (!token || !activePersonaId) {
        setConversations([]);
        return;
      }

      try {
        const data = await getConversations(token, activePersonaId);
        setConversations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setConversations([]);
      }
    }

    loadConversations();
  }, [token, activePersonaId]);

  useEffect(() => {
    async function loadMessages() {
      if (!token || !activeConversationId || !activePersonaId) {
        setMessages([]);
        return;
      }

      try {
        const data = await getMessagesByConversation(
          token,
          activeConversationId,
          activePersonaId,
        );
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessages([]);
      }
    }

    loadMessages();
  }, [token, activeConversationId, activePersonaId]);

  async function addMoment() {
    const text = momentInput.trim();

    if (!text || !activePersonaId || !token) return;

    try {
      const newMoment = await createMoment(token, {
        personaId: activePersonaId,
        text,
      });

      setMoments((prev) => [newMoment, ...prev]);
      setMomentInput("");
      setMomentModalOpen(false);
    } catch (err) {
      console.error("Failed to create moment:", err);
    }
  }

  function deleteMoment(id: number) {
    setMoments((prev) => prev.filter((m) => m.id !== id));
  }

  function switchPersona(id: number) {
    setActivePersonaId(id);
    setActiveConversationId(null);
    setMessages([]);
    setSelectedRecipientId(null);
  }

  async function sendSoulLinkRequest(recipientId: number) {
    if (!activePersonaId || !token) return;
    if (activePersonaId === recipientId) return;

    try {
      const newLink = await createSoulLink(token, {
        requesterPersonaId: activePersonaId,
        recipientPersonaId: recipientId,
      });

      setSoulLinks((prev) => [newLink, ...prev]);
    } catch (err) {
      console.error("Failed to create soul link:", err);
    }
  }

  async function acceptSoulLinkRequest(linkId: number) {
    if (!token || !activePersonaId) return;

    try {
      const updatedLink = await acceptSoulLink(token, linkId, activePersonaId);

      setSoulLinks((prev) =>
        prev.map((link) => (link.id === updatedLink.id ? updatedLink : link)),
      );
    } catch (err) {
      console.error("Failed to accept soul link:", err);
    }
  }

  function selectConversation(id: number) {
    setActiveConversationId(id);
  }

  async function startConversation() {
    if (!activePersonaId || !selectedRecipientId || !token) return;
    if (activePersonaId === selectedRecipientId) return;

    try {
      const conversation = await createConversation(token, {
        participantIds: [activePersonaId, selectedRecipientId],
      });

      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversation.id);
        return exists ? prev : [conversation, ...prev];
      });

      setActiveConversationId(conversation.id);
      setSelectedRecipientId(null);
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  }

  async function sendMessage() {
    const text = messageInput.trim();

    if (!text || !activeConversationId || !activePersonaId || !token) return;

    try {
      const newMessage = await createMessage(token, {
        conversationId: activeConversationId,
        senderPersonaId: activePersonaId,
        text,
      });

      setMessages((prev) => [...prev, newMessage]);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                lastMessage: text,
                updatedAt: newMessage.createdAt,
              }
            : c,
        ),
      );

      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  // function openMenu() {
  //   setMenuOpen(true);
  // }

  // function closeMenu() {
  //   setMenuOpen(false);
  // }

  function openMomentModal() {
    setMenuOpen(false);
    setMomentModalOpen(true);
  }

  function openPersonaSetup() {
    setMenuOpen(false);
    navigate("/persona-setup");
  }

  function goLive() {
  navigate("/world");
}

  function closeMomentModal() {
    setMomentModalOpen(false);
    setMomentInput("");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 1.5, sm: 2.5 },
        pt: -1,
        pb: 12,
      }}
    >
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
          }}
        >
          <Header />

          <Box
            component="main"
            sx={{
              width: "100%",
            }}
          >
            <Routes>
     <Route
  path="/"
  element={
    <Home
      key={activePersonaId ?? "no-persona"}
      activePersona={activePersona}
      moments={moments}
      onDelete={deleteMoment}
    />
  }
/>
              <Route
                path="/sanctum"
                element={
                  <Sanctum
                    activePersona={activePersona}
                    moments={moments}
                    personas={personas}
                    soulLinks={soulLinks}
                    onSwitchPersona={switchPersona}
                    onOpenSoulLinks={() => {
                      console.log("open soul links");
                    }}
                  />
                }
              />
              <Route
                path="/soul-links"
                element={
                  <SoulLinks
                    activePersona={activePersona}
                    personas={personas}
                    soulLinks={soulLinks}
                    onSendSoulLinkRequest={sendSoulLinkRequest}
                    onAcceptSoulLinkRequest={acceptSoulLinkRequest}
                  />
                }
              />
              <Route path="/world" element={<World />} />
              <Route
                path="/inbox"
                element={
                  <Inbox
                    conversations={conversations}
                    activeConversation={activeConversation}
                    activeMessages={activeMessages}
                    activePersona={activePersona}
                    personas={personas}
                    selectedRecipientId={selectedRecipientId}
                    messageInput={messageInput}
                    onSelectConversation={selectConversation}
                    onRecipientChange={setSelectedRecipientId}
                    onStartConversation={startConversation}
                    onMessageInputChange={setMessageInput}
                    onSendMessage={sendMessage}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
{/* 
        {menuOpen && (
          <CreateMenu
            onCreateMoment={openMomentModal}
            onCreatePersona={openPersonaSetup}
            onClose={closeMenu}
          />
        )} */}

        {momentModalOpen && (
          <MomentModal
            value={momentInput}
            onChange={setMomentInput}
            onPost={addMoment}
            onClose={closeMomentModal}
            activePersona={activePersona}
          />
        )}

        <BottomNav
  onCreateMoment={openMomentModal}
  onCreatePersona={openPersonaSetup}
  onGoLive={goLive}
/>
      </Container>
    </Box>
  );
}

export default Layout;
