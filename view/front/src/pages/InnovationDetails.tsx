import { useEffect, useState, useTransition } from "react";
import instance from "../utils/axiosInstance";
import { useParams } from "react-router";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
interface InnovationData {
  id: number;
  product_id: number;
  upload_icon: string | null;
  upload_img: string | null;
  bio_balance_eng: string;
  bio_balance_hindi: string;
  descr_english: string;
  descr_hindi: string;
  status: '0' | '1';


}

interface ApiResponse {
  success: boolean;
  message: string;
  data: InnovationData;
}
export default function InnovationDetails() {
  const { id } = useParams<{ id: string }>();
  const [innovationData, setInnovationData] = useState<InnovationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 const language = i18n.language;
 useTranslation();

  // Fetch innovation data
  useEffect(() => {
    const fetchInnovationData = async () => {
      if (!id) {
        setError('Innovation ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await instance(`innovations/get-innovation/${id}`);
        const result: ApiResponse = response.data;
        console.log(result);

        if (result.success == true) {
          setInnovationData(result.data);
          setError(null);
        } else {
          setError(result.message || 'Failed to fetch innovation data');
        }
      } catch (err) {
        setError('Network error occurred while fetching data');
        console.error('Error fetching innovation data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInnovationData();
  }, [id]);
  return (
    <div className="bg-white text-gray-800">

      {/* 1️⃣ Top Section - Green Background */}
      <section className="bg-[#CFF24D] py-10 px-6 md:px-20 text-center md:text-left block md:hidden">
        <div className="container mx-auto">
          <img
            src={innovationData?.upload_icon ? `${import.meta.env.VITE_APP_BACKEND}uploads/images/${innovationData.upload_icon}` : ""}
            alt="Innovation Icon"
            className="mx-auto"
          />


        </div>
      </section>

      {/* Wrapper Section */}
      <section className="bg-green-50 py-10 px-6 md:px-10 md:bg-[#CFF24D]">
        <div className="container mx-auto flex flex-col md:flex-row items-center md:items-start gap-10 px-4 py-3">

          {/* Content Section (on desktop show first) */}
          <div className="flex-2 bg-[#CFF24D] p-8 md:p-8 rounded-lg order-2 md:order-1 md:min-h-[580px]">
            <div className="text-left hidden md:block">
              <img
                src={innovationData?.upload_icon ? `${import.meta.env.VITE_APP_BACKEND}uploads/images/${innovationData.upload_icon}` : ""}
                alt="Bio-Balance"

              />
            </div>

            <h3 className="font-semibold md:text-lg lg:text-3xl mt-5">
              {language === 'en'
                ? 'Our Innovations - The Foundation of Our Products'
                : 'हमारे नवाचार - हमारे उत्पादों की नींव'}
            </h3>

            <p className="mt-4 text-sm md:text-lg leading-relaxed whitespace-pre-line">
              {language === 'en'
                ? innovationData?.bio_balance_eng
                : innovationData?.bio_balance_hindi}
            </p>

          </div>

          {/* Image Section (on desktop show second) */}
          <div className="flex-1 text-center md:text-left order-1 md:order-2">
            <img
              src={innovationData?.upload_img ? `${import.meta.env.VITE_APP_BACKEND}uploads/images/${innovationData.upload_img}` : ""}
              alt="Innovation Banner"
              className="rounded-lg shadow-lg mx-auto md:mx-0"
            />

          </div>

        </div>
      </section>


      {/* 4️⃣ Agrohomeopathy & Vrikshayurveda Section */}
      <section className="bg-white py-12 px-6 md:px-20">
        <div className="container mx-auto text-gray-800">
          <div
            className="mt-4 text-sm md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                language === 'en'
                  ? innovationData?.descr_english || ''
                  : innovationData?.descr_hindi || '',
            }}
          />

        </div>
      </section>
    </div>
  );
}
