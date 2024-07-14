"use client"
import { useOptimistic } from "react"
import { Booking } from "../_types/booking"
import ReservationCard from "./ReservationCard"
import { deleteReservation } from "../_lib/actions"
interface ReservationList {
    bookings: Booking[]
}

export default function ReservationList({ bookings }: ReservationList) {
    const [optimisticBookings, optimisticDelete] = useOptimistic(bookings, (currBookings, bookingId) => {
        return currBookings.filter(booking => booking.id != bookingId)
    })

    async function handleDelete(bookingId: number) {
        optimisticDelete(bookingId)
        await deleteReservation(bookingId)
    }
    return (
        <ul className="space-y-6">
            {optimisticBookings?.map((booking) => (
                <ReservationCard 
                    booking={booking} 
                    key={booking.id} 
                    handleDelete={handleDelete} 
                />
            ))}
        </ul>
    )
}