"use client"
import { TrashIcon } from '@heroicons/react/24/solid';

interface DeleteReservationProps {
  bookingId: number,
  handleDelete: (bookingId: number) => Promise<void>,
}

function DeleteReservation({ bookingId, handleDelete }: DeleteReservationProps): React.ReactElement {

  function onDelete() {
    if (confirm("Are you sure that you want to delete this reservation?")) {
      handleDelete(bookingId)
    }
  }

  return (
    <button onClick={onDelete} className='group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900'>
      <TrashIcon className='h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors' />
      <span className='mt-1'>Delete</span>
    </button>
  );
}

export default DeleteReservation;
