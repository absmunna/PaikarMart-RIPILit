import { useListVendors, getListVendorsQueryKey, VendorType } from "@workspace/api-client-react";
import { VendorCard } from "@/components/vendor/VendorCard";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Vendors() {
  const [search, setSearch] = useState("");
  const { data: vendors } = useListVendors({}, { query: { queryKey: getListVendorsQueryKey() } });

  const types = Object.values(VendorType);

  const filteredVendors = vendors?.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendor Directory</h1>
          <p className="text-white/60 mt-1">Discover sellers, wholesalers, and service providers.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <input 
            type="search" 
            placeholder="Search vendors..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full h-10 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {types.map(type => {
          const typeVendors = filteredVendors?.filter(v => v.type === type);
          if (!typeVendors?.length) return null;

          return (
            <div key={type} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white capitalize">{type.replace('_', ' ')}</h2>
                <span className="text-sm text-primary cursor-pointer hover:underline">View all</span>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {typeVendors.map(vendor => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
