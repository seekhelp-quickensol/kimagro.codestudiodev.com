import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Search from "../Search";
 
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  
  // Get current language from i18n
  const [selectedLang, setSelectedLang] = useState<"en" | "hi">(
    (i18n.language as "en" | "hi") || "en"
  );
  const langRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (i18n.language !== "en") {
      i18n.changeLanguage("en");
      setSelectedLang("en");
    }
  }, []);
  
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (langRef.current && !langRef.current.contains(event.target as Node)) {
      if (open){
        setOpen(false);
      };
    }
  }

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [open]);



  const location = useLocation();
  const isHome = location.pathname === "/";

  // const menuItems = [
  //   { path: "/about", label: "About Us" },
  //   { path: "/product-categories", label: "Products" },
  //   { path: "/innovations", label: "Our innovations" },
  //   { path: "/media", label: "Media" },
  //   { path: "#", label: "App" },
  //   // { path: "/language", label: "Select language" },
  //   // { path: "/search", label: "Search" },
  //   { path: "/contact", label: "Contact Us" },
  // ];

  useEffect(() => {
    setSelectedLang(i18n.language as "en" | "hi");
  }, [i18n.language]);


  const menuItems = [
    { path: "/about", label: t("header.About Us") },
    { path: "/product-categories", label: t("header.Products") },
    { path: "/innovations", label: t("header.Our innovations") },
    { path: "/media", label: t("header.Media") },
    // { path: "#", label: t("header.App") },
    { path: "/contact", label: t("header.Contact Us") },
  ];

  const changeLang = (lang: "en" | "hi") => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
    setOpen(false);
  };

  return (
    <header
      className={` top-0 w-full z-50 transition-all ${
        isHome
          ? "bg-[linear-gradient(91.67deg,_#FCF9C6_2.46%,_#FFFFFF_22.35%,_#FDFAC7_48.74%,_#FAE3B1_78.26%,_#EAD4AD_93.27%)]"
          : "bg-[linear-gradient(270deg,#CFF24D_8.8%,#73A640_40.2%,#175A33_71.6%)] shadow-sm"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between  py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="../assets/images/Kimaya.png"
              alt="Logo"
              className="h-10 sm:h-10 lg:h-[70px]"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="flex items-center justify-between px-4 py-3">
            <nav className="hidden md:flex space-x-6 md:justify-end">
              {menuItems.slice(0, 5).map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="text-gray-800 hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language + Search + Menu Toggle */}
            <div className="flex items-center space-x-4">
              {/* Mobile Select Dropdown */}
              <select
                value={selectedLang}
                onChange={(e) => changeLang(e.target.value as "en" | "hi")}
                className="text-sm border-none bg-transparent focus:outline-none md:hidden"
              >
                <option value="en">{t("header.English")}</option>
                <option value="hi">{t("header.Hindi")}</option>
              </select>

              {/* Desktop Flag Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 text-gray-800 hover:text-green-600 transition bg-transparent border-none focus:outline-none"
                >
                  {selectedLang === "en" ? t("header.English") : t("header.Hindi")}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute mt-2 w-40 bg-white border rounded-lg shadow-lg p-2 z-50 right-0" ref ={langRef}>
                    <div
                      onClick={() => changeLang("en")}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <img
                        src="../assets/flags/en.png"
                        alt="English"
                        className="w-5 h-5 rounded-full"
                      />
                   {t("header.English")}
                    </div>
                    <div
                      onClick={() => changeLang("hi")}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <img
                        src="../assets/flags/hi.png"
                        alt="Hindi"
                        className="w-5 h-5 rounded-full"
                      />
                     {t("header.Hindi")}
                    </div>
                  </div>
                )}
              </div>

              <Search />
              


              {/* Mobile Menu Toggle */}
              <button onClick={() => setMenuOpen(true)} className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-opacity-40 md:hidden">
            <div className="absolute top-4 right-0 w-[50%] max-w-[260px] bg-white rounded-lg shadow-lg p-5">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3"
                onClick={() => setMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Menu Items */}
              <nav className="flex flex-col space-y-3 mt-5">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="pb-1 border-b border-lime-400 text-gray-800 hover:text-green-600 transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
