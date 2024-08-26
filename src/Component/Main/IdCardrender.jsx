import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import QRCode from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalVisibility, setGlobalVisibility] = useState({
    name: true,
    profilePicture: true,
    institute: true,
    designation: true,
    qrCode: true,
    participantId: true,
  });

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

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleGlobalVisibility = (field) => {
    setGlobalVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{eventName} Event All ID Cards</h1>
        <div className="flex gap-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModalOpen}
          >
            Edit All ID Cards
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={downloadAllImagesAsZip}
            disabled={loading}
          >
            {loading ? (
              <>
                Wait...
                <svg className="animate-spin h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              "Download All as ZIP"
            )}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit All ID Cards Visibility</h2>
            <div className="space-y-4">
              {Object.entries(globalVisibility).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm">{value ? 'Show' : 'Hide'}</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleGlobalVisibility(key)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="ml-2 text-sm">{value ? 'Hide' : 'Show'}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={toggleModalOpen}
              className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-10">
        {reversedData.map((card, index) => (
          <IdCard
            key={index}
            card={card}
            fetchData={fetchData}
            index={index}
            isLoading={isLoading}
            fetchDesignations={fetchDesignations}
            eventId={eventId}
            globalVisibility={globalVisibility}
          />
        ))}
      </div>
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
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
  globalVisibility,
}) => {
  const [modal, setModal] = useState(false);
  const idCardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
    fetchDesignations(eventId);
  };

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
          })
          .then((res) => {
            Swal.fire("Archived!", "ID Cards has been archived.", "success");
            fetchData();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  const participantUrl = `https://idcardgenrator.vercel.app/approve/${card._id}`;

  const downloadImage = () => {
    const element = idCardRef.current;
    if (!element) return;

    setIsDownloading(true);

    toPng(element, {
      cacheBust: true,
      backgroundColor: null,
      quality: 1,
      pixelRatio: 3,
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
        setIsDownloading(false);
      });
  };

  const downloadImageWithoutBackground = () => {
    const element = idCardRef.current;
    if (!element) return;

    const originalBackgroundImage = element.querySelector("img").style.display;
    element.querySelector("img").style.display = "none";

    setIsDownloading(true);

    toPng(element, {
      cacheBust: true,
      backgroundColor: null,
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
        element.querySelector("img").style.display = originalBackgroundImage;
        setIsDownloading(false);
      });
  };

  return (
    <div className="relative mb-20 h-[580px] w-[430px]">
      <div
        ref={idCardRef}
        id={`id-card-${index}`}
        className="relative rounded-[1px] h-[580px] w-[430px]"
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <div className="absolute inset-0">
            <img
              src={card.backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex flex-col p-4 mt-[210px]">
            {globalVisibility.name && (
              <h2 className="text-[20px] mb-5 font-bold text-center mt-2 text-white">
                {card.firstName} {card.lastName}
              </h2>
            )}
            {globalVisibility.profilePicture && (
              <div className="flex justify-center">
                <img
                  src={card.profilePicture}
                  style={{ objectFit: "cover" }}
                  alt="Profile"
                  className="w-[150px] h-[150px] rounded-[2px]"
                />
              </div>
            )}
            {globalVisibility.institute && (
              <p className="text-sm font-semibold text-center text-white mt-1 mb-4">
                {card.institute}
              </p>
            )}
            {globalVisibility.designation && (
              <p className="text-md font-bold text-center text-black">
                {card.designation}
              </p>
            )}
            {globalVisibility.qrCode && (
              <div className="flex justify-center">
                <QRCode value={participantUrl} size={85} level="H" />
              </div>
            )}
            {globalVisibility.participantId && (
              <div className="text-md font-bold text-center text-black">
                {card.participantId}
              </div>
            )}
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
            className="bi bi-pencil-square"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
            />
          </svg>
        </button>
        {modal && (
          <EditParticipent
            fetchData={fetchData}
            eventId={eventId}
            fetchDesignations={fetchDesignations}
            toggleModal={toggleModal}
            id={card._id}
            data={card}
          />
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
          className="border text-black p-3 bg-gray-300 rounded-full"
        >
          {isDownloading ? (
            <svg
              className="animate-spin h-5 w-5 text-black"
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
          className="border text-black p-3 bg-gray-300 hover:bg-gray-500 font-semibold rounded"
        >
          {isDownloading ? (
            <svg
              className="animate-spin h-5 w-5 text-black"
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
          ) : (
            <div className="flex gap-2">
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