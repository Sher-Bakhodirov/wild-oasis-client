'use server'

import { redirect } from "next/navigation";
import { ExtendedUser } from "../_types/guest";
import { auth, signIn, signOut } from "./auth";
import { createBooking, deleteBooking, getBookings, updateBooking, updateGuest as updateGuestService } from "./data-service";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    const user = session?.user as ExtendedUser;
    if (!user) throw new Error("You must be logged in");
    const guestId = Number(user.guestId)

    const nationalID = String(formData.get("nationalID"));
    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) throw new Error("Please provide a valid national ID")

    const nationalityInput = formData.get("nationality");
    if (typeof nationalityInput !== "string") throw new Error("Nationality should be a string")
    const [nationality, countryFlag] = nationalityInput.split("%");

    const updateData = {
        nationality,
        countryFlag,
        nationalID,
    }

    const data = await updateGuestService(guestId, updateData);
    revalidatePath("/account/profle")
}

export async function signInAction() {
    await signIn("google", { redirectTo: "/account" })
}

export async function signOutAction() {
    await signOut({ redirectTo: "/" })
}

export async function deleteReservation(bookingId: number) {
    const session = await auth();
    if (!session) throw new Error("You first need to login");

    const user = session.user as ExtendedUser;

    const guestBookings = await getBookings(Number(user.guestId))
    const guestBookingIds = guestBookings?.map(booking => booking.id)

    if (!guestBookingIds?.includes(bookingId)) {
        throw new Error("The reservation is not found")
    }

    await deleteBooking(bookingId)
    revalidatePath("/account/reservations")
}

export async function editReservation(formData: FormData) {
    const bookingId = Number(formData.get("reservationId"));
    const session = await auth();
    if (!session) throw new Error("You first need to login");

    const user = session.user as ExtendedUser;

    const guestBookings = await getBookings(Number(user.guestId));
    const guestBookingIds = guestBookings?.map(booking => booking.id);

    if (!guestBookingIds?.includes(bookingId)) {
        throw new Error("The reservation is not found")
    }

    const updateData = {
        numGuests: Number(formData.get("numGuests")) || 1,
        observations: String(formData.get("observations")).slice(0, 1000) || ""
    }

    await updateBooking(bookingId, updateData)
    revalidatePath(`/account/reservations/edit/${bookingId}`);
    revalidatePath("/account/reservations");
    redirect("/account/reservations")
}

interface BookingData { 
    startDate: Date; 
    endDate: Date;
    numNights: number; 
    cabinPrice: number; 
    cabinId: number; 
}
export async function createReservation(bookingData: BookingData, formData: FormData) {
    const session = await auth();
    if (!session) throw new Error("You first need to login")
    const user = session.user as ExtendedUser;

    const newBooking = {
        guestId: Number(user.guestId),
        ...bookingData,
        numGuests: Number(formData.get("numGuests")),
        observations: String(formData.get("observations"))?.slice(1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: "unconfirmed"
    }

    await createBooking(newBooking);
    revalidatePath(`/cabins/${bookingData.cabinId}`);
    redirect("/cabins/thankyou")
}