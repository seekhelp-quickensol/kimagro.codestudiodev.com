import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { use } from "react";
import useProductByCat from "../hooks/useProductByCat";
import { Link } from "react-router-dom";

export default function ProductsByCategories() {
  const currentLang = i18n.language;
  const { t } = useTranslation();
  const { 
    category, 
    products, 
    loading, 
    loadingMore, 
    hasMore, 
    loadMoreProducts, 
    error 
  } = useProductByCat();

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMoreProducts();
    }
  };

  return (
    <div className="products-page">
      {/* Root Care Products */}
      <section className="md:min-h-[600px] lg:min-h-[600px] p-8 md:p-12">
        <div className="container mx-auto px-4">
          <h4 className="text-center mb-5 font-bold md:mb-12 text-green lg:text-2xl">
            {currentLang === 'hi' ? category?.categoryNameHindi : category?.categoryNameEnglish}
          </h4>
          
          {error && (
            <div className="text-center mb-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 md:gap-10">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product, index) => (
                <Link
                  to={`/product-details/${product.id}`}
                  key={`${product.id}-${index}`}
                  className="flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center w-28 h-28 md:w-32 md:h-32">
                    <img
                      src={`${import.meta.env.VITE_APP_BACKEND}uploads/images/${product.icon}`}
                      alt={currentLang === 'hi' ? product.hiName : product.engName}
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-sm md:text-base font-medium text-green-900">
                    {currentLang === 'hi' ? product.hiName : product.engName}
                  </p>
                </Link>
              ))
            ) : !loading && (
              <div className="justify-center justify-self-center mx-auto col-span-full">
                {/* <p className="text-gray-500">{t("productPage.noProduct")}</p> */}
                <img src={'../assets/images/noproduct.png'} alt={t("productPage.noProduct")} className="object-contain" />
              </div>
            )}
          </div>

          {/* Loading indicator for initial load */}
          {loading && products.length === 0 && (
            <div className="flex justify-center items-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">{t("common.loading") || "Loading..."}</span>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && products.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${loadingMore 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {loadingMore ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("common.loadingMore") || "Loading More..."}
                  </div>
                ) : (
                  t("productPage.loadMore") || "Load More"
                )}
              </button>
            </div>
          )}

          {/* End of results message */}
          {/* {!loading && !hasMore && products.length > 0 && (
            <div className="flex justify-center mt-8">
              <p className="text-gray-500 text-sm">
                {t("productPage.noMoreProducts") || "No more products to load"}
              </p>
            </div>
          )} */}
        </div>
      </section>
    </div>
  );
}