import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useInnovations } from "../hooks/useInnovations";
import i18n from "../i18n";

export default function Innovation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { innovations } = useInnovations();

  
  const currentLang = i18n.language;

  return (
    <div className="bg-white text-gray-800">
      {/* Video Section */}
      <section className="hero-section">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="../assets/images/innovation.png"
        >
          <source src="../assets/images/video/innovation.mp4" type="video/mp4" />
        </video>

      </section>

      {/* Our Innovations Section */}
      <section className="bg-[#CFF24D] p-8 md:p-12">
        <div className="container mx-auto">
          <div className=" mx-auto text-center md:text-left">
            <h3 className="font-semibold md:text-base lg:text-2xl">

              <Trans i18nKey="innovationPage.HeroSection.title" />
          
              <span className="font-bold lg:text-2xl">{t("innovationPage.HeroSection.subtitle")}</span>
            </h3>

            <p className="mt-4 text-sm md:text-lg leading-relaxed">
            <Trans i18nKey="innovationPage.HeroSection.description" />
             
            </p>
          </div>
        </div>
      </section>



      {/* Key Technology Platforms Section */}
      <section className="bg-white p-8 md:p-12">
        <div className="container mx-auto">
          <div className=" mx-auto text-left md:text-center">
            <p className="text-sm md:text-base">
              {t("innovationPage.keySection.description")}
              
            </p>

            <h4 className="mt-4 font-bold text-base md:text-lg lg:text-2xl">
            {t("innovationPage.keySection.title")}
            </h4>

            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            
              <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/innovation-details")}>
                <img
                  src="../assets/images/key-technology/soil reboot.png"
                  alt="Soil Reboot"
                  className="w-20 md:w-28 rounded-lg"
                />
                <p className="mt-2 font-semibold text-green-800">Soil Reboot</p>
              </div>
 
              <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/innovation-details")}>
                <img
                  src="../assets/images/key-technology/bio balace.png"
                  alt="Bio-Balance"
                  className="w-20 md:w-28 rounded-lg"
                />
                <p className="mt-2 font-semibold text-green-800">Bio-Balance</p>
              </div>

             
              <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/innovation-details")}>
                <img
                  src="../assets/images/key-technology/bio balace.png"
                  alt="EN"
                  className="w-20 md:w-28 rounded-lg"
                />
                <p className="mt-2 font-semibold text-green-800">EN®</p>
              </div>

              
              <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate("/innovation-details")}>
                <img
                  src="../assets/images/key-technology/soil reboot.png"
                  alt="M2BM"
                  className="w-20 md:w-28 rounded-lg"
                />
                <p className="mt-2 font-semibold text-green-800">M2BM</p>
              </div>
            </div> */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {innovations && innovations.map((innovation, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => navigate(`/innovation-details/${innovation.id}`)}
                >
                  <img
                    src={`${import.meta.env.VITE_APP_BACKEND}uploads/images/${innovation.upload_icon}`}
                    alt={currentLang === 'hi' ? innovation.bio_balance_hindi : innovation.bio_balance_eng}
                    className="w-20 md:w-28 rounded-lg"
                  />
                  {/* <p className="mt-2 font-semibold text-green-800">
                    {currentLang === 'hi' ? innovation.bio_balance_hindi : innovation.bio_balance_eng}
                  </p> */}
                </div>
              ))}
          </div>
          </div>
        </div>
      </section>









    </div>
  );
}
