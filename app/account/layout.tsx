import { ReactNode } from "react"
import SideNavigation from "@/app/_components/SideNavigation"

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="grid grid-cols-[16rem_1fr] h-full gap-12">
            <div>            
                <SideNavigation/>
            </div>
            <div>{children}</div>
        </div>
    )
}