import React from 'react';

function IdCardrender({ Dataid, handleDownload }) {
    // Check if Dataid is an array and is empty
    if (!Array.isArray(Dataid) || Dataid.length === 0) {
        // Display a message when Dataid is empty
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg font-bold text-center">No ID cards found for this event.</p>
            </div>
        );
    }

    // Reverse the data to display in reverse order
    const reversedData = [...Dataid].reverse();

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full container mx-auto px-4">
                {reversedData.map((card, index) => (
                    <div key={index} className="relative p-4">
                        <div
                            id={`id-card-${index}`}
                            className="relative p-4 border rounded-[1px] h-[600px] w-full"
                            style={{
                                backgroundImage: `url(${card.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat', // Ensure no repeat of background image
                                imageRendering: 'crisp-edges', // Use this for better rendering in some cases
                            }}
                        >

                            <div className={`relative z-10 flex justify-center h-full text-white`}>
                                <div className={`overflow-hidden flex-col justify-center mt-[190px] border-white`}>
                                    <h2 className="text-lg text-center mb-2 font-bold">
                                        {card.firstName} {card.lastName}
                                    </h2>
                                    <img
                                        src={card.profilePicture}
                                        style={{ objectFit: 'cover' }}
                                        alt="Profile"
                                        className=" h-[170px]  "
                                    />
                                    <p className="text-md font-semibold mt-2 text-center">{card.institute}</p>
                                    <p className="text-md font-semibold mt-10 text-black font-semibold text-center">{card.designation}</p>
                                    <div className='text-black mt-10 text-center font-bold'>
                                        {card.participantId}
                                    </div>
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
    );
}

export default IdCardrender;
