import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import IdCardrender from "./IdCardrender";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { toPng } from 'html-to-image';
import JsBarcode from "jsbarcode";
function CreateId() {
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [idCard, setIdCard] = useState([]);
 
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
        if (id === 'backgroundImage') {
            setBackgroundImage(file);
        } else if (id === 'profilePicture') {
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
      const url = `https://kdemapi.insideoutprojects.in/api/participants/event/${eventId}`;
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



  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData();
        
        // Append non-file data
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('designation', designation);
        formData.append('idCardType', selectedIdCardType);
        formData.append('institute', institute);
        formData.append('eventId', eventId);
        formData.append('eventName', eventName);
        
        // Append file data
        if (backgroundImage) {
            formData.append('backgroundImage', backgroundImage);
        }
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        const response = await axios.post(
            "https://kdemapi.insideoutprojects.in/api/participants",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        setIdCard([...idCard, response.data]); // Update state with new ID card
        fetchData(eventId);
        toggleModal();
        toast.success("ID CARD created successfully!", "Success");
    } catch (error) {
        console.error("Error creating participant:", error);
    }
};


  
const handleDownload = async (index) => {
  const idCardElement = document.getElementById(`id-card-${index}`);
  const downloadButton = document.getElementById(`download-button-${index}`);

  if (!idCardElement || !downloadButton) {
    console.error('Element not found');
    return;
  }

  downloadButton.style.display = "none";

  try {
    const dataUrl = await toPng(idCardElement, { quality: 1, pixelRatio: 4 });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'id-card.png';
    link.click();
  } catch (error) {
    console.error('Error generating PNG:', error);
  } finally {
    downloadButton.style.display = "block";
  }
};

  const [designations, setDesignations] = useState([]); // State to hold fetched designations
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
      const response = await axios.get(`https://kdemapi.insideoutprojects.in/api/events`);
      const filteredDesignations = response.data.filter(
        (categories) => categories._id === eventId
      );
      setDesignations(filteredDesignations);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };
  console.log("categories", designations);

  useEffect(() => {
    fetchDesignations(eventId); // Pass the eventid you want to filter by
  }, [eventId]);

  const navigate = useNavigate();

  const toggleModal = () => {
    setModal(!modal);
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
            <span className="font-bold tracking-tight">Event ID Card Generator App</span>
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
                      {/* <div>
                                                <label htmlFor="idCardType" className="block text-sm font-medium text-gray-700">
                                                    Select ID Card Type
                                                </label>
                                                <div className="mt-1">
                                                    <ul className="flex items-center gap-5 justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                                        <li className="w-full">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleClick('vertical')}
                                                                className={`inline-flex items-center px-4 py-3 h-[50px] border text-black rounded w-full ${selectedIdCardType === 'vertical' ? 'bg-black text-white' : 'bg-gray-200'}`}
                                                            >
                                                                <div className={`border h-8 w-6 grid py-[2px] items-center justify-center rounded-[2px] me-2 ${selectedIdCardType === 'vertical' ? 'border-black' : 'border-white'}`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-border-width" viewBox="0 0 16 16">
                                                                        <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                                                    </svg>
                                                                </div>
                                                                Vertical
                                                            </button>
                                                        </li>
                                                        <li className="w-full">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleClick('horizontal')}
                                                                className={`inline-flex items-center px-4 py-3 border text-black rounded w-full ${selectedIdCardType === 'horizontal' ? 'bg-black text-white' : 'bg-gray-200'}`}
                                                            >
                                                                <div className={`border flex items-center justify-between px-[2px] h-6 w-10 rounded-[2px] me-2 ${selectedIdCardType === 'horizontal' ? 'border-white' : 'border-black'}`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-border-width" viewBox="0 0 16 16">
                                                                        <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5" />
                                                                    </svg>
                                                                </div>
                                                                Horizontal
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div> */}
                      <div>
                        <label
                          htmlFor="backgroundImage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Upload Background Image
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id="backgroundImage"
                            name="backgroundImage"
                            className="file:hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
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
                      <div className="flex justify-end gap-5">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-gray-400 border border-transparent rounded-md hover:bg-gray-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={toggleModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-2 inline-flex  bg-black justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Create
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
      {/* <div className="flex justify-center  my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full container mx-auto px-4">
          {idCard.map((card, index) => (
            <div key={index} className="relative p-4">
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
                <div
                  className={`relative z-10 flex justify-center h-full text-white`}
                >
                  <div
                    className={`overflow-hidden flex-col justify-center mt-[190px] border-white`}
                  >
                    <h2 className="text-lg text-center mb-2 font-bold">
                      {card.firstName} {card.lastName}
                    </h2>
                    <img
                      src={card.profilePicture}
                      alt="Profile"
                      className="w-[170px] h-[170px] object-cover"
                    />
                    <p className="text-md font-semibold mt-2 text-center">
                      {card.institute}
                    </p>
                    <p className="text-md font-semibold mt-10 text-black font-semibold text-center">
                      {card.designation}
                    </p>
                    <div className="h-[10px]">
                      <svg ref={barcodeRef}></svg>
                    </div>
                    <div className="text-black mt-10 text-center font-bold">
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
    

      <hr /> */}
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
