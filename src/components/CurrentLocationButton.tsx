import { useState } from "react";
import { MdOutlineMyLocation } from "react-icons/md";

export default function CurrentLocationButton() {
    
    const [loading, setLoading] = useState<boolean>(false);
    const handleCurrentPosition = () => {
        setLoading(true);
    };

    return (
        <button
            type="button"
            onClick={handleCurrentPosition}
            className="fixed z-10 p-2 shadow right-10 bottom-10 bg-blue-100 rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-200"
        >
            <MdOutlineMyLocation className="w-5 h-5" />
        </button>
    );
}
