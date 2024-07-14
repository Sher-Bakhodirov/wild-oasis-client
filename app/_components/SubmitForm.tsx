"use client"
import { useFormStatus } from "react-dom";
import SpinnerMini from "./SpinnerMini";

export default function SubmitForm({disabled, children, ...props}: any) {
    
    const { pending } = useFormStatus();
    return (
        <button disabled={pending || disabled} {...props}>
            {pending ? <SpinnerMini /> : children}
        </button>
    )
}

