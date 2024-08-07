import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import QRCode from "qrcode.react"; // Import the QR code component
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
function IdCardrender({
  Dataid,
  handleDownload,
  fetchData,
  isLoading,
  eventName,
  handleDownloadWithoutBackground,
}) {
  const [loading, setLoading] = useState(false);
  if (!Array.isArray(Dataid) || Dataid.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg font-bold text-center">
          No ID cards found for this event.
        </p>
      </div>
    );
  }
  const handleDownloadAll = async () => {
    setLoading(true);
    const zip = new JSZip();

    for (let index = 0; index < reversedData.length; index++) {
      const card = reversedData[index];
      const idCardElement = document.getElementById(`id-card-${index}`);

      if (!idCardElement) {
        console.error("Element not found", index);
        continue;
      }

      try {
        const dataUrl = await toPng(idCardElement, {
          quality: 1,
          pixelRatio: 4,
        });
        const base64Data = dataUrl.split("base64,")[1];
        zip.file(`id-card-${index + 1}.png`, base64Data, { base64: true });
      } catch (error) {
        console.error("Error generating PNG:", error, index);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "id-cards.zip");
      setLoading(false);
    });
  };

  const reversedData = [...Dataid].reverse();

  return (
    <div className="">
      <div className="grid   lg:grid-cols-2  lg:px-20 px-4 gap-3 lg:mb-20 mb-5">
        <div className="lg:px-20  font-bold text-[23px]">
          {eventName} Event All ID Cards
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleDownloadAll}
            className="border text-white font-bold px-4 py-2 rounded-md  bg-blue-400  flex items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex gap-2">
                Wait...
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Download All"
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-10 lg:px-20 container mx-auto ">
        {reversedData.map((card, index) => (
          <IdCard
            key={index}
            card={card}
            handleDownload={handleDownload}
            fetchData={fetchData}
            index={index}
            isLoading={isLoading}
            handleDownloadWithoutBackground={handleDownloadWithoutBackground}
          />
        ))}
      </div>
    </div>
  );
}

const IdCard = ({
  card,
  handleDownload,
  index,
  fetchData,
  isLoading,
  handleDownloadWithoutBackground,
}) => {
  console.log("icard id ", card);
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
          .patch(
            `https://kdemapi.insideoutprojects.in/api/participants/archive/${id}`,
            {
              archive: true,
            }
          ) // PATCH request to archive participant
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
    <div className="relative mb-20 h-[580px] w-[430px] ">
      <div
        id={`id-card-${index}`}
        className="relative   rounded-[1px] h-[580px] w-[430px]   "
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
                className=" lg:h-[150px] rounded-[2px] lg:w-[150px] h-[140px]  w-[140px] "
              />
            </div>
            <p className="lg:text-xl text-[12px] font-semibold mt-2  text-center">
              {card.institute}
            </p>
            <p className=" font-bold mt-6 text-[15px] mb-[2px]   text-black  text-center">
              {card.designation}
            </p>
            <div className="flex justify-center lg:mt-0  ">
              <QRCode value={participantUrl} size={85} level="H" />
            </div>
            <div className="text-black text-[15px] text-center font-bold">
              {card.participantId}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-3 justify-center">
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
            <div className="flex gap-2">
              Wait...
              <svg
                className="animate-spin h-5 w-5 mr-3 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
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
        <button
          id={`download-button-${index}`}
          onClick={() => handleDownloadWithoutBackground(index)}
          className="border text-black p-3 bg-gray-300 hover:bg-gray-500 font-semibold rounded "
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
            <div className="flex gap-2  ">
              WithoutBackground
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
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default IdCardrender;
