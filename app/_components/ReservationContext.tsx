"use client"
import { ReactNode, createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

interface ReservationContextInterface {
    range: DateRange | undefined,
    setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const ReservationContext = createContext<ReservationContextInterface | undefined>(undefined);

interface ReservationContextProviderProps {
    children: ReactNode
}

export default function ReservationContextProvider({ children }: ReservationContextProviderProps) {
    const [range, setRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });

    return (
        <ReservationContext.Provider value={{ range, setRange }}>
            {children}
        </ReservationContext.Provider>
    )
}

export function useReservationContext() {
    const context = useContext(ReservationContext);
    if (!context) throw new Error("Reservation context used outside of provider")

    return context;
}