import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../Images/image 1.png'
function Navbar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showslidebar, setslidebarl] = useState(false);

  const toggleModal = () => {
    navigate("/contact-us")
  };
  const togglesidebar = () => {
    setslidebarl(!showslidebar);
  };

  const [activePage, setActivePage] = useState("");

  const handleNavigate = (path) => {
    setActivePage(path);
    navigate(path);
  };

  return (
    <div>
      <header class="flex josefin-sans-bold h-14 lg:h-20 w-full shrink-0 items-center px-4 md:px-6 ">
        <div className="lg:hidden mb-1 " onClick={togglesidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            class="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </div>
        <div
          class="mr-3 ml-2 gap-1  hidden lg:block lg:flex flex  items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="" className="w-40 p-2 h-20" />
        </div>
        <nav
          aria-label="Main"
          data-orientation="horizontal"
          dir="ltr"
          class="relative z-10 max-w-max flex-1 items-center justify-center hidden lg:flex"
        >
          
          <div class="absolute left-0 top-full flex justify-center"></div>
        </nav>
        <div class="ml-auto flex items-center">
          <button
            onClick={toggleModal}
            class="inline-flex items-center bg-[#D9D9D9]  justify-center whitespace-nowrap rounded-lg md:rounded-md lg:rounded-md  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-5   text-md lg:text-lg md:text-lg font-semibold"
          >
            CONTACT
          </button>
        </div>
      </header>
      
    </div>
  );
}

export default Navbar;
