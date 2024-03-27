import React, { useEffect, Suspense, useState, useRef } from 'react';

import ConversationService from '../backend/services/ConversationService';
import LoadingIndicator, { LoadingSpinner } from './LoadingIndicator';

const conversationService = new ConversationService();

function ChatBox(coordinates) {
    const style = {
        position: 'absolute',
        left: `${coordinates.coordinates.x + 15}px`,  
        top: `${coordinates.coordinates.y - 10}px`, 
    };

    const [messages, setMessages] = useState([]);
    const [nameInfo, setNameInfo] = useState('Tyrion Lannister');
    const [messageLoading, setMessageLoading] = useState(false);
    const [conversationOverEndState, setConversationOverEndState] = useState(null);
    const messagesDivRef = useRef(null);

  

    const activeConversationAgentId = coordinates.clickedName

    useEffect(() => {
        if (!messagesDivRef.current) return;
          messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
      }, [messages.length]);


    useEffect(() => {
        let isCancelled = false;
    
        if (activeConversationAgentId) {

          activeConversationAgentId === 1 ? setNameInfo('Jon Snow') : setNameInfo('Daenerys Targaryen')
          const startConversation = async () => {
              setMessageLoading(true);
              setConversationOverEndState(null);
  
              const conversation = await conversationService.startConversation(activeConversationAgentId);
  
              if (!isCancelled) {
                  const newMessages = mapConversationToMessages(conversation);
                  setMessages(newMessages);
                  setMessageLoading(false);
              }
          }
          startConversation();
        }
    
        return () => {
            isCancelled = true;
        };
    }, [activeConversationAgentId])
    
    if (!conversationService) {
        return <div className="conversation" >
            <LoadingIndicator />
        </div>
    }


    const handleClose = () => {
      coordinates.toggleChatBox();
    };


    const mapConversationToMessages = (conversation) => {
        const vms =  [];
        conversation.messages.forEach(msg => {
          vms.push({
            id: msg.id,
            text: msg.text,
            sender: msg.sender === "me" ? "me" : "other",
          });
      
          if (msg.errorMessage) {
            vms.push({
              id: `error_${msg.id}`,
              text: msg.errorMessage,
              sender: "system",
            })
          }
        });
        return vms;
    }

    const handleEndConversation = async () => {
        setMessageLoading(true);
        const conversation = await conversationService.endConversation(
          activeConversationAgentId, 
          conversationOverEndState ?? "Brendan Leaves");
        const newMessages = mapConversationToMessages(conversation);
        setMessages(newMessages);

        coordinates.toggleChatBox()
       
        setMessageLoading(false);
    };

    const handleNpcAction = async (action) => {
        if (action === 'farewell') {
          setConversationOverEndState("Brendan leaves");
        } else if (action === 'move') {
          console.log(`Move to ${location}`);
          setConversationOverEndState(`You start heading to the `);
        }
      }

    function ChatInfo() {
        const [newMessage, setNewMessage] = useState('');
        const handleEnterPressed = (event) => {
          if (event.key === 'Enter') {
            handleSendMessage();
          }
        };
        const handleSendMessage = async () => {
          if (messageLoading) return;
          if (newMessage.trim() === '') {
            return;
          }
          
          const newId = 'tmpId';
          const newMessages = [...messages, { id: newId, text: newMessage.trim(), sender: 'me' }];
          setMessages(newMessages.filter(x => x.text.trim()));
          setNewMessage('');
          
          try {
            setMessageLoading(true);
            const conversation = await conversationService.sendReply(activeConversationAgentId, newMessage);
            const newMessages2 = mapConversationToMessages(conversation);
            setMessages(newMessages2.filter(x => x.text.trim()));
      
            const npcAction = conversation.messages[conversation.messages.length - 1].action;
            if (npcAction) {
              await handleNpcAction(npcAction);
            }
          } catch (e) {
            // todo display error
            console.log("Failed to send");
            console.error(e);
            setMessages(messages.filter(x => x.text.trim()));
          }
          setMessageLoading(false);
        };
        return (
            <div className='map-chat-box'>
                <div className='map-chat-title'>
                    <div>正在与 {nameInfo} 交谈</div>
                </div>
                <div className='conversation__messages' ref={messagesDivRef}>
                    {messages
                        .filter(message => message.text) 
                        .map((message) => (
                            <div
                                key={message.id}
                                className={`conversation__bubble conversation__bubble--${message.sender}`}
                            >
                                {message.text}
                            </div>
                        ))
                    }
                </div>
                <div className='conversation__input'>
                  <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)} 
                      onKeyDown={handleEnterPressed} 
                      placeholder="Type a message... press enter to send"
                      disabled={!!conversationOverEndState}/>
                      {messageLoading 
                      ? 
                          <LoadingSpinner />
                      : <div className="conversation__buttons">
                          {!conversationOverEndState ? <button onClick={handleSendMessage}>Send</button> : undefined}
                          <button onClick={handleEndConversation}>Leave</button>
                      </div>
                  }
                </div>
            </div>
        );
    }
  
    return (
        <div style={style} className='map-chat-container'> 
            <Suspense fallback={<div>Loading...</div>}  >
                <ChatInfo />
            </Suspense>
        </div>
    );
}

export default ChatBox;