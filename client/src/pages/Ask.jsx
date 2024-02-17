import { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from "@material-tailwind/react";
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import Response from '../components/response';

const Ask = ({name, setName}) => {
    
    const [prompt, setPrompt] = useState('');
    const [storedName, setStoredName] = useState('');
    const [showResponse, setShowResponse] = useState(false);
    const [fetching, setFetching] = useState(false);

    // retrieve name from local storage 
    useEffect(() => {
        const savedName = localStorage.getItem('savedName');
        if (savedName !== null) {
            setStoredName(savedName);
        }
    }, []); 

    // make API call to send prompt and get a response.
    const submitPrompt = async () => {
        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: prompt }),
            });

            const data = await response.json();
            console.log('Response from server:', data.response);
            setShowResponse(true);
        } catch {
            console.error('Error submitting prompt:', error);
        }
        console.log('Name:', name);
        console.log('Prompt:', prompt);
    };


    return (
    <section className="grid place-items-center justify-items-center mt-24">
		<div className='max-w-xs bg-white bg-opacity-10 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg p-8 mb-4 shadow-lg mx-auto text-center'>
            <div>Hello, {storedName}. How can I help you today?</div>
        </div>  
        <div>
            <input
                className='max-w-xs bg-white bg-opacity-10 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg p-2 shadow-lg mx-auto text-center'
                placeholder="ask me anything"
                name="prompt"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                />
            <IconButton
                disabled={fetching}
                className="rounded hover:shadow-[#333333]/20 focus:shadow-[#333333]/20 active:shadow-[#333333]/10" onClick={submitPrompt}
                >
                {fetching ? '' : <FontAwesomeIcon
                icon={faArrowAltCircleUp} className="text-white size-5 mt-2 ml-3"/> }
            </IconButton>
        </div>    
        <div>
            <div className='max-w-xs bg-white bg-opacity-10 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg p-3 m-4 shadow-lg mx-auto text-center'>
                {showResponse}
            </div>
        </div> 
    </section>
    )
};

export default Ask;