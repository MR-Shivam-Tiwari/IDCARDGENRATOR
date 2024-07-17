import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import toastr from "sweetalert2";
import { toast } from 'react-toastify';
function EventPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [Dataid, setDataid] = useState("");
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const [inputs, setInputs] = useState([]);
  const [currentInput, setCurrentInput] = useState("");

  const addCategory = () => {
    if (currentCategory.trim()) {
      setCategories([...categories, currentCategory.trim()]);
      setCurrentCategory("");
    }
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const [eventName, setEventName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null); // State to hold base64 encoded image
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventID] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setPhoto(base64);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        eventName,
        address,
        date,
        photo,
        categories, // Include categories array
      };

      const response = await axios.post(
        "http://localhost:5000/api/events",
        eventData
      );

      console.log("Event created:", response.data);
      toggleModal();
      fetchEvents();
      toast.success("Event created successfully!", "Success");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events/");
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };
  console.log("Events", events);

  const fetchData = async () => {
    try {
      const url = `http://localhost:5000/api/participants/event/${eventId}`;
      const response = await axios.get(url);
      console.log("Participants by EventId:", response.data); // Log fetched participants
      setDataid(response.data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching participants by eventId:", error);
      setDataid([]); // Clear state or handle error case
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);
  const handleTaskView = (groupId, groupName) => {
    setEventID(groupId);
    // Navigate to the /task route with the group ID and group name as parameters
    navigate(`/create-id?eventid=${groupId}&eventName=${groupName}`);
  };

  
  const handleDelete = (id) => {
    Swal.fire({
      title: "Archive Event?",
      text: "This will archive the event and it won't be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, archive it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`http://localhost:5000/api/events/archive/${id}`, {
            archive: true
          })
          .then((res) => {
            Swal.fire("Archived!", "Event has been archived.", "success");
            fetchEvents(); // Assuming fetchEvents is a function to fetch updated events list
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
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
          <button
            onClick={toggleModal}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-black text-white transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
          >
            Create Event
          </button>
        </div>
      </header>

      {showModal && (
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
                    Create an Event
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="eventName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Event Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="eventName"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Event Name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="address"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <label
                        htmlFor="Category"
                        className="block mb-1 text-sm font-medium text-gray-700"
                      >
                        Category
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={currentCategory}
                          onChange={(e) => setCurrentCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add Category"
                        />
                        <button
                          onClick={addCategory}
                          className="px-4 w-20 bg-black h-8 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-4">
                        {categories.length > 0 && (
                          <ul className="list-disc list-inside space-y-2">
                            {categories.map((category, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between text-gray-700"
                              >
                                <span>{category}</span>
                                <button
                                  onClick={() => removeCategory(index)}
                                  className="px-2 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            id="date"
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Select Event Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Photo
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            id="photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-10">
                      <button
                        type="button"
                        onClick={toggleModal}
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-gray-200 text-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-black text-white transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                      >
                        {loading ? "Creating..." : "Create Event"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Events</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <span class="loader"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events
              .slice()
              .reverse()
              .map((event) => (
                <>
                  <div
                    key={event._id}
                    class="relative h-64 cursor-pointer overflow-hidden rounded-lg"
                  >
                    {event.photoUrl ? (
                      <img
                        src={`data:image/jpeg;base64,${event.photoUrl}`}
                        alt={event.eventName}
                        className="w-full h-full object-cover"
                        width="600"
                        height="400"
                        style={{ aspectRatio: "600/400", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
                        No Image
                      </div>
                    )}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex gap-4 justify-between">
                        <button className="bg-yellow-400 text-black px-5 p-2 h-6 shadow-full flex items-center rounded font-bold  ">
                          {" "}
                          IDCARD - {event.participantCount}
                        </button>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleTaskView(event._id, event.eventName)
                            }
                            className="bg-orange-600 text-white px-5 p-2 rounded font-bold hover:bg-blue-700 "
                          >
                            {" "}
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="bg-gray-600 text-white px-5 p-2 rounded font-bold hover:bg-blue-700 "
                          >
                            {" "}
                            Archive
                          </button>
                        </div>
                      </div>
                      <div class="flex h-full flex-col justify-end">
                        <h3 class="text-3xl mb-1 font-bold text-white">
                          {event.eventName}
                        </h3>
                        <div class="flex items-center gap-2 mb-8 shadow-full  text-sm text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-4 w-4"
                          >
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="4"
                              rx="2"
                            ></rect>
                            <path d="M3 10h18"></path>
                          </svg>
                          <span className="font-bold">
                            {new Date(event.date).toDateString()}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-4 w-4"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span className="font-bold">{event.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPage;
