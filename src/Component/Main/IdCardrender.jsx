import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import QRCode from "qrcode.react"; // Import the QR code component

function IdCardrender({ Dataid, handleDownload, fetchData, isLoading }) {
  if (!Array.isArray(Dataid) || Dataid.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg font-bold text-center">
          No ID cards found for this event.
        </p>
      </div>
    );
  }

  const reversedData = [...Dataid].reverse();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 gap-10 w-full container mx-auto px-4">
        {reversedData.map((card, index) => (
          <IdCard
            key={index}
            card={card}
            handleDownload={handleDownload}
            fetchData={fetchData}
            index={index}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

const IdCard = ({ card, handleDownload, index, fetchData, isLoading }) => {
  console.log("icard id " , card)
  const handleDelete = (id) => {
    Swal.fire({
      title: "Archive ID Cards?",
      text: "This will archive the ID Cards and can be reverted later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, archive it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`https://kdemapi.insideoutprojects.in/api/participants/archive/${id}`, {
            archive: true,
          }) // PATCH request to archive participant
          .then((res) => {
            Swal.fire("Archived!", "ID Cards has been archived.", "success");
            fetchData(); // Assuming fetchData() fetches updated participant list
            console.log("archived");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const participantUrl = `https://idcardgenrator.vercel.app/approve/${card._id}`;

  return (
    <div className="relative mb-10 ">
      <div
        id={`id-card-${index}`}
        className="relative   rounded-[1px] lg:h-[560px] md:h-[800px]  h-full w-full"
        style={{
          backgroundImage: `url(${card.backgroundImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "crisp-edges",
        }}
      >
        <div className={`relative z-10 flex justify-center  h-full text-white`}>
          <div
            className={`overflow-hidden flex-col justify-center lg:mt-[200px] mt-[242px] border-white`}
          >
            <h2 className="text-lg text-center mb-2  font-bold">
              {card.firstName} {card.lastName}
            </h2>
            <div className="flex justify-center ">
              <img
                src={card.profilePicture}
                style={{ objectFit: "cover" }}
                alt="Profile"
                className=" lg:h-[150px] lg:w-[150px] h-[140px]  w-[140px] "
              />
            </div>
            <p className="lg:text-xl text-[12px] font-semibold mt-2  text-center">
              {card.institute}
            </p>
            <p className="text-lg font-semibold lg:mt-3 mt-1  lg:text-xl   text-black  text-center">
              {card.designation}
            </p>
            <div className="flex justify-center lg:mt-0  py-2">
              <QRCode value={participantUrl} size={45} level="H" />
            </div>
            <div className="text-black lg:text-xl text-[12px] text-center font-bold">
              {card.participantId}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-3 justify-end">
        <button
          onClick={() => handleDelete(card._id)}
          className="border text-black p-3 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-trash-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
          </svg>
        </button>
        <button
          id={`download-button-${index}`}
          onClick={() => handleDownload(index)}
          className="border text-black p-3 bg-gray-300 rounded-full "
        >
          {isLoading === index ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-repeat animate-spin"
              viewBox="0 0 16 16"
            >
              <path d="M11.534 7h1.932A6.5 6.5 0 1 1 8 1.5V0a7.5 7.5 0 1 0 7.5 7.5h-1.041A6.477 6.477 0 0 1 11.534 7z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-download"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default IdCardrender;
