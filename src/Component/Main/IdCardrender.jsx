import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import QRCode from "qrcode.react"; // Import the QR code component
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import domtoimage from "dom-to-image";
import EditParticipent from "./Edit/EditParticipent";
function IdCardrender({
  Dataid,
  fetchData,
  isLoading,
  eventName,
  fetchDesignations,
  eventId,
}) {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
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
  const downloadAllImagesAsZip = () => {
    setLoading(true);
    const zip = new JSZip();
    const images = reversedData.map((card, index) => {
      return new Promise((resolve) => {
        const element = document.getElementById(`id-card-${index}`);
        toPng(element, { cacheBust: true, quality: 1, pixelRatio: 3 }).then(
          (dataUrl) => {
            zip.file(`id-card-${index}.png`, dataUrl.split(",")[1], {
              base64: true,
            });
            resolve();
          }
        );
      });
    });

    Promise.all(images).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "id-cards.zip");
        setLoading(false);
      });
    });
  };
  return (
    <div className="">
      <div className="grid   lg:grid-cols-2  lg:px-20 px-4 gap-3 lg:mb-20 mb-5">
        <div className="lg:px-20  font-bold text-[23px]">
          {eventName} Event All ID Cards
        </div>
        <div className="flex justify-end">
          <button
            className="border text-white font-bold px-4 py-2 rounded-md bg-blue-400 flex items-center"
            onClick={downloadAllImagesAsZip}
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
              "Download All as ZIP"
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-10 lg:px-20 container mx-auto ">
        {reversedData.map((card, index) => (
          <IdCard
            key={index}
            card={card}
            fetchData={fetchData}
            index={index}
            isLoading={isLoading}
            fetchDesignations={fetchDesignations}
            eventId={eventId}
          />
        ))}
      </div>
    </div>
  );
}

const IdCard = ({
  card,
  index,
  fetchData,
  isLoading,
  fetchDesignations,
  eventId,
}) => {
  const [modal, setModal] = useState(false);
  const idCardRef = useRef(null);

  const toggleModal = () => {
    setModal(!modal);
    fetchDesignations(eventId);
  };
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
          .patch(`http://localhost:5000/api/participants/archive/${id}`, {
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

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = () => {
    const element = idCardRef.current;
    if (!element) return;

    setIsDownloading(true);

    toPng(element, {
      cacheBust: true,
      backgroundColor: null, // Set a background color if needed
      quality: 1, // Set quality to 1 for maximum
      pixelRatio: 3, // Increase the pixel ratio for higher resolution
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `id-card-${index}.png`;
        link.click();
      })
      .catch((error) => {
        console.error("Could not download the image", error);
      })
      .finally(() => {
        setIsDownloading(false); // End loading
      });
  };
  const downloadImageWithoutBackground = () => {
    const element = idCardRef.current;
    if (!element) return;

    // Temporarily hide the background image
    const originalBackgroundImage = element.querySelector("img").style.display;
    element.querySelector("img").style.display = "none";

    setIsDownloading(true);

    toPng(element, {
      cacheBust: true,
      backgroundColor: null, // Ensure no background color
      quality: 1,
      pixelRatio: 3,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `id-card-${index}-no-background.png`;
        link.click();
      })
      .catch((error) => {
        console.error("Could not download the image", error);
      })
      .finally(() => {
        // Restore the original background image display
        element.querySelector("img").style.display = originalBackgroundImage;
        setIsDownloading(false);
      });
  };

  return (
    <div className="relative mb-20 h-[580px] w-[430px] ">
      <div
        ref={idCardRef}
        id={`id-card-${index}`}
        className="relative   rounded-[1px] h-[580px] w-[430px]   "
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <div className="absolute inset-0">
            <img
              src={card.backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex flex-col  p-4 mt-[210px]   ">
            <h2 className="text-[20px] mb-5 font-bold text-center mt-2 text-white">
              {card.firstName} {card.lastName}
            </h2>
            <div className="flex justify-center">

            <img
              src={card.profilePicture}
              style={{ objectFit: "cover" }}
              alt="Profile"
              className="w-[150px] h-[150px]  rounded-[2px] "
              />
              </div>
            <p className="text-sm font-semibold text-center text-white mt-1 mb-4">
              {card.institute}
            </p>
            <p className="text-md font-bold text-center text-black">
              {card.designation}
            </p>
            <div className="flex justify-center">
              <QRCode value={participantUrl} size={85} level="H" />
            </div>
            <div className="text-md font-bold text-center text-black">
              {card.participantId}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-3 justify-center">
        <button
          onClick={toggleModal}
          className="border text-black p-3 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fill-rule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
            />
          </svg>
        </button>
        {modal && (
          <div>
            <EditParticipent
              fetchData={fetchData}
              eventId={eventId}
              fetchDesignations={fetchDesignations}
              toggleModal={toggleModal}
              id={card._id}
              data={card}
            />
          </div>
        )}
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
          onClick={downloadImage}
          id={`download-button-${index}`}
          className="border text-black p-3 bg-gray-300 rounded-full "
        >
          {isDownloading ? (
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
          onClick={downloadImageWithoutBackground}
          disabled={isLoading}
          id={`download-button-${index}`}
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
