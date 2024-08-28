import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import QRCode from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import EditParticipent from "./Edit/EditParticipent";
import * as XLSX from "xlsx";

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
  const [isModalOpenedit, setIsModalOpenedit] = useState(false);
  const [elementStyles, setElementStyles] = useState({
    profilePicture: { bottom: 160, size: 170 },
    name: { top: 200, fontSize: 20, color: "white" },
    institute: { bottom: 130, fontSize: 18, color: "white" },
    designation: { bottom: 107, fontSize: 16, color: "black" },
    qrCode: { bottom: 15 },
    participantId: { bottom: 1, fontSize: 12, color: "black" },
  });
  const toggleModalOpenedit = () => setIsModalOpenedit(!isModalOpenedit);
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
    setGlobalVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const downloadAllEntries = () => {
    setLoading(true);
    const formattedData = reversedData.map((card, index) => ({
      "S.No": index + 1,
      EventName: card.eventName,
      EventID: card.eventId,
      FirstName: card.firstName,
      LastName: card.lastName,
      Designation: card.designation,
      Institute: card.institute,
      ParticipantID: card.participantId,
      ProfilePicture: card.profilePicture,
      // BackgroundImage: card.backgroundImage,
      Amenities: JSON.stringify(card.amenities), // Converting object to string
      // Archive: card.archive,
      CreatedAt: new Date(card.createdAt).toLocaleString(),
      UpdatedAt: new Date(card.updatedAt).toLocaleString(),
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "ID Cards");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${eventName}_ID_Cards.xlsx`);

    setLoading(false);
  };
  const updateElementStyle = (element, property, value) => {
    setElementStyles((prev) => ({
      ...prev,
      [element]: { ...prev[element], [property]: value },
    }));
  };
  const colorOptions = ["white", "black", "orange"];
  const renderStyleControls = (
    element,
    label,
    minValue = 0,
    maxValue = 580,
    sizeControl = false,
    colorControl = false
  ) => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} Position
      </label>
      <input
        type="range"
        min={minValue}
        max={maxValue}
        value={elementStyles[element].top || elementStyles[element].bottom}
        onChange={(e) =>
          updateElementStyle(
            element,
            element === "name" ? "top" : "bottom",
            parseInt(e.target.value)
          )
        }
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      {sizeControl && (
        <>
          <label className="block text-sm font-medium text-gray-700">
            {label} Size
          </label>
          <input
            type="range"
            min={50}
            max={250}
            value={elementStyles[element].size}
            onChange={(e) =>
              updateElementStyle(element, "size", parseInt(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </>
      )}
      {!sizeControl && (
        <>
          <label className="block text-sm font-medium text-gray-700">
            {label} Font Size
          </label>
          <input
            type="range"
            min={8}
            max={40}
            value={elementStyles[element].fontSize}
            onChange={(e) =>
              updateElementStyle(element, "fontSize", parseInt(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </>
      )}
      {colorControl && (
        <>
          <label className="block text-sm font-medium text-gray-700">
            {label} Color
          </label>
          <div className="flex space-x-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => updateElementStyle(element, "color", color)}
                className={`w-8 h-8 rounded-full ${
                  color === "white"
                    ? "bg-white border border-gray-300"
                    : color === "black"
                    ? "bg-black"
                    : "bg-orange-500"
                } ${
                  elementStyles[element].color === color
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                aria-label={`Set ${label} color to ${color}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{eventName} All ID Cards</h1>
        <div className="flex gap-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModalOpenedit}
          >
            Edit All ID Cards
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModalOpen}
          >
            Show & Hide
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={downloadAllImagesAsZip}
            disabled={loading}
          >
            {loading ? (
              <>
                Wait...
                <svg
                  className="animate-spin h-5 w-5 ml-2"
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
              </>
            ) : (
              "Download All as ZIP"
            )}
          </button>
          <button
            className="bg-yellow-500 flex gap-2 items-center hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={downloadAllEntries}
            disabled={loading}
          >
            {loading ? "Preparing Excel..." : "Download All Entries"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-cloud-arrow-down mt-1"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708z"
              />
              <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
            </svg>
          </button>
        </div>
      </div>
      {isModalOpenedit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] h-[500px] overflow-y-auto">
            <div className="flex justify-between items-center ">
              <h2 className="text-xl font-bold mb-4">Edit ID Card Elements</h2>
              <button
                onClick={toggleModalOpenedit}
                className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="col-span-1 space-y-10">
                {renderStyleControls("name", "Name", 0, 580, false, true)}
                {renderStyleControls(
                  "designation",
                  "Designation",
                  0,
                  580,
                  false,
                  true
                )}
                {renderStyleControls(
                  "profilePicture",
                  "Profile Picture",
                  0,
                  580,
                  true
                )}
              </div>
              <div className="col-span-1 space-y-10">
                {renderStyleControls(
                  "institute",
                  "Institute",
                  0,
                  580,
                  false,
                  true
                )}
                {renderStyleControls(
                  "participantId",
                  "Participant ID",
                  0,
                  580,
                  false,
                  true
                )}

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    QR Code Position
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={580}
                    value={elementStyles.qrCode.bottom}
                    onChange={(e) =>
                      updateElementStyle(
                        "qrCode",
                        "bottom",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              Edit All ID Cards Visibility
            </h2>
            <div className="space-y-4">
              {Object.entries(globalVisibility).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="capitalize">{key}</span>
                  <div className="flex items-center">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleGlobalVisibility(key)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="ml-2 text-sm">
                      {value ? "Show" : "Hide"}
                    </span>
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
            elementStyles={elementStyles}
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
          transition: 0.4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
        }
        input:checked + .slider {
          background-color: #2196f3;
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
  elementStyles,
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
          .patch(
            `https://kdemapi.insideoutprojects.in/api/participants/archive/${id}`,
            {
              archive: true,
            }
          )
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
        <div className="relative z-10 h-full text-white">
          <div className="absolute inset-0">
            <img
              src={card.backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative h-full flex flex-col justify-between p-4">
            {globalVisibility.profilePicture && (
              <div
                style={{
                  bottom: `${elementStyles.profilePicture.bottom}px`,
                }}
                className="absolute bottom-[160px] left-[50%] transform -translate-x-1/2"
              >
                <img
                  style={{
                    // top: `${elementStyles.profilePicture.top}px`,
                    objectFit: "cover",
                    // fontSize: `${elementStyles.name.fontSize}px`,
                    width: `${elementStyles.profilePicture.size}px`,
                    height: `${elementStyles.profilePicture.size}px`,
                  }}
                  src={card.profilePicture}
                  alt="Profile"
                  className="w-[170px] h-[170px] rounded-[2px]"
                />
              </div>
            )}
            {globalVisibility.name && (
              <h2
                style={{
                  top: `${elementStyles.name.top}px`,
                  fontSize: `${elementStyles.name.fontSize}px`,
                  color: elementStyles.name.color,
                }}
                className="absolute top-[200px] uppercase left-[50%] transform -translate-x-1/2 text-[20px] font-bold text-center mt-2 w-full text-white"
              >
                {card.firstName} {card.lastName}
              </h2>
            )}
            {globalVisibility.institute && (
              <p
                style={{
                  bottom: `${elementStyles.institute.bottom}px`,
                  fontSize: `${elementStyles.institute.fontSize}px`,
                  color: elementStyles.institute.color,
                }}
                className="absolute bottom-[130px] left-0 right-0 w-full whitespace-nowrap text-lg font-semibold text-center text-white mt-1"
              >
                {card.institute
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </p>
            )}
            {globalVisibility.designation && (
              <p
                style={{
                  bottom: `${elementStyles.designation.bottom}px`,
                  fontSize: `${elementStyles.designation.fontSize}px`,
                  color: elementStyles.designation.color,
                }}
                className="absolute bottom-[107px] left-[50%] transform -translate-x-1/2 text-md font-bold text-center text-black"
              >
                {card.designation}
              </p>
            )}
            {globalVisibility.qrCode && (
              <div
                style={{
                  bottom: `${elementStyles.qrCode.bottom}px`,
                }}
                className="absolute bottom-[15px] left-[50%] transform -translate-x-1/2"
              >
                <QRCode value={participantUrl} size={92} level="H" />
              </div>
            )}
            {globalVisibility.participantId && (
              <div
                style={{
                  bottom: `${elementStyles.participantId.bottom}px`,
                  fontSize: `${elementStyles.participantId.fontSize}px`,
                  color: elementStyles.participantId.color,
                }}
                className="absolute bottom-[1px] left-[50%] transform -translate-x-1/2 text-xs font-bold text-center text-black"
              >
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
