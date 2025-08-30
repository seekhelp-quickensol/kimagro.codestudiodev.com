import { useNavigate } from "react-router-dom";

export default function RootCareProducts() {
  const navigate = useNavigate();

  const products = [
    { name: "Elevate", icon: "../assets/images/products/elevate.png" },
    { name: "Bahubali-Ultra", icon: "../assets/images/products/bahubali.png" },
    { name: "Seven Star Kit", icon: "../assets/images/products/7-star.png" },
    { name: "Yield Master Kit", icon: "../assets/images/products/yield-master.png" },
    { name: "Zinc-Sil", icon: "../assets/images/products/zinc-sil.png" },
    { name: "Classic Consortia", icon: "../assets/images/products/claasical.png" },
    { name: "Nrich", icon: "../assets/images/products/nrich.png" },
    { name: "untwist", icon: "../assets/images/products/untwist.png" },
    { name: "Root Excel", icon: "../assets/images/products/root-excel.png" },
    { name: "Shoot Excel", icon: "../assets/images/products/shoot-excel.png" },
    { name: "Veggie Excel", icon: "../assets/images/products/veggie-excel.png" },
    { name: "bitterol", icon: "../assets/images/products/bitterol.png" },
  ];

  return (
    <div className="products-page">
      {/* Root Care Products */}

      <section className="md:min-h-[600px] lg:min-h-[600px] p-8 md:p-12">
        <div className="container mx-auto px-4">
          <h4 className="text-center mb-5 font-bold md:mb-12 text-green lg:text-2xl">
            Root Care
          </h4>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 md:gap-10">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center cursor-pointer"
                onClick={() => navigate("/product-details")}
              >
                <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center w-28 h-28 md:w-32 md:h-32">
                  <img
                    src={product.icon}
                    alt={product.name}
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-sm md:text-base font-medium text-green-900">
                  {product.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
