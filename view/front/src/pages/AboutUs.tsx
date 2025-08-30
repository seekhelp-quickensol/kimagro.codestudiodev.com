import { Trans, useTranslation } from "react-i18next";


export default function AboutUs() {
    const { t } = useTranslation();
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
          poster="../assets/images/about-poster.png"
        >
          <source src="../assets/images/video/about.mp4" type="video/mp4" />

        </video>

      </section>
      {/* Lime Green Text Section */}
      <section className="bg-[#C4E86B] p-8  md:p-12">
        <p className="text-center text-sm md:text-lg leading-relaxed max-w-4xl mx-auto">
        <Trans
        i18nKey="aboutUs.limeGreenSection.description"
        components={{ bold: <b /> }}
      />

        </p>
      </section>


      {/* Vision & Mission Section */}


      <section className="py-12 px-6 md:px-20 md:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:gap-12 md:items-start">

            {/* Vision */}
            <div className="flex-1 mb-9 md:mb-0 text-center md:border md:border-[#c4e86b] md:p-[5px] md:rounded md:min-h-[515px] md:py-8">
              <img
                src="../assets/images/icons/vision.png"
                alt="Our Vision"
                className="mx-auto  w-16 h-16 mb-4"
              />
              <h2 className="text-xl font-bold mission-ttl mb-4">{
                t("aboutUs.visionMission.vision.title")
                }</h2>
              <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
              {
                t("aboutUs.visionMission.vision.description")
                }
              </p>
            </div>

            {/* Mission */}
            <div className="flex-1 mb-9 md:mb-0 text-center md:border md:border-[#c4e86b] md:p-[5px] md:rounded md:min-h-[515px] md:py-8 md:px-5">
              <img
                src="../assets/images/icons/mission.png"
                alt="Our Mission"
                className="mx-auto w-16 h-16 mb-4"
              />
              <h2 className="text-xl font-bold mission-ttl mb-4">{
                t("aboutUs.visionMission.mission.title")
                }</h2>
              <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
              {
                t("aboutUs.visionMission.mission.description")
                }
              </p>
            </div>

            {/* Core Values */}
            <div className="flex-1  text-center md:border md:border-[#c4e86b] md:p-[5px] md:rounded md:min-h-[515px] md:py-8 md:px-5 md:px-5">
              <img
                src="../assets/images/icons/value.png"
                alt="Core Values"
                className="mx-auto w-16 h-16 mb-4"
              />
              <h2 className="text-xl font-bold text-[#6B1E1E] mb-6">{
                t("aboutUs.visionMission.coreValues.title")
                }</h2>
              <div className="space-y-6 text-gray-600 text-sm md:text-lg leading-relaxed">
                <div>
                  <h3 className="font-bold text-ttl">{
                t("aboutUs.visionMission.coreValues.qualityIntegrity.title")
                }</h3>
                  <p>
                   {  t("aboutUs.visionMission.coreValues.qualityIntegrity.description")}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-ttl">{
                 t("aboutUs.visionMission.coreValues.farmerEmpowerment.title")
                }</h3>
                  <p>
                  {
                 t("aboutUs.visionMission.coreValues.farmerEmpowerment.description")
                }
                  </p>
                </div>


                <div>
                  <h3 className="font-bold text-ttl">{
                 t("aboutUs.visionMission.coreValues.collaborationGrowth.title")
                }</h3>
                  <p>
                  {
                 t("aboutUs.visionMission.coreValues.collaborationGrowth.description")
                } </p>
                </div>


              </div>
            </div>

          </div>
        </div>
      </section>



      {/* team Section */}

      <section >
        <div className="container mx-auto">
          <h2 className="text-center text-xl font-bold  text-green lg:text-3xl">
            {t("aboutUs.team.title")}
          </h2>

          <div className="flex flex-col md:flex-row md:gap-8 py-12 md:py-20">
            {/* Dr. Vijaya */}
            <div className="bg-[#C4E86B] p-6 flex-1 md:rounded-lg  md:mb-0">
              <div className="flex items-center">
                <img
                  src="../assets/images/about-images/vijaya.png"
                  alt="Dr. Vijaya Baragje (Patil)"
                  className="w-20 h-20 object-cover rounded-full mt-2"
                />      
                <div className="mt-4">
                  <h3 className="text-sm md:text-lg  font-bold">
                    {t("aboutUs.team.vijaya.name")}
                  </h3>
                  <p className="text-sm md:text-lg ">
                    {t("aboutUs.team.vijaya.title")}
                  </p>
                </div>
              </div>

              <p className="text-sm md:text-lg  leading-relaxed py-5">
                {t("aboutUs.team.vijaya.description")}
              </p>
            </div>

            {/* Dinesh Patil */}
            <div className=" p-6 flex-1 md:rounded-lg  md:mb-0  md:border  md:bg-[#C4E86B]">
              <div className="flex items-center">
                <img
                  src="../assets/images/about-images/dinesh.png"
                  alt="Dinesh Patil"
                  className="w-24 h-24 object-cover rounded-full mb-4"
                />
                <div className="mt-4">
                  <h3 className="text-sm md:text-lg  font-bold">
                    {
                      t("aboutUs.team.dinesh.name")
                    }
                  </h3>
                  <p className="text-sm md:text-lg  mb-4">{
                    t("aboutUs.team.dinesh.title")
                }</p>
                </div>
              </div>
              <p className="text-sm md:text-lg  leading-relaxed py-5">
                {t("aboutUs.team.dinesh.description")}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* teams Section */}

      <section className="bg-[#C4E86B] py-10 px-6 md:px-20 md:mb-6 md:bg-[#ffffff]">
          <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Profile 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 md:w-31 md:h-31 md:bg-[#C4E86B]  rounded-full border-1 border-white md:border-[#c4e86b] flex items-center justify-center overflow-hidden">
              <img
                src="../assets/images/about-images/Sangeeta.png"
                alt="Sangeeta Patil"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold mt-4">{
          t("aboutUs.teams.sangeeta.name")
          }</h3>
            <p className="text-sm">
          {t("aboutUs.teams.sangeeta.title")}
            </p>
          </div>

          {/* Profile 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28  md:w-31 md:h-31 md:bg-[#C4E86B]  rounded-full border-1 border-white md:border-[#c4e86b] flex items-center justify-center overflow-hidden">
              <img
                src="../assets/images/about-images/milind.png"
                alt="Milind Bargaje"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold mt-4">{
          t("aboutUs.teams.milind.name")
          }</h3>
            <p className="text-sm">
              {
          t("aboutUs.teams.milind.title")
              }
            </p>
          </div>

          {/* Profile 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28  md:w-31 md:h-31 md:bg-[#C4E86B]   rounded-full border-1 border-white md:border-[#c4e86b] flex items-center justify-center overflow-hidden">
              <img
                src="../assets/images/about-images/jayashree.png"
                alt="Jayashree Pawar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold mt-4">{
          t("aboutUs.teams.jayashree.name")
          }</h3>
            <p className="text-sm">{
          t("aboutUs.teams.jayashree.title")
          }</p>
          </div>

          {/* Profile 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28  md:w-31 md:h-31 md:bg-[#C4E86B]  rounded-full border-1 border-white md:border-[#c4e86b] flex items-center justify-center overflow-hidden">
              <img
                src="../assets/images/about-images/ramdas.png"
                alt="Ramdas Pawar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold mt-4">{
          t("aboutUs.teams.ramdas.name")
          }</h3>
            <p className="text-sm">{
          t("aboutUs.teams.ramdas.title")
          }</p>
          </div>
        </div>
        </div>
      </section>

    </div>
  );
}
