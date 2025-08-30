import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useCategories } from "../hooks/useFetchCategories";
import { useBanner } from "../hooks/useBanner";
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { categories } = useCategories();

  const { banner, loading: bannerLoading, error: bannerError } = useBanner();

  const currentLang = i18n.language;

  return (
    <div className="products-page">
      <section className="hero-section relative w-full h-[80vh] overflow-hidden">
        {/* Show loading state */}
        {bannerLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="ml-3 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Show error state */}
        {bannerError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-lg text-red-600">
              Error loading banner: {bannerError}
            </div>
          </div>
        )}
        {/* ✅ Optimized video */}
        {banner && !bannerLoading && (
          <>
            <video
              className="hero-video absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="none"

              poster={"/assets/images/hero-poster.jpg"}
            >
              <source src={
                banner.upload_video
                  ? `${import.meta.env.VITE_APP_BACKEND}uploads/videos/${banner.upload_video}`
                  : "/assets/images/farm-video.mp4"
              }

                type="video/mp4" />
              {t("homePage.hero.videoError")}

            </video>



            {/* ✅ Dark overlay for text readability */}
            <div className="absolute inset-0 "></div>

            {/* ✅ Hero content */}
            <div className="hero-content relative">
              <h2 className="leading-snug [text-shadow:none]">
                <p className="font-bold text-[#4A772F] text-2xl sm:text-3xl lg:text-4xl">

                  {currentLang === 'hi' ? banner?.title_hindi : banner?.title_english}
                </p>
                <p className="text-[#A7A9AC] text-2xl sm:text-3xl lg:text-4xl">
                  {currentLang === 'hi' ? banner?.sub_title_hindi : banner?.sub_title_english}
                </p>
              </h2>
            </div>

          </>
        )
        }


      </section>

      {/* Intro Section */}
      {banner && !bannerLoading && (
        <>
          <section className="intro-section p-8  md:p-12">

            <h3 className="text-center text-sm mb-3 font-bold  text-green lg:text-2xl">{t("home.intro.title")}</h3>
            <p>
              {currentLang === 'hi' ? banner?.descr_hindi : banner?.descr_english}

            </p>
          </section>
        </>
      )}






      {/* Product Categories */}
      <section className="categories-section md:my-[50px] mb-6">
        <div className="container mx-auto">
          <h3 className="text-center font-bold  lg:text-2xl mission-ttl mb-5 mt-8 md:mb-12 md:mt-12">
            {t("home.categories.title")}
          </h3>
          <div className="categories-grid grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 md:mb-[50px]">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat, index) => (
                <Link
                  key={index}
                  to={`/product-categories/${cat.id}`}
                  className="category-card flex flex-col items-center text-center cursor-pointer my-[25px]"
                >
                  <img src={cat?.icon} alt={cat?.name} />
                  <p>{i18n.language === 'hi' ? cat?.nameHindi : cat?.name}</p>
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center col-span-4">
                <p className="text-gray-500">{t("home.categories.noCategories")}</p>
              </div>
            )}

          </div>
        </div>
      </section>
    </div >

  );
}
