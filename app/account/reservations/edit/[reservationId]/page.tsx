import SubmitForm from "@/app/_components/SubmitForm";
import { editReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { notFound } from "next/navigation";

interface PageProps {
    params: Params
}

export default async function Page({ params }: PageProps) {
    const { reservationId } = params;
    const booking = await getBooking(reservationId);
    if (!booking) return notFound();
    const { numGuests } = booking;

    const { cabinId } = booking;
    const cabin = await getCabin(cabinId);
    if (!cabin?.maxCapacity) return notFound()

    const { maxCapacity } = cabin;

    return (
        <div>
            <h2 className="font-semibold text-2xl text-accent-400 mb-7">
                Edit Reservation #{reservationId}
            </h2>

            <form className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col" action={editReservation}>
                <div className="space-y-2">
                    <label htmlFor="numGuests">How many guests?</label>
                    <select
                        name="numGuests"
                        id="numGuests"
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                        required
                        defaultValue={numGuests}
                    >
                        <option value="" key="">
                            Select number of guests...
                        </option>
                        {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
                            <option value={x} key={x}>
                                {x} {x === 1 ? "guest" : "guests"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="observations">
                        Anything we should know about your stay?
                    </label>
                    <textarea defaultValue={booking?.observations}
                        name="observations"
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    />
                </div>

                <input type="hidden" name="reservationId" value={reservationId}/>

                <div className="flex justify-end items-center gap-6">
                    <SubmitForm className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
                        Update reservation
                    </SubmitForm>
                </div>
            </form>
        </div>
    );
}
