import { mapState } from "@/atom";
import { useState } from "react";
import { MdOutlineMyLocation } from "react-icons/md";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";

export default function CurrentLocationButton() {
    const [loading, setLoading] = useState<boolean>(false);
    const map = useRecoilValue(mapState);
    const handleCurrentPosition = () => {
        setLoading(true);

        // geolocation으로 현재 위치 가져오기
        const options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: Infinity,
        };

        // navigator의 geolocation이 있을 때
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                // 위치 불러오기 성공 시
                (position) => {
                    const currentPosition = new window.kakao.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    if (currentPosition) {
                        setLoading(false);
                        map.panTo(currentPosition);
                        toast.success("현재 위치로 이동되었습니다.");
                    }

                    return currentPosition;
                },
                // 위치 불러오기 실패 시
                () => {
                    setLoading(false);
                    toast.error("현재 위치를 가져올 수 없습니다.");
                },
                // 옵션 값 적용
                options
            );
        }
    };

    return (
        <button
            type="button"
            onClick={handleCurrentPosition}
            className="fixed z-10 p-2 shadow right-10 bottom-10 bg-white rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-100"
        >
            <MdOutlineMyLocation className="w-5 h-5" />
        </button>
    );
}
