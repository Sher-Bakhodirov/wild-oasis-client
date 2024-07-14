import { Cabin } from "./cabin";

export interface Booking {
    id: number,
    created_at: string,
    startDate: string,
    endDate: string,
    numNights: number,
    numGuests: number,
    cabinPrice?: number,
    extrasPrice?: number,
    totalPrice: number,
    status?: string,
    hasBreakfast?: boolean,
    observations?: string,
    cabinId: number,
    guestId?: number,
    cabins: any
}

export interface BookingOptionalFields {
    startDate?: Date,
    endDate?: Date,
    numNights?: number,
    numGuests?: number,
    cabinPrice?: number,
    extrasPrice?: number,
    totalPrice?: number,
    status?: string,
    hasBreakfast?: boolean,
    observations?: string,
    cabinId?: number,
    guestId?: number,
    cabins?: Cabin
}