import { useRouter } from "next/router"

export default function StoreEditPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div>
      <h1>맛집 {id}번 수정 페이지</h1>
    </div>
  )
}