import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";

import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Kimeya"
        description="Dashboard - Kimeya"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />
        </div>
      </div>
    </>
  );
}
