import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service"

interface RequestParams {
    params: {
        cabinId: string,
    }
}

export async function GET(request: Request, { params }: RequestParams) {
    try {
        const { cabinId } = params
        const [cabin, bookedDates] = await Promise.all([getCabin(+cabinId), getBookedDatesByCabinId(+cabinId)])
        return Response.json({cabin, bookedDates})

    } catch (error) {
        return Response.json({message: "Cabin not found"})
    }

}