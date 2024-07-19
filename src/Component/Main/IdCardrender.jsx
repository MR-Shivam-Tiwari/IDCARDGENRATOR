import React, { useRef, useEffect } from "react";
import JsBarcode from "jsbarcode";
import Swal from "sweetalert2";
import toastr from "sweetalert2";
import { toast } from 'react-toastify';
import axios from "axios";
function IdCardrender({ Dataid, handleDownload ,fetchData }) {
  // Check if Dataid is an array and is empty
  if (!Array.isArray(Dataid) || Dataid.length === 0) {
    // Display a message when Dataid is empty
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg font-bold text-center">
          No ID cards found for this event.
        </p>
      </div>
    );
  }

  // Reverse the data to display in reverse order
  const reversedData = [...Dataid].reverse();

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full container mx-auto px-4">
        {reversedData.map((card, index) => (
          <IdCard
            key={index}
            card={card}
            handleDownload={handleDownload}
            fetchData={fetchData}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

const IdCard = ({ card, handleDownload, index ,fetchData }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, card.participantId, {
        format: "CODE128",
        displayValue: true,
        height: 45, // Adjust the height here as needed
      });
    }
  }, [card.participantId]);

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
                .patch(`http://65.0.132.17:5000/api/participants/archive/${id}`, { archive: true }) // PATCH request to archive participant
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


  return (
    <div className="relative p-4">
      <div
        id={`id-card-${index}`}
        className="relative p-4 border rounded-[1px] h-[600px] w-full"
        style={{
          backgroundImage: `url(${card.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", // Ensure no repeat of background image
          imageRendering: "crisp-edges", // Use this for better rendering in some cases
        }}
      >
        <div className={`relative z-10 flex justify-center h-full text-white`}>
          <div
            className={`overflow-hidden flex-col justify-center mt-[190px] border-white`}
          >
            <h2 className="text-lg text-center mb-2 font-bold">
              {card.firstName} {card.lastName}
            </h2>
            <div className="flex justify-center">
              <img
                src={card.profilePicture}
                style={{ objectFit: "cover" }}
                alt="Profile"
                className=" h-[170px]  "
              />
            </div>
            <p className="text-md font-semibold mt-2 text-center">
              {card.institute}
            </p>
            <p className="text-md font-semibold mt-7 mb-3 text-black font-semibold text-center">
              {card.designation}
            </p>
            <div className="h-[10px]">
              <svg ref={barcodeRef}></svg>
            </div>
            <div className="text-black  text-center font-bold">
              {card.participantId}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-3 justify-end">
        
        <button  onClick={() => handleDelete(card._id)} className="border text-black  p-3 bg-gray-300 rounded-full hover:bg-gray-400">
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
          className="border text-black  p-3 bg-gray-300 rounded-full hover:bg-gray-400"
        >
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
        </button>
      </div>
    </div>
  );
};

export default IdCardrender;
