import ReservationCard from "@/app/_components/ReservationCard";
import { getBookings } from "@/app/_lib/data-service";
import { auth } from "@/app/_lib/auth";
import { ExtendedUser } from "@/app/_types/guest";
import ReservationList from "@/app/_components/ReservationList";

export default async function Page() {
    const session = await auth();
    if (!session) throw new Error("You first need to login");
    const user = session.user as ExtendedUser;
    const bookings = await getBookings(Number(user.guestId));

    return (
        <div>
            <h2 className="font-semibold text-2xl text-accent-400 mb-7">
                Your reservations
            </h2>

            {!bookings || bookings?.length === 0 ? (
                <p className="text-lg">
                    You have no reservations yet. Check out our{" "}
                    <a className="underline text-accent-500" href="/cabins">
                        luxury cabins &rarr;
                    </a>
                </p>
            ) : (
                <ReservationList bookings={bookings}/>
            )}
        </div>
    );
}

export const metadata = {
    title: "My resevations"
}