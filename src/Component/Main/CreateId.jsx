import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import IdCardrender from './IdCardrender';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateId() {
    const [modal, setModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [designation, setDesignation] = useState('');
    const [idCard, setIdCard] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [Dataid, setDataid] = useState("")
    const [eventId, setEventId] = useState('');
    const [eventName, setEventName] = useState('');
    const [selectedIdCardType, setSelectedIdCardType] = useState('vertical');

    const handleClick = (type) => {
        setSelectedIdCardType(type);
    };
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('eventid');
        const name = params.get('eventName');
        setEventId(id);
        setEventName(name);

        if (id) {
            fetchData(id);
        }
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
    const fetchData = async (eventId) => {
        try {
            const url = `http://localhost:5000/api/participants/event/${eventId}`;
            const response = await axios.get(url);
            console.log('Participants by EventId:', response.data); // Log fetched participants
            setDataid(response.data); // Update state with fetched data
        } catch (error) {
            console.error('Error fetching participants by eventId:', error);
            setDataid([]); // Clear state or handle error case
        }
    };


    useEffect(() => {

        fetchData();
    }, []);

    console.log("sjdjdhs", Dataid)

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/participants', {
                firstName,
                lastName,
                designation,
                idCardType: selectedIdCardType,
                backgroundImage,
                profilePicture,
                eventId,
                eventName
            });

            setIdCard([...idCard, response.data]); // Update state with new ID card
            fetchData(eventId);
            toggleModal();
        } catch (error) {
            console.error('Error creating participant:', error);
        }
    };

    const handleDownload = (index) => {
        const idCardElement = document.getElementById(`id-card-${index}`);
        const downloadButton = document.getElementById(`download-button-${index}`);
        downloadButton.style.display = 'none';

        html2canvas(idCardElement, { scale: 2 }).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'id-card.png';
            link.click();
            downloadButton.style.display = 'block';
        });
    };

    const navigate = useNavigate();

    const toggleModal = () => {
        setModal(!modal);
    };

    return (
        <div>
            <header className="sticky top-0 z-50 w-full bg-gray-200 shadow-sm">
                <div className="flex h-16 mx-auto items-center justify-between px-4 lg:px-[80px]">
                    <a className="flex items-center gap-2" href="#" rel="ugc">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                        >
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span className="font-bold tracking-tight">Event App</span>
                    </a>
                    <div className='flex gap-10'>
                        <button
                            onClick={toggleModal}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-black text-white transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                        >
                            Create ID
                        </button>
                        <button
                            onClick={() => navigate('/bulk-create-id')}
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-black text-white transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                        >
                            Bulk Create
                        </button>
                    </div>
                </div>
            </header>
            {modal && (
                <div>
                    <div
                        id="default-modal"
                        tabIndex="-1"
                        aria-hidden="true"
                        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
                    >
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Create ID</h1>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                                        onClick={toggleModal}
                                    >
                                        <svg
                                            className="w-3 h-3"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 14"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                                            />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="w-full max-w-2xl mx-auto py-5 px-4 sm:px-6 lg:px-8 overflow-y-auto max-h-[500px] sm:max-h-screen">
                                    <div className="space-y-6">
                                        <form className="space-y-6" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label
                                                        htmlFor="startname"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        First Name
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            id="startname"
                                                            placeholder="Enter your First Name"
                                                            required
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="lastname"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Last name
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            id="lastname"
                                                            placeholder="Enter your Last name"
                                                            required
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="designation"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Designation
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        className="flex h-10 w-[100%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        id="designation"
                                                        placeholder="Enter your Designation"
                                                        required
                                                        value={designation}
                                                        onChange={(e) => setDesignation(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div>
                                                <label htmlFor="idCardType" className="block text-sm font-medium text-gray-700">
                                                    Select ID Card Type
                                                </label>
                                                <div className="mt-1">
                                                    <ul className="flex items-center gap-5 justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                                        <li className="w-full">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleClick('vertical')}
                                                                className={`inline-flex items-center px-4 py-3 h-[50px] border text-black rounded w-full ${selectedIdCardType === 'vertical' ? 'bg-black text-white' : 'bg-gray-200'}`}
                                                            >
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
                                                                className={`inline-flex items-center px-4 py-3 border text-black rounded w-full ${selectedIdCardType === 'horizontal' ? 'bg-black text-white' : 'bg-gray-200'}`}
                                                            >
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
                                            </div> */}
                                            <div>
                                                <label
                                                    htmlFor="backgroundImage"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Upload Background Image
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="file"
                                                        id="backgroundImage"
                                                        name="backgroundImage"
                                                        className="file:hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="profilePicture"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Upload Profile Picture
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="file"
                                                        id="profilePicture"
                                                        name="profilePicture"
                                                        className="file:hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-5">
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-400 border border-transparent rounded-md hover:bg-gray-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    onClick={toggleModal}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="ml-2 inline-flex  bg-black justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center  my-8">
                {/* <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full container mx-auto px-4">
                    {idCard.map((card, index) => (
                        <div key={index} className="relative p-4">
                            <div
                                id={`id-card-${index}`}
                                className={`relative p-4 border shadow-md rounded-[1px] ${card.idCardType === 'vertical' ? 'h-[370px] w-[270px]' : 'h-[270px] w-[450px]'}`}
                                style={{
                                    backgroundImage: `url(${card.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute inset-0 bg-black opacity-40 rounded-[3px]"></div>
                                <div className={`relative z-10 ${card.idCardType === 'vertical' ? 'flex flex-col items-center mt-10' : 'flex items-center justify-between'} h-full text-white`}>
                                    <div className={`rounded-full overflow-hidden border-4 border-white ${card.idCardType === 'vertical' ? 'w-[130px] h-[130px]' : 'w-[130px] h-[130px] ml-5'}`}>
                                        <img
                                            src={card.profilePicture}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className={`${card.idCardType === 'vertical' ? 'text-center mt-10' : 'flex-1 ml-10 mt-10'}`}>
                                        <h2 className="text-lg font-bold">{card.firstName} {card.lastName}</h2>
                                        <p className="text-sm">{card.designation}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                id={`download-button-${index}`}
                                onClick={() => handleDownload(index)}
                                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                Download
                            </button>
                        </div>
                    ))}

                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full container mx-auto px-4">
                    {idCard.map((card, index) => (
                        <div key={index} className="relative p-4">
                            <div
                                id={`id-card-${index}`}
                                className="relative p-4 border rounded-[1px] h-[600px] w-full"
                                style={{
                                    backgroundImage: `url(${card.backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >

                                <div className={`relative z-10 flex justify-center h-full text-white`}>
                                    <div className={`overflow-hidden flex-col justify-center mt-[190px] border-white`}>
                                        <h2 className="text-lg text-center mb-2 font-bold">
                                            {card.firstName} {card.lastName}
                                        </h2>
                                        <img
                                            src={card.profilePicture}
                                            alt="Profile"
                                            className="w-[170px] h-[170px] object-cover"
                                        />
                                        <p className="text-md font-semibold mt-2 text-center">{card.designation}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                id={`download-button-${index}`}
                                onClick={() => handleDownload(index)}
                                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                Download
                            </button>
                        </div>
                    ))}
                </div>

            </div>

            <hr />
            <div className='my-10'>
                <div className='px-20 mb-10 font-bold text-2xl'>

                    {eventName} Event All ID Cards
                </div>
                <IdCardrender Dataid={Dataid} handleDownload={handleDownload} />
            </div>
        </div >
    );
}

export default CreateId;
