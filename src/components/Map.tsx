/*global kakao*/
import Script from "next/script";
import * as stores from "@/data/store_data.json";

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_LAT = 37.496486063;
const DEFAULT_LNG = 127.028361548;

export default function Map() {
  const loadKakaoMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      stores?.["DATA"]?.map((store) => {
        const markerPosition = new window.kakao.maps.LatLng(
          store?.y_dnts,
          store?.x_cnts,
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        marker.setMap(map);
      });
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
