import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../Images/image 1.png"
import Insta from "../Images/Rectangle72.png"
import Facebook from "../Images/Rectangle71.png"
function Footer() {
    const navigate = useNavigate();
    return (


        <footer class=" ">
            <div
                className="w-full bg-white overflow-hidden flex flex-col items-start justify-start pt-[50px] px-0 pb-[49.5px] box-border gap-[23px] leading-[normal] tracking-[normal] text-left text-mini text-black font-open-sans "
            >
                <div className="w-[225px] flex flex-row items-start justify-start py-0 px-7 box-border">
                    <img
                        className="h-[98px] flex-1 relative max-w-full overflow-hidden object-cover"
                        loading="lazy"
                        alt=""
                        src={Logo}
                    />
                </div>
                <div className="self-stretch flex flex-col items-start justify-start  box-border border-b-[4px] max-w-full">
                    <div className="w-[332px] flex flex-row items-start justify-between py-0 pr-5 pl-0 box-border  max-w-full gap-[20px]">
                        <div className="rounded-t-3xs rounded-t-lg  bg-gray-300 flex flex-row items-start justify-start pt-3.5 pb-3 pr-[59px] pl-16">
                            <div className="h-[46px] w-[195px] relative rounded-t-3xs rounded-b-none bg-gray-300 hidden" />
                            <div className="relative  inline-block min-w-[72px] z-[1]">
                                Bangalore
                            </div>
                        </div>
                        <div className="flex flex-col items-start justify-start pt-3.5 px-0 pb-0">
                            <div className="relative inline-block min-w-[37px]">Delhi</div>
                        </div>
                    </div>
                    {/* <div className="self-stretch h-1 relative bg-gainsboro" /> */}
                </div>
                <section className="self-stretch flex flex-row items-start justify-start py-0 pr-7 pl-[27px] box-border max-w-full text-left text-mini text-black font-open-sans">
                    <div className="flex-1 flex flex-col items-start justify-start gap-[13px] max-w-full">
                        <div className="self-stretch relative">
                            <p className="m-0">
                                <span className="font-semibold font-open-sans">
                                    Bengaluru Whitefield:
                                </span>
                                <span>
                                    {" "}
                                    704, 2nd Floor, ASN Signature, Varthur Road, near Laughing
                                    Waters Siddapura, Ramagondanahalli, Bengaluru, Karnataka 560066.
                                </span>
                            </p>
                            <p className="m-0">&nbsp;</p>
                            <p className="m-0">
                                <span className="font-semibold font-open-sans">{`Call: `}</span>
                                <span>+91 81973 41114</span>
                            </p>
                            <p className="m-0">
                                <span className="font-semibold font-open-sans">Mail:</span>
                                <span> info.wfblr@mindfultms.in</span>
                            </p>
                        </div>
                        <div className="relative">
                            <p className="m-0">
                                <span className="font-semibold font-open-sans">{`Bengaluru Hebbal `}</span>
                                <span>
                                    – Aster CMI#43/2, New Airport Road, NH-7, Outer Ring Rd,
                                    Sahakar Nagar, Bengaluru, Karnataka 560092
                                </span>
                            </p>
                            <p className="m-0">&nbsp;</p>
                            <p className="m-0">
                                <span className="font-semibold font-open-sans">{`Call: `}</span>
                                <span>+919606969296</span>
                            </p>
                            <p className="m-0">
                                <span className="font-semibold font-open-sans">Mail:</span>
                                <span> info.wfblr@mindfultms.in</span>
                            </p>
                        </div>
                    </div>
                </section>
                <section className="self-stretch h-[115.5px] flex flex-row items-start justify-start py-0 pr-7 pl-[27px] box-border max-w-full text-center text-mini text-black font-open-sans">
                    <div className="self-stretch flex-1 flex flex-col items-start justify-start gap-[30px] max-w-full">
                        <div className="w-[260px] flex-1 flex flex-col items-start justify-start gap-[15px]">
                            <div className="relative font-semibold inline-block min-w-[42px]">
                                Social
                            </div>
                            <div className="self-stretch flex-1 flex flex-row items-start justify-start gap-[20px]">
                                <img
                                    className="h-[50px] w-[50px] relative rounded-3xs object-cover min-h-[50px]"
                                    loading="lazy"
                                    alt=""
                                    src={Facebook}
                                />
                                <img
                                    className="h-[50px] w-[50px] relative rounded-3xs object-cover min-h-[50px]"
                                    loading="lazy"
                                    alt=""
                                    src={Insta}
                                />
                                <div className="self-stretch flex-1 relative rounded-3xs bg-gainsboro" />
                                <div className="self-stretch flex-1 relative rounded-3xs bg-gainsboro" />
                            </div>
                        </div>
                        <div className="self-stretch h-[0.5px] relative box-border border-t-[0.5px] border-solid border-black" />
                    </div>
                </section>
            </div>
        </footer>
    );
}

export default Footer;
