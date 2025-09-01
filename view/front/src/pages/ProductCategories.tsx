import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useFetchCategories";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ProductsCategories() {
  const { t } = useTranslation();
  const { categories} = useCategories();
  

  return (
    <div className="products-page">
      {/* Product Categories */}
      <section className="categories-section  md:min-h-[600px] lg:min-h-[600px] p-8 md:p-12">
        <div className="container mx-auto px-4">
          <h4 className="text-center  font-bold text-green lg:text-2xl  ">
           {t("categoryPage.title")}
          </h4>

          <div className="grid grid-cols-2 gap-6 mt-8 md:grid-cols-4 lg:grid-cols-6 md:gap-12 md:py-10">
          {
            Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat, index) => (
                <Link
                  to={`/product-categories/${cat.id}`}
                  key={index}
            
                  className="min-h-[100px] pb-1 border-b border-[#7AB648]  flex flex-col items-center text-center cursor-pointer  transition my-[35px] md:my-0">
                  <img src={cat.icon} alt={cat.name} className="object-contain" />
                  <p className="mt-2 md:text-base font-medium text-green-900">
                  {i18n.language === 'hi' ? cat.nameHindi : cat.name}
                  </p>
                  {/* Green underline */}
                  {/* <span
                    className="block w-12 h-[2px] mx-auto mt-1"
                    style={{ backgroundColor: "#7AB648" }}></span> */}
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center col-span-4">
                {/* <p className="text-gray-500">{t("categoryPage.noCategories")}</p> */}
                <img src={'assets/images/noproduct.png'} alt={t("categoryPage.noCategories")} className="object-contain" />
              </div>
            )
          }
          </div>
        </div>
      </section>
    </div>
  );
}
