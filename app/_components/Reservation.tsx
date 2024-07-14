import { auth } from "../_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { Cabin } from "../_types/cabin";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

interface ReservationProps {
    cabin: Cabin
}

export default async function Reservation({ cabin }: ReservationProps) {
    if (!cabin.id) throw new Error("Error while retrieving booked dates")
    const [settings, bookedDates] = await Promise.all([getSettings(), getBookedDatesByCabinId(+cabin.id)])
    const session = await auth();
    if (!settings) {
        throw new Error('Error while retrieving settings')
    }
    if (!bookedDates) {
        throw new Error('Error while retrieving booked dates')
    }

    return <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
        <DateSelector cabin={cabin} settings={settings} bookedDates={bookedDates} />
        {
            session?.user ? <ReservationForm cabin={cabin} user={session.user} /> : <LoginMessage />
        }
    </div>
}