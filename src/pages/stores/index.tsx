import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { StoreApiResponse, StoreType } from "@/interface";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function StoreListPage() {
  const router = useRouter();
  const { page = "1" }: any = router.query;

  const {
    isLoading,
    isError,
    data: stores,
  } = useQuery(`stores-${page}`, async () => {
    const { data } = await axios(`/api/stores?page=${page}`);
    return data as StoreApiResponse;
  });

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
        다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          stores?.data?.map((store, index) => (
            <li className="flex justify-between gap-x-6 py-5" key={index}>
              <div className="flex gap-x-4">
                <Image
                  src={
                    store.category
                      ? `/images/markers/${store.category}.png`
                      : "/images/markers/default.png"
                  }
                  width={48}
                  height={48}
                  alt="식당 아이콘"
                />
                <div>
                  <div className="text-sm font-semibold leading-6 text-gray-900">
                    {store.name}
                  </div>
                  <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                    {store.storeType}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <div className="text-sm font-semibold leading-6 text-gray-900">
                  {store.address}
                </div>
                <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                  {store.phone || "번호없음"} | {store.foodCertifyName} |{" "}
                  {store.category}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      {stores?.totalPage && (
        <Pagination total={stores?.totalPage} page={page} />
      )}
    </div>
  );
}
