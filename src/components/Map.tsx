/*global kakao*/
import Script from "next/script";
import { Dispatch, SetStateAction } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapProps{
  setMap: Dispatch<SetStateAction<any>>;
  lat?: string | null;
  lng?: string | null;
  zoom?: number;
}

const DEFAULT_LAT = 37.496486063;
const DEFAULT_LNG = 127.028361548;

const DEFAULT_ZOOM = 3;

export default function Map({setMap, lat, lng, zoom}:MapProps) {
  const loadKakaoMap = () => {
    // 카카오 맵 불러오기, 초기 좌표 설정
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(lat ?? DEFAULT_LAT, lng ?? DEFAULT_LNG),
        level: zoom ?? DEFAULT_ZOOM,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(map);
    });
  };
  return (
    <>
      <Script
        strategy="afterInteractive"
        onReady={loadKakaoMap}
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
      ></Script>
      <div id="map" className="w-full h-screen"></div>
    </>
  );
}
