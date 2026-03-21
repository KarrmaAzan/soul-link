import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";


import Header from "./Header";
import BottomNav from "./BottomNav";
import ActionButton from "./ActionButton";
import CreateMenu from "./CreateMenu";
import MomentModal from "./MomentModal";
import PersonaModal from "./PersonaModal";


import Home from "../pages/Home";
import Sanctum from "../pages/Sanctum";
import World from "../pages/World";
import NotFound from "../pages/NotFound";
import Inbox from "../pages/Inbox";
import SoulLinks from "../pages/SoulLinks"

// Import shared models instead of redefining types in each file
import type {
     Moment,
     Persona, 
     Conversation, 
     Message,
     SoulLink,
    } from "../types/models"

    import { getPersonas, createPersona } from "../api/personaApi";
    import { getMoments, createMoment } from "../api/momentApi";
    import { getSoulLinks, createSoulLink, acceptSoulLink } from "../api/soulLinkApi"
    import { getConversations, createConversation } from "../api/conversationApi";
    import { getMessagesByConversation, createMessage } from "../api/messageApi";

// Layout wraps every page and owns shared app state
function Layout() {``
    //---------------------------------
    //  Moment State
    //---------------------------------

    // ALL moments for the current local frontend app
    const [moments, setMoments] = useState<Moment[]>([]);

    // controlled text input for the moment modal
    const [momentInput, setMomentInput] = useState<string>("");

    // controls whether the create menu is visible
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    // controls whether the moment composer modal is visible
    const [momentModalOpen, setMomentModalOpen] = useState<boolean>(false);

    //----------------------------------------------
    //  Persona State
    //----------------------------------------------

    // Store all created personas here because this state is shared
    const [personas, setPersonas] = useState<Persona[]>([]);

    // tracks which persona is currently active
    const [activePersonaId, setActivePersonaId] = useState<number | null>(null);

    // controls whether the personas creation modal is visible
    const [personaModalOpen, setPersonaModalOpen] = useState<boolean>(false);

    // controlled fields for creating a new persona
    const [personaName, setPersonaName] = useState<string>("");
    const [personaNiche, setPersonaNiche] = useState<string>("");
    const [personaBio, setPersonaBio] = useState<string>("");

    // derive the active persona from personas + activePersonaId
    // this avoids storing duplicate state
    const activePersona = Array.isArray(personas) ? personas.find((persona) => persona.id === activePersonaId) || null 
     : null

    //-------------------------------------------
    // Soul Link State
    //-------------------------------------------

    const [soulLinks, setSoulLinks] = useState<SoulLink[]>([]);

    //-------------------------------------------
    //  Messaging State
    //-------------------------------------------

    // stores all conversations in the inbox
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // stores all messages across all conversations
    const [messages, setMessages] = useState<Message[]>([]);

    // tracks which conversation is currently open in the inbox
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

    // controlled input for the message composer
    const [messageInput, setMessageInput] = useState<string>("");

    // tracks which persona the user selected as the recipent to a new message
    const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null)

    // derive the active conversation from the selected id
    const activeConversation =
       conversations.find((conversation) => conversation.id === activeConversationId) || null;

       // derive only the messages that belong to the active conversation

       const activeMessages = activeConversation
         ? messages.filter((message) => message.conversationId === activeConversation.id)
         : [];
    //------------------------------------
    // Load moments
    //------------------------------------
     useEffect(() => {
            async function loadMoments() {
             try {
                const data = await getMoments();
            setMoments(data);
             } catch (err) {
                console.error("Failed to load moments:", err);
             }
            }
             loadMoments();
            }, []);


    //------------------------------------
    // Load Personas
    //------------------------------------
    // Load personas from backend
   useEffect(() => {
  async function loadPersonas() {
    try {
      const data = await getPersonas();
      const safePersonas = Array.isArray(data) ? data : [];

      setPersonas(safePersonas);

      if (safePersonas.length > 0 && activePersonaId === null) {
        setActivePersonaId(safePersonas[0].id);
      }
    } catch (err) {
      console.error("Failed to load personas:", err);
      setPersonas([]);
    }
  }

  loadPersonas();
}, []);

    //------------------------------------
    // Load Soul Links
    //------------------------------------

   useEffect(() => {
  async function loadSoulLinks() {
    try {
      const data = await getSoulLinks();
      setSoulLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load soul links:", err);
      setSoulLinks([]);
    }
  }

  loadSoulLinks();
}, []);

   //------------------------------------
    // Load messages
    //------------------------------------

 useEffect(() => {1
  async function loadMessages() {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    try {
      const data = await getMessagesByConversation(activeConversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  }

  loadMessages();
}, [activeConversationId]);

//-------------------------------
// Load Conversations
//-------------------------------

  useEffect(() => {
  async function loadConversations() {
    try {
      const data = await getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setConversations([]);
    }
  }

  loadConversations();
}, []);


    //-------------------------------------------
    // Moment actions
    //-------------------------------------------

    // add a new moment to the feed

   async function addMoment() {
    const text = momentInput.trim();
    if (!text || !activePersona) return;

    try {
        const newMoment = await createMoment({
            personaId: activePersona.id,
            text,
        });

        setMoments([newMoment, ...moments]);
        setMomentInput("");
        setMomentModalOpen(false);
    } catch (err) {
        console.error("Failed to create moment:", err);
    }
   }

   function deleteMoment(id: number) {
    setMoments(moments.filter((m) => m.id !== id))
   }

    //---------------------------------------------
    // Persona actions
    //---------------------------------------------

    // create a new persona request
    async function addPersona() {
        const name = personaName.trim();
        const niche = personaNiche.trim();
        const bio = personaBio.trim();

        if (!name || !niche || !bio) return;
        if (personas.length>= 5) return;

        try {
            const newPersona = await createPersona({
                name,
                niche,
                bio
            });
            setPersonas([...personas, newPersona])

            if (activePersonaId === null) {
                setActivePersonaId(newPersona.id);
            }
            setPersonaName("");
            setPersonaNiche("");
            setPersonaBio("");
            setPersonaModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    }
    //  change which persona is active
    function switchPersona(id: number) {
        setActivePersonaId(id);
    }
    
//---------------------------------
  // Soul Link Actions
  //---------------------------------
  async function sendSoulLinkRequest(recipientId: number) {
    if (!activePersona) return;
    if (activePersona.id === recipientId) return;

    try {
      const newLink = await createSoulLink({
        requesterPersonaId: activePersona.id,
        recipientPersonaId: recipientId,
      });

      setSoulLinks([newLink, ...soulLinks]);
    } catch (err) {
      console.error("Failed to create soul link:", err);
    }
  }

  async function acceptSoulLinkRequest(linkId: number) {
    try {
      const updatedLink = await acceptSoulLink(linkId);

      const updatedSoulLinks = soulLinks.map((link) =>
        link.id === updatedLink.id ? updatedLink : link
      );

      setSoulLinks(updatedSoulLinks);
    } catch (err) {
      console.error("Failed to accept soul link:", err);
    }
  }


    //---------------------------
    // Messaging Actions
    //---------------------------
    function selectConversation(id: number) {
    setActiveConversationId(id);
  }

async function startConversation() {
  if (!activePersona || !selectedRecipientId) return;
  if (activePersona.id === selectedRecipientId) return;

  try {
    const conversation = await createConversation({
      participantIds: [activePersona.id, selectedRecipientId],
    });

    const exists = conversations.some((c) => c.id === conversation.id);

    if (!exists) {
      setConversations([conversation, ...conversations]);
    }

    setActiveConversationId(conversation.id);
    setSelectedRecipientId(null);
  } catch (err) {
    console.error("Failed to start conversation:", err);
  }
}

  async function sendMessage() {
    const text = messageInput.trim();
    if (!text || !activeConversation || !activePersona) return;

    try {
        const newMessage = await createMessage({
            conversationId: activeConversation.id,
            senderPersonaId: activePersona.id,
            text,
        });

        setMessages([...messages, newMessage]);

        const updatedConversations = conversations.map((c) => c.id === activeConversation.id
           ? {
            ...c,
            lastMessage: text,
            updatedAt: new Date().toLocaleString(),
           }
           :  c
        
        );

        setConversations(updatedConversations);
        setMessageInput("");
    } catch (err) {
        console.error("Failed to send message:", err)
    }
  }
    //---------------------------
    // UI controls
    //---------------------------

    // open the create menu
    function openMenu() {
        setMenuOpen(true);
    }

    // Close the create menu
    function closeMenu() {
        setMenuOpen(false);
    }

    // open the moment composer modal
    function openMomentModal() {
        setMenuOpen(false);
        setMomentModalOpen(true);
    }
    // close the moment composer modal
    function closeMomentModal() {
        setMomentModalOpen(false);
        setMomentInput("");
    }
    function openPersonaModal() {
        setMenuOpen(false);
        setPersonaModalOpen(true);
    }

    // close the persona creation modal and reset its fields
    function closePersonaModal() {
        setPersonaModalOpen(false);
        setPersonaName("");
        setPersonaNiche("");
        setPersonaBio("");
    }

    //-----------------------------
    // Render
    //-----------------------------

    return (
        <div className="app-shell">
            {/* Shared top header
                in stage 4 we will eventually have header receive personas and switching prop */}
            <Header />

            {/* main route content */}
            <main className="page-content">
                <Routes>
                    <Route
                        path="/"
                        element={<Home moments={moments} onDelete={deleteMoment} />}
                    />
                    {/* Sanctum receives the active persona but does not own the state. */}
                    <Route
                        path="/sanctum"
                        element={
                            <Sanctum
                                activePersona={activePersona}
                                moments={moments}
                                personas={personas}
                                onSwitchPersona={switchPersona}
                            />
                        }
                    />
                    <Route path="/soul-links" element={
                        <SoulLinks activePersona={activePersona}
                                   personas={personas}
                                   soulLinks={soulLinks}
                                onSendSoulLinkRequest={sendSoulLinkRequest}
                                onAcceptSoulLinkRequest={acceptSoulLinkRequest}
                            /> 
                          }
                          />
                    <Route path="/world" element={<World />} />
                    <Route path="/inbox" element={
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
            </main>

            {/* action menu for creation flows */}
            {menuOpen && (
                <CreateMenu
                    onCreateMoment={openMomentModal}
                    onCreatePersona={openPersonaModal}
                    onClose={closeMenu}
                />
            )}

            {/* moment creation modal */}
            {momentModalOpen && (
                <MomentModal
                    value={momentInput}
                    onChange={setMomentInput}
                    onPost={addMoment}
                    onClose={closeMomentModal}
                    activePersona={activePersona}
                />

            )}
            {/* personas creation modal */}
            {personaModalOpen && (
                <PersonaModal
                    name={personaName}
                    niche={personaNiche}
                    bio={personaBio}
                    onNameChange={setPersonaName}
                    onNicheChange={setPersonaNiche}
                    onBioChange={setPersonaBio}
                    onCreate={addPersona}
                    onClose={closePersonaModal}
                />
            )}

            {/* Floating action button */}
            <ActionButton onClick={openMenu} />

            {/* Bottom navigation */}
            <BottomNav />
        </div>
    );
}

export default Layout;