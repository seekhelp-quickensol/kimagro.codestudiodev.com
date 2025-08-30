import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useProductDetails from "../hooks/useProductDetails";
import i18n from "../i18n";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef, useState } from "react";

interface SliderSettings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  arrows?: boolean;
  asNavFor?: Slider | undefined; // Updated to match react-slick
  afterChange?: (index: number) => void;
  beforeChange?: (_:any,index: number) => void;
  focusOnSelect?: boolean;
  responsive?: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
    };
  }>;
}

export default function ProductDetails() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLang: string = i18n.language;
  const { product } = useProductDetails();

  const docLink: string | undefined = currentLang === "hi"
    ? product?.upload_brouch_hindi
    : product?.upload_brouch_english;

  const mainSliderRef = useRef<Slider>(null); // Keep as Slider | null
  const navSliderRef = useRef<Slider>(null); // Keep as Slider | null
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Settings for main slider
  // const mainSliderSettings: SliderSettings = {
  //   dots: false,
  //   infinite: (product?.upload_multiple_img?.length ?? 0) > 1,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: true,
  //   asNavFor: navSliderRef.current ?? undefined, // Convert null to undefined
  //   afterChange: (index: number) => setCurrentSlide(index),
  // };
  const mainSliderSettings: SliderSettings = {
    dots: false,
    infinite: (product?.upload_multiple_img?.length ?? 0) > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    asNavFor: navSliderRef.current ?? undefined,
    afterChange: (index: number) => setCurrentSlide(index),
    beforeChange: (_, newIndex) => {
      const active = document.activeElement;
      if (!active) return;
      const slide = active.closest(".slick-slide");
      if (!slide) return;
      const idx = Number(slide.getAttribute("data-index"));
      if (idx !== newIndex && active instanceof HTMLElement) {
        active.blur(); // Remove focus from hidden slide
      }
    },
  };

  // Settings for thumbnail slider
  const navSliderSettings: SliderSettings = {
    dots: false,
    infinite: (product?.upload_multiple_img?.length ?? 0) > 1,
    speed: 500,
    slidesToShow: Math.min(product?.upload_multiple_img?.length || 1, 4),
    slidesToScroll: 1,
    arrows: false,
    focusOnSelect: true,
    asNavFor: mainSliderRef.current ?? undefined, // Convert null to undefined
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(product?.upload_multiple_img?.length || 1, 3),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: Math.min(product?.upload_multiple_img?.length || 1, 2),
        },
      },
    ],
  };

  return (
    <div className="px-4 py-6 md:px-24 font-sans">
      <div className="container mx-auto">
        {/* Back Button */}
        <button
          className="text-green mb-4 flex items-center gap-1 hover:underline"
          onClick={() => navigate(-1)}
        >
          <span className="text-lg text-green">←</span> {t("productDetail.backButton")}
        </button>

        {/* Product Section */}
        <div className="flex flex-col md:flex-row md:gap-10">
          {/* Image Slider */}
          <div className="flex-shrink-0 flex flex-col justify-center md:justify-center w-full md:w-1/3">
            {Array.isArray(product?.upload_multiple_img) && product?.upload_multiple_img?.length > 0 ? (
              <>
                {/* Main Slider */}
                <Slider {...mainSliderSettings} ref={mainSliderRef} className="mb-4">
                  {product.upload_multiple_img.map((img: string, index: number) => (
                    <div key={index} className="flex justify-center">
                      <img
                        src={`${import.meta.env.VITE_APP_BACKEND}uploads/images/${img}`}
                        alt={`${currentLang === "hi" ? product?.product_name_hindi : product?.product_name_english} ${index + 1}`}
                        className="w-full max-w-md h-64 object-contain rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
                {/* Thumbnail Slider */}
                {product.upload_multiple_img.length > 1 && (
                  <Slider {...navSliderSettings} ref={navSliderRef} className="mt-2 thumbslider">
                    {product.upload_multiple_img.map((img: string, index: number) => (
                      <div key={index} className="px-1">
                        <img
                          src={`${import.meta.env.VITE_APP_BACKEND}uploads/images/${img}`}
                          alt={`${currentLang === "hi" ? product?.product_name_hindi : product?.product_name_english} thumbnail ${index + 1}`}
                          className={`w-20 h-20 object-cover rounded cursor-pointer ${currentSlide === index ? 'border-2 border-Green' : 'border border-gray-300'}`}
                        />
                      </div>
                    ))}
                  </Slider>
                )}
                {product.innovations.length > 0 && (
                  <button className="mx-auto" onClick={() => {
                    navigate(`/innovation-details/${product.innovations[0].id}`);
                  }}>

                    <img className="" src="../assets/images/inno.png" />
                  </button>

                )

                }
              </>
            ) 
            : (
              <div className="flex justify-center">
               
              </div>
            )
            }
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-green font-bold text-2xl md:text-2xl">
              {currentLang === "hi" ? product?.product_name_hindi : product?.product_name_english}
            </h1>
            <p className="text-gray-800 font-medium mt-1">
              {currentLang === "hi" ? product?.product_title_hindi : product?.product_title_english}
            </p>
            <p className="text-gray-800 font-medium mt-1">
              {currentLang === "hi"
                ? product?.product_tag_hindi?.join(", ")
                : product?.product_tag_english?.join(", ")}
            </p>
            <p className="mt-2 text-sm font-semibold">
              SKU:{" "}
              <span className="text-gray-700 font-normal">
              {product?.skus?.map((sku) => `${sku.quantity} ${sku.unit}`).join(" | ")}
              </span>
            </p>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              {currentLang === "hi" ? product?.short_descr_hindi : product?.short_descr_english}
            </p>

            {/* Brochure Button */}
            <div className="mt-5 mb-5"></div>
            <Link
              to={`${import.meta.env.VITE_APP_BACKEND}uploads/brochures/${docLink}`}
              target="_blank"
              className="bg-[#CFF24D] text-gree px-4 py-2 rounded hover:bg-green-600 text-sm"
            >
              {t("productDetail.downloadBrochure")}
            </Link>
          </div>
        </div>

        {/* Product Description */}
        <div
          className="mt-8"
          dangerouslySetInnerHTML={{
            __html: currentLang === "hi"
              ? (product?.descr_hindi ?? "")
              : (product?.descr_english ?? "")
          } as { __html: string }}
        />
      </div>
    </div>
  );
}