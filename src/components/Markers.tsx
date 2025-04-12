import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

interface MakersProps {
  map: any;
  storeDatas: any[];
  setCurrentStore: Dispatch<SetStateAction<any>>;
}

export default function Markers({
  map,
  storeDatas,
  setCurrentStore,
}: MakersProps) {
  const loadKakaoMarkers = useCallback(() => {
    if (map) {
      storeDatas?.map((store) => {
        // store data 좌표 값으로 마커 좌표 설정
        const markerPosition = new window.kakao.maps.LatLng(
          store?.y_dnts,
          store?.x_cnts
        );

        // store 업태 명 별 마커 이미지 설정
        const imageSrc = store?.bizcnd_code_nm
            ? `/images/markers/${store?.bizcnd_code_nm}.png`
            : "images/markers/default.png",
          imageSize = new window.kakao.maps.Size(40, 40),
          imageOption = { offset: new window.kakao.maps.Point(27, 69) };

        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        // 지도 위에 마커 표시
        marker.setMap(map);

        // 커스텀 오버레이에 표시할 내용 (HTML 문자열 , DOM Element)
        const content = `<div class="infowindow">${store?.upso_nm}</div>`;

        // 커스텀 오버레이 생성
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          xAnchor: 0.6,
          yAnchor: 0.91,
        });

        // 마커에 마우스 이벤트 등록
        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          customOverlay.setMap(map);
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          customOverlay.setMap(null);
        });

        // 선택한 가게 저장
        window.kakao.maps.event.addListener(marker, "click", () => {
          setCurrentStore(store);
        });
      });
    }
  }, [map, setCurrentStore, storeDatas]);

  useEffect(() => {
    loadKakaoMarkers();
  }, [map, loadKakaoMarkers]);

  return <></>;
}
