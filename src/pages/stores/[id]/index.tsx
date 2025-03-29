import { useRouter } from "next/router";

export default function StoreDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>맛집 {id}번 상세 페이지</h1>
    </div>
  );
}
