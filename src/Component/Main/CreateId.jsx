import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import IdCardrender from "./IdCardrender";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { toPng } from "html-to-image";
import JsBarcode from "jsbarcode";
function CreateId() {
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [idCard, setIdCard] = useState([]);
  const [designations, setDesignations] = useState([]); // State to hold fetched designations
  const [Dataid, setDataid] = useState("");
  const [params, setparams] = useState(new URLSearchParams(location.search));
  const [eventId, setEventId] = useState(params.get("eventid"));
  const [eventName, setEventName] = useState("");
  const [institute, setInstitute] = useState("");
  const [selectedIdCardType, setSelectedIdCardType] = useState("vertical");

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageChange = (event) => {
    const { id, files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      if (id === "profilePicture") {
        setProfilePicture(file);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("eventid");
    const name = params.get("eventName");
    setparams(params);
    setEventId(id);
    setEventName(name);

    fetchData();
  }, [location]);

  const fetchData = async () => {
    try {
      const url = `http://localhost:5000/api/participants/event/${eventId}`;
      const response = await axios.get(url);
      console.log("Participants by EventId:", response.data); // Log fetched participants
      setDataid(response.data); // Update state with fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching participants by eventId:", error);
      setDataid([]); // Clear state or handle error case
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isCreating, setIsCreating] = useState(false); // New state for loading spinner

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsCreating(true); // Start loading spinner

    try {
      const formData = new FormData();

      // Append non-file data
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("designation", designation);
      formData.append("idCardType", selectedIdCardType);
      formData.append("institute", institute);
      formData.append("eventId", eventId);
      formData.append("eventName", eventName);
      formData.append("backgroundImage", backgroundImage);

      // Append file data

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await axios.post(
        "http://localhost:5000/api/participants",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIdCard([...idCard, response.data]); // Update state with new ID card
      fetchData(eventId);
      toggleModal();
      toast.success("ID CARD created successfully!", "Success");
    } catch (error) {
      console.error("Error creating participant:", error);
    } finally {
      setIsCreating(false); // Stop loading spinner
    }
  };

  const handleDownload = async (index) => {
    const idCardElement = document.getElementById(`id-card-${index}`);
    const downloadButton = document.getElementById(`download-button-${index}`);

    if (!idCardElement || !downloadButton) {
      console.error("Element not found");
      return;
    }

    downloadButton.style.display = "none";

    try {
      const dataUrl = await toPng(idCardElement, { quality: 1, pixelRatio: 4 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "id-card.png";
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
    } finally {
      downloadButton.style.display = "block";
    }
  };

  useEffect(() => {
    setBackgroundImage(designations[0]?.idcardimage);
  }, [designations]);

  console.log("backgroundImage", backgroundImage);
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, idCard.participantId, {
        format: "CODE128",
        displayValue: true,
        height: 60, // Adjust the height here as needed
      });
    }
  }, [idCard.participantId]);
  // Function to fetch designations from API
  const fetchDesignations = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events`);
      const filteredDesignations = response.data.filter(
        (categories) => categories._id === eventId
      );
      setDesignations(filteredDesignations);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };
  console.log("categories", designations);

  // useEffect(() => {
  //   // Pass the eventid you want to filter by
  // }, [eventId]);

  const navigate = useNavigate();

  const toggleModal = () => {
    setModal(!modal);
    fetchDesignations(eventId); 
  };

  const handleNavigate = () => {
    navigate(`/bulk-create-id?eventid=${eventId}&eventName=${eventName}`);
  };
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-gray-200 shadow-sm">
        <div className="flex h-16 mx-auto items-center justify-between px-4 lg:px-[80px]">
          <a className="flex items-center gap-2" href="/" rel="ugc">
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
            <span className="font-bold tracking-tight">
              Event ID Card Generator App
            </span>
          </a>
          <div className="flex gap-10">
            <button
              onClick={toggleModal}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-black text-white transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
            >
              Create ID
            </button>
            <button
              onClick={handleNavigate}
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
                    <h1 className="text-3xl font-bold text-gray-900">
                      Create ID
                    </h1>
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
                      <div className="grid-cols-2 grid  gap-6">
                        <div className="mt-4">
                          <label
                            htmlFor="institute"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Institute
                          </label>
                          <div className="mt-1">
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="institute"
                              placeholder="Enter your Institute"
                              required
                              value={institute}
                              onChange={(e) => setInstitute(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="designation"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Designation
                          </label>
                          <div className="mt-1">
                            <select
                              className="flex h-10 w-[100%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="designation"
                              placeholder="Enter your Designation"
                              required
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                            >
                              <option value="">Select Designation</option>
                              {designations.map((designation) =>
                                designation.categories.map(
                                  (category, index) => (
                                    <option key={index} value={category}>
                                      {category}
                                    </option>
                                  )
                                )
                              )}
                            </select>
                          </div>
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
                      <div className="flex justify-between gap-5">
                        <button
                          type="button"
                          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-gray-400 border border-transparent rounded-md hover:bg-gray-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={toggleModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-2 inline-flex bg-black w-full justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          disabled={isCreating} // Disable button when loading
                        >
                          {isCreating ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
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
                                  d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.97 7.97 0 014 12H2c0 2.21.896 4.21 2.343 5.657l1.414-1.366z"
                                ></path>
                              </svg>
                              Creating...
                            </>
                          ) : (
                            "Create"
                          )}
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

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <span class="loader"></span>
        </div>
      ) : (
        <div className="my-10">
          <div className="px-20 mb-10 font-bold text-2xl">
            {eventName} Event All ID Cards
          </div>
          <IdCardrender
            fetchData={fetchData}
            Dataid={Dataid}
            handleDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
}

export default CreateId;
