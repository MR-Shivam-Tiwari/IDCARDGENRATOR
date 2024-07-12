import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function BulkCreateID() {
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState('');
    const [data, setData] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleClick = (id) => {
        setSelected(id);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert worksheet to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log('Parsed JSON Data:', jsonData); // Log the parsed JSON data

            // Map the data to expected keys
            setData(jsonData.map((item) => ({
                lastName: item['LastName'], // Corrected key name to 'lastName'
                firstName: item['FirstName'],
                designation: item['Designation'],
                profilePicture: item['Profile Picture']
            })));
        };

        reader.readAsBinaryString(file);
    };



    const handleBackgroundUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setBackgroundImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const generateIDs = () => {
        setModal(false);
    };

console.log("data", data)
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
                            className="h-6 w-6" >

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
                            Create Bulk ID
                        </button>
                    </div>
                </div>
            </header>
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                <h1 className="text-3xl font-bold text-gray-900">Create Bulk ID</h1>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                                    onClick={toggleModal}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="w-full max-w-2xl mx-auto py-5 px-4 sm:px-6 lg:px-8 overflow-y-auto max-h-[500px] sm:max-h-screen">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700">Upload Excel File</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="excelFile" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input id="excelFile" className="sr-only" type="file" onChange={handleFileUpload} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700">Upload Background Image For ID</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="backgroundImage" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                        <span>Upload a file</span>
                                                        <input id="backgroundImage" className="sr-only" type="file" onChange={handleBackgroundUpload} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="idType" className="block text-sm font-medium text-gray-700">Select ID Card Type</label>
                                        <div className="mt-1">
                                            <ul className="flex items-center gap-5 justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                                <li className="w-full">
                                                    <a href="#" onClick={() => handleClick('profile')} className={`inline-flex items-center px-4 py-3 h-[50px] border text-black rounded w-full ${selected === 'profile' ? 'bg-black text-white' : 'bg-gray-200'}`}><div className={`border h-8 w-6 grid py-[2px] items-center justify-center rounded-[2px] me-2 ${selected === 'dashboard' ? 'border-black' : 'border-white'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-border-width" viewBox="0 0 16 16">
                                                            <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                                        </svg>
                                                    </div>Vertical</a>
                                                </li>
                                                <li className="w-full">

                                                    <a href="#" onClick={() => handleClick('dashboard')} className={`inline-flex items-center px-4 py-3 border text-black rounded w-full ${selected === 'dashboard' ? 'bg-black text-white' : 'bg-gray-200'}`}> <div className={`border flex items-center justify-between px-[2px] h-6 w-10 rounded-[2px] me-2 ${selected === 'dashboard' ? 'border-white' : 'border-black'}`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                        </svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-border-width" viewBox="0 0 16 16">
                                                            <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                                        </svg>
                                                    </div>Horizontal</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b">
                                <button type="button" onClick={generateIDs} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-sm px-5 py-2.5 text-center">Generate</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mt-8 container mx-auto">
                {data.map((idCard, index) => (
                    <div key={index} className={`p-4 m-2 border rounded-lg shadow-md ${selected === 'profile' ? 'w-[270px] h-[370px]' : 'w-[450px] h-[270px]'} bg-cover`} style={{ backgroundImage: `url(${backgroundImage})` }}>
                        <div className={`relative z-10 ${idCard.type === 'profile' ? 'flex flex-col items-center mt-10' : 'flex items-center justify-between'} h-full text-white`}>
                            <div className={`rounded-full overflow-hidden border-4 border-white ${idCard.type === 'profile' ? 'w-[130px] h-[130px]' : 'w-[130px] h-[130px] ml-5'}`}>
                                <img
                                    src={idCard.profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className={`${idCard.type === 'profile' ? 'text-center mt-10' : 'flex-1 ml-10 mt-10'}`}>
                                <h2 className="text-lg text-black font-bold">{idCard.firstName} {idCard.lastName}</h2>
                                <p className="text-sm text-black">{idCard.designation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



        </div >
    );
}

export default BulkCreateID;
