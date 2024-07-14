import { unstable_noStore as noStore } from "next/cache";

import CabinCard from "@/app/_components/CabinCard";
import { Cabin } from "@/app/_types/cabin";
import { getCabins } from "@/app/_lib/data-service";

interface CabinListProps {
    capacity: string
}

export default async function CabinList({ capacity }: CabinListProps) {
    noStore();
    const cabins: Cabin[] = await getCabins() || [];

    if (!cabins.length) return null;

    let filteredCabins = cabins;
    if (capacity === "small") {
        filteredCabins = cabins.filter(cabin => cabin.maxCapacity <= 3)
    } else if (capacity === "medium") {
        filteredCabins = cabins.filter(cabin => cabin.maxCapacity > 3 && cabin.maxCapacity < 8)
    } else if (capacity === "large") {
        filteredCabins = cabins.filter(cabin => cabin.maxCapacity >= 8)
    }


    return <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
        {filteredCabins.map((cabin) => (
            <CabinCard cabin={cabin} key={cabin.id} />
        ))}
    </div>
}