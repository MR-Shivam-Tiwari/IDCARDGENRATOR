import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function EventPage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => {
        setShowModal(!showModal);
    };
    return (
        <div >
            <header class="sticky top-0 z-50 w-full bg-gray-200 shadow-sm">
                <div class=" flex h-16 mx-auto items-center justify-between px-4 lg:px-[80px]">
                    <a class="flex items-center gap-2" href="#" rel="ugc">
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
                            class="h-6 w-6"
                        >
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span class="font-bold tracking-tight">Event App</span>
                    </a>
                    <button onClick={toggleModal} class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium  bg-black text-white transition-colors  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                        Create Event
                    </button>
                </div>
            </header>
            {
                showModal && (
                    <div
                        id="default-modal"
                        tabIndex="-1"
                        aria-hidden="true"
                        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
                    >
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow ">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                                    <div>
                                        <h1 class="text-3xl font-bold text-gray-900 ">
                                            Create a Event
                                        </h1>

                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
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
                                <div class="w-full max-w-2xl mx-auto py-5 px-4 sm:px-6 lg:px-8 overflow-y-auto max-h-[500px] sm:max-h-screen">
                                    <div class="space-y-6">
                                        <form class="space-y-6">
                                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label
                                                        for="name"
                                                        class="block text-sm font-medium text-gray-700 "
                                                    >
                                                        Name
                                                    </label>
                                                    <div class="mt-1">
                                                        <input
                                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            id="name"
                                                            placeholder="Enter your name"
                                                            required=""
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label
                                                        for="Address"
                                                        class="block text-sm font-medium text-gray-700 "
                                                    >
                                                        Address
                                                    </label>
                                                    <div class="mt-1">
                                                        <input
                                                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            id="address"
                                                            placeholder="Enter your Address"
                                                            required=""
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                            <div>
                                                <label
                                                    for="date"
                                                    class="block text-sm font-medium text-gray-700 "
                                                >
                                                    Date
                                                </label>
                                                <div class="mt-1">
                                                    <input
                                                        type='date'
                                                        class="flex h-10 w-[100%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        id="phone"
                                                        placeholder="Enter your Phone"
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            {/* <div>
                                                <label
                                                    for="description"
                                                    class="block text-sm font-medium text-gray-700 "
                                                >
                                                    Bug Description
                                                </label>
                                                <div class="mt-1">
                                                    <textarea
                                                        class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                                        id="description"
                                                        placeholder="Describe the bug you encountered"
                                                        required=""
                                                    ></textarea>
                                                </div>
                                            </div> */}
                                            <div>
                                                <label
                                                    for="screenshot"
                                                    class="block text-sm font-medium text-gray-700 "
                                                >
                                                    Upload a Image
                                                </label>
                                                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                    <div class="space-y-1 text-center">
                                                        <svg
                                                            class="mx-auto h-12 w-12 text-gray-400"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            viewBox="0 0 48 48"
                                                            aria-hidden="true"
                                                        >
                                                            <path
                                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                stroke-width="2"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            ></path>
                                                        </svg>
                                                        <div class="flex text-sm text-gray-600 ">
                                                            <label
                                                                for="screenshot"
                                                                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                            >
                                                                <span>Upload a file</span>
                                                                <input
                                                                    id="screenshot"
                                                                    class="sr-only"
                                                                    type="file"
                                                                    name="screenshot"
                                                                />
                                                            </label>
                                                            <p class="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p class="text-xs text-gray-500 ">
                                                            PNG, JPG, GIF up to 10MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex justify-end">
                                                <button
                                                    type="submit"
                                                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Create Event
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <section class="container mx-auto grid grid-cols-1 gap-4 py-20 md:grid-cols-2 lg:grid-cols-3">
                <div onClick={()=> navigate('/create-id')} class="relative h-64 cursor-pointer overflow-hidden rounded-lg">
                    <img
                        src="/placeholder.svg"
                        alt="Event Image"
                        width="600"
                        height="400"
                        class="h-full w-full object-cover"

                        style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div class="flex h-full flex-col justify-end">
                            <h3 class="text-xl font-bold text-white">Summer BBQ</h3>
                            <div class="flex items-center gap-2 text-sm text-white">
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
                                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                    <path d="M3 10h18"></path>
                                </svg>
                                <span>June 15, 2023</span>
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
                                <span>Central Park</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative h-64 overflow-hidden rounded-lg">
                    <img
                        src="/placeholder.svg"
                        alt="Event Image"
                        width="600"
                        height="400"
                        class="h-full w-full object-cover"
                        style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div class="flex h-full flex-col justify-end">
                            <h3 class="text-xl font-bold text-white">Tech Meetup</h3>
                            <div class="flex items-center gap-2 text-sm text-white">
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
                                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                    <path d="M3 10h18"></path>
                                </svg>
                                <span>July 10, 2023</span>
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
                                <span>Downtown Office</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="relative h-64 overflow-hidden rounded-lg">
                    <img
                        src="/placeholder.svg"
                        alt="Event Image"
                        width="600"
                        height="400"
                        class="h-full w-full object-cover"
                        style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div class="flex h-full flex-col justify-end">
                            <h3 class="text-xl font-bold text-white">Charity Gala</h3>
                            <div class="flex items-center gap-2 text-sm text-white">
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
                                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                    <path d="M3 10h18"></path>
                                </svg>
                                <span>August 1, 2023</span>
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
                                <span>Grand Hotel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default EventPage
