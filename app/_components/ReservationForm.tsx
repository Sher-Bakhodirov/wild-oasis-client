"use client"
import { User } from "next-auth";
import { Cabin } from "../_types/cabin";
import { useReservationContext } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import { createReservation } from "../_lib/actions";
import { revalidatePath } from "next/cache";
import SubmitForm from "./SubmitForm";

interface ReservationFormProps {
  cabin: Cabin,
  user: User
}

function ReservationForm({ cabin, user }: ReservationFormProps) {
  const { range, setRange } = useReservationContext();
  const { maxCapacity, regularPrice, discount } = cabin;
  if (maxCapacity === undefined || regularPrice === undefined || discount === undefined || !cabin.id) throw new Error("Cabin could be loaded")

  const startDate = range?.from || new Date();
  const endDate = range?.to || new Date();

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: Number(cabin.id)
  }

  const createBookingWithData = createReservation.bind(null, bookingData)

  return (
    <div className='scale-[1.01]'>
      <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
        <p>Logged in as</p>

        {
          user?.name && user?.image ? <div className='flex gap-4 items-center'>
            <img
              // Important to display google profile images
              referrerPolicy='no-referrer'
              className='h-8 rounded-full'
              src={user.image}
              alt={user.name}
            />
            <p>{user.name}</p>
          </div> : ""
        }
      </div>

      <form action={async (formData) => {
        await createBookingWithData(formData);
        setRange({ from: undefined, to: undefined });
      }} className='bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col'>
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity || 0 }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          <p className='text-primary-300 text-base'>Start by selecting dates</p>

          <SubmitForm disabled={!(range?.from && range?.to)} className='bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300'>
            Reserve now
          </SubmitForm>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
