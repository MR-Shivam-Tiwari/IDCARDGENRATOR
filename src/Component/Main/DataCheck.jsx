import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Assuming you use React Router for navigation

const ParticipantForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [designation, setDesignation] = useState('');
    const [idCardType, setIdCardType] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [eventId, setEventId] = useState('');
    const [eventName, setEventName] = useState('');
    const [selectedIdCardType, setSelectedIdCardType] = useState('vertical'); // Default selected ID card type

    const location = useLocation();

    useEffect(() => {
        // Extract eventId and eventName from location state or URL parameters
        const params = new URLSearchParams(location.search);
        const id = params.get('eventid');
        const name = params.get('eventName');
        setEventId(id);
        setEventName(name);
    }, [location]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (event.target.name === 'backgroundImage') {
                setBackgroundImage(reader.result);
            } else if (event.target.name === 'profilePicture') {
                setProfilePicture(reader.result);
            }
        };
    };



    const handleClick = (type) => {
        setSelectedIdCardType(type); // Update selected ID card type
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Convert base64 images to strings and send in the request
            const response = await axios.post('http://localhost:5000/api/participants', {
                firstName,
                lastName,
                designation,
                idCardType: selectedIdCardType, // Use selected ID card type
                backgroundImage,
                profilePicture,
                eventId,
                eventName
            });
            console.log('Participant created:', response.data);
            // Handle success state or redirect to another page
        } catch (error) {
            console.error('Error creating participant:', error);
            // Handle error state or display error message
        }
    };

    return (
        <div className="border rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Participant Form</h2>
            <form className='grid gap-5' onSubmit={handleSubmit}>
                {/* Input fields for participant details */}
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" required />
                {/* File input for background image */}
                <input type="file" name="backgroundImage" onChange={handleImageChange} accept="image/*" required />
                {/* File input for profile picture */}
                <input type="file" name="profilePicture" onChange={handleImageChange} accept="image/*" required />
                <div>
                    <label htmlFor="idCardType" className="block text-sm font-medium text-gray-700">
                        Select ID Card Type
                    </label>
                    <div className="mt-1">
                        <ul className="flex items-center gap-5 justify-between text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                            <li className="w-full">
                                <button
                                    type="button"
                                    onClick={() => handleClick('vertical')}
                                    className={`inline-flex items-center px-4 py-3 h-[50px] border text-black rounded flex gap-3 w-full ${selectedIdCardType === 'vertical' ? 'bg-black text-white' : 'bg-gray-200'}`}
                                    aria-current="page"
                                >
                                    {/* Icons for vertical ID card */}
                                    <div className={`border h-8 w-6 grid py-[2px] items-center justify-center rounded-[2px] me-2 ${selectedIdCardType === 'vertical' ? 'border-black' : 'border-white'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-border-width" viewBox="0 0 16 16">
                                            <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                        </svg>
                                    </div>
                                    Vertical
                                </button>
                            </li>
                            <li className="w-full">
                                <button
                                    type="button"
                                    onClick={() => handleClick('horizontal')}
                                    className={`inline-flex items-center px-4 py-3 border text-black rounded flex gap-3 w-full ${selectedIdCardType === 'horizontal' ? 'bg-black text-white' : 'bg-gray-200'}`}
                                >
                                    {/* Icons for horizontal ID card */}
                                    <div className={`border flex items-center justify-between px-[2px] h-6 w-10 rounded-[2px] me-2 ${selectedIdCardType === 'horizontal' ? 'border-white' : 'border-black'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-border-width" viewBox="0 0 16 16">
                                            <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                        </svg>
                                    </div>
                                    Horizontal
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ParticipantForm;
