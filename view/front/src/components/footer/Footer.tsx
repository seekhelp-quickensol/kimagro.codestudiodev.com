import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      className="bg-cover bg-center text-white  py-5 md:py-[50px] md:h-[400px]"
      style={{ backgroundImage: "url('../assets/images/footer-bg.png')" }}
    >
      <div className="container mx-auto px-4 py-8 md:pt-[100px]">
        {/* Mobile View */}
        <div className="flex flex-col sm:hidden ">
          {/* Top Row: Logo + Links */}
          <div className="flex justify-between items-start ">
            {/* Left Side: Logo & Info */}
            <div>
              <img
                src="../assets/images/Kimaya.png"
                alt="Kimeya Agro Solutions"
                className="h-10 mb-3"
              />
              <p className="text-sm leading-5 ">
                {
                t("footer.companyName")
                }
               <br />
               {
                t("footer.address")
               }
               <br />
               {
                t("footer.customerCare")
               }
               <br />
              {
                t("footer.email")
              }
              </p>
              {/* Social Icons */}
              <div className="flex space-x-3 mt-3">
                <a href="https://youtube.com/@sangeetapatil-pw6dv?si=Hb9u0IWT57rsAaaR"><img src="../assets/images/brand-02.svg" alt="Facebook" className="h-5" /></a>
                <a href="https://www.instagram.com/sangeeta.patil.334?igsh=bHp5dTV3MDE1ZzJr"><img src="../assets/images/brand-04.svg" alt="Instagram" className="h-5" /></a>
                <a href="https://www.facebook.com/share/1AG1VtYQ4K/"><img src="../assets/images/brand-05.svg" alt="YouTube" className="h-5" /></a>
              </div>
            </div>

            {/* Right Side: Links */}
            <div className="flex flex-col space-y-1 text-sm text-right mt-8">
              <Link to="/about">&gt; {
                t("footer.links.about")
            }</Link>
              <Link to="/products">&gt; {
                t("footer.links.products")
            }</Link>
              <Link to="/innovations">&gt; 
              {
                t("footer.links.innovations")
              }
              </Link>
              <Link to="/media">&gt; {
                t("footer.links.media")
            }</Link>
              <Link to="/app">&gt; {
                t("footer.links.app")
            }</Link>
              <Link to="/contact">&gt; {
                t("footer.links.contact")
              }</Link>
            </div>
          </div>
        </div>

        {/* Desktop View */}
     {/* Desktop View */}
<div className="hidden sm:grid grid-cols-2 gap-8 ">
  {/* Left Section */}
  <div>
    <img src="../assets/images/Kimaya.png" alt="Kimeya Agro Solutions" className="h-12 mb-4" />
    <p className="mb-1">
      {t("footer.companyName")}
    </p>
    <p className="mb-1">
      {t("footer.address")}
    </p>
    <p className="mb-1">{
      t("footer.customerCare")
      }</p>
    <p className="mb-4">{
      t("footer.email")
}</p>
    <div className="flex space-x-4">
      <a href="#"><img src="../assets/images/brand-02.svg" alt="Facebook" className="h-6" /></a>
      <a href="#"><img src="../assets/images/brand-04.svg" alt="Instagram" className="h-6" /></a>
      <a href="#"><img src="../assets/images/brand-05.svg" alt="YouTube" className="h-6" /></a>
    </div>
  </div>

  {/* Right Section with Two Columns */}
  <div className="grid grid-cols-2 gap-x-10 md:items-start md:mt-20">
    <div className="flex flex-col space-y-2">
      <Link to="/about">&gt; {
        t("footer.links.about")
      }</Link>
      <Link to="/products">&gt; {
        t("footer.links.products")
      
    }</Link>
      <Link to="/innovations">&gt; 
      {
        t("footer.links.innovations")
      }
      </Link>
    </div>
    <div className="flex flex-col space-y-2">
      <Link to="/media">&gt; 
      {
        t("footer.links.media")
      }
      </Link>
      <Link to="/app">&gt; {
        t("footer.links.app")
    }</Link>
      <Link to="/contact">&gt; {

        t("footer.links.contact")
      }</Link>
    </div>
  </div>
</div>

      </div>

      {/* Bottom Bar */}
      {/* <div className="bg-black bg-opacity-40 py-3 text-center text-xs">
        &copy; {new Date().getFullYear()} Kimeya Agro Solutions. All rights reserved.
      </div> */}
    </footer>
  );
}
