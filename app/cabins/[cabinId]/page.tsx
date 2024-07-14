import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Params {
    cabinId: string
}

interface PageProps {
    params: Params
}

export const revalidate = 3_600;

export async function generateMetadata({ params }: PageProps) {
    const cabin = await getCabin(+params.cabinId);
    if (!cabin) return {
        title: "Cabin page"
    };
    return {
        title: `Cabin ${cabin.name}`
    }
}

export async function generateStaticParams() {
    const cabins = await getCabins();
    if (!cabins) return [];

    return cabins.map(cabin => {
        return {
            cabinId: String(cabin.id)
        }
    });
}

export default async function Page({ params }: PageProps) {
    const cabin = await getCabin(+params.cabinId);
    if (!cabin) return notFound();



    return (
        <div className="max-w-6xl mx-auto mt-8">
            <Cabin cabin={cabin} />

            <div>
                <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
                    Reserve {cabin.name} today. Pay on arrival.
                </h2>


                <Suspense fallback={<Spinner />}>
                    <Reservation cabin={cabin} />
                </Suspense>
            </div>
        </div>
    );
}
