import { toast } from "react-toastify";
import { TToastType } from "../types/TToastType";

function produceToast(msg: string | JSX.Element, toastType: TToastType) {
    switch (toastType) {
        case "INFO":
            toast.info(msg)
            break;
        case "SUCCESS":
            toast.success(msg)
            break;
        case "WARNING":
            toast.warning(msg)
            break;
        case "ERROR":
            toast.error(msg)
            break;
        case "DEFAULT":
            toast(msg)
            break;
    }
}

export const addToast = (msg: string | JSX.Element, toastType: TToastType) => produceToast(msg, toastType)
