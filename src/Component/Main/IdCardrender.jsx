import React from 'react'

function IdCardrender() {
    return (
        <div>
            <section class="container mx-auto grid grid-cols-1 gap-4 py-20 md:grid-cols-2 lg:grid-cols-3">
                <div class="relative h-64 cursor-pointer overflow-hidden rounded-lg">
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

export default IdCardrender
