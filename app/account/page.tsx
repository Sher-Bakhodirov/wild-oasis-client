import { auth } from "../_lib/auth"

export default async function Page() {
    const session = await auth();
    const firstName = session?.user?.name?.split(" ").at(0)
    return (
        <div>
            <div>Welcome back {firstName}</div>
        </div>
    )
}


export const metadata = {
    title: "Your account"
}