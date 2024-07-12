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
                    <div key={index} className="relative">
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
            </div>
        </div>
    );
}

export default IdCardrender;
