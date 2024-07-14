import { User } from "next-auth";

export interface Guest {
    id?: number,
    fullName: string,
    email: string,
    nationality?: string,
    nationalID?: string,
    countryFlag?: string,
}

export interface GuestOptionalFields {
    fullName?: string,
    email?: string,
    nationalID?: string,
    nationality?: string,
    countryFlag?: string,
}

export interface ExtendedUser extends User {
    guestId: string;
}