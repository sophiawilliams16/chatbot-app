import { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from "@material-tailwind/react";
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import '@chatscope/chat-ui-kit-react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Sidebar, ConversationList, Conversation } from '@chatscope/chat-ui-kit-react';

const Ask = ({name, setName}) => {
    
    const [prompt, setPrompt] = useState('');
    const [storedName, setStoredName] = useState('');
    const [showResponse, setShowResponse] = useState(false);
    const [assistantResponse, setAssistantResponse] = useState(false);
    const [typing, setTyping] = useState(false);

    // retrieve name from local storage 
    const [messages, setMessages] = useState([
        {
            message: "How can I help you today?",
            sender: "ChatGPT"
        }
    ])

    useEffect(() => {
        const savedName = localStorage.getItem('savedName');
        if (savedName !== null) {
            setStoredName(savedName);
        }
    }, [messages]); 

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }
        const newMessages = [...messages, newMessage]; // all the old messages + new nessages
        // update message state
        setMessages(newMessages);
        // set typing indicator (model is typing)
        setTyping(true); 
        //process message to chatGPT
        await processMessage(newMessages);
    }

    async function processMessage(chatMessages) {
        let processedApiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant"
            } else {
                role = "user"
            } return {
                role: role,
                content: messageObject.message,
                //sentTime: new Date()
            }
        });

        const systemMessage = {
            role: "system",
            content: "Explain all concepts clearly and concisely."
        }
        const apiRequestBody = {
            "messages": [
                systemMessage,
                ...processedApiMessages
            ]
        }
    
        await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiRequestBody),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then((data) => {
            console.log("Data", data);
            setMessages(
                [...chatMessages, {
                    message: data.response,
                    sender: "ChatGPT"
                }]);
            setTyping(false);
        });

        console.log("Messages:", messages);

        await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });
    }

    return (
    <section >
        {/* <Sidebar className=''>
            <ConversationList>
                <Conversation name={storedName} active={true}>
                </Conversation>
            </ConversationList>
        </Sidebar> */}
        <details className="dropdown">
            <summary className="m-1 btn text-white bg-white bg-opacity-10">{storedName}</summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-white bg-opacity-10 rounded-box w-52 ">
                <li><a>Conversation 1</a></li>
                <li><a>Conversation 2</a></li>
            </ul>
        </details>
        <MainContainer className='grid place-items-center'>
            <ChatContainer className='mt-24 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg shadow-lgm-10 max-w-lg'>
            <MessageList
                    className=''
                    scrollBehavior='smooth'
                    typingIndicator={typing ? <TypingIndicator content="... typing" className='justify-items-end' /> : null}>
                {messages.map((message, i) => (
                    <Message
                    className='bg-white bg-opacity-10 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg shadow-lg mx-auto text-center p-4 m-5'
                    key={i}
                    model={{
                        role: message.sender === "ChatGPT" ? "assistant" : "user",
                        message: message.message,
                        // sentTime: new Date(),
                    }}
                    />
                ))}
                </MessageList>
                <MessageInput
                    placeholder='Ask me anything'
                    attachButton={false}
                    // sendButton={<FontAwesomeIcon icon={faArrowAltCircleUp} />}
                    onSend={(message) => handleSend(message)}
                    className='bg-white bg-opacity-10 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg shadow-lg max-h-24'
                    />
            </ChatContainer>
        </MainContainer>
    </section>
    )
};

export default Ask;