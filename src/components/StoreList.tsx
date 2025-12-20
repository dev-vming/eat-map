import { StoreType } from "@/interface";
import Image from "next/image";
import { useRouter } from "next/router";

interface StoreListProps {
    store: StoreType;
    index: number;
}

export default function StoreList({store, index}: StoreListProps) {
    const router = useRouter();
    return (
        <li
            onClick={() => router.push(`/stores/${store.id}`)}
            className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50"
            key={index}
        >
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
                    {store.category === "default"
                        ? "카테고리없음"
                        : store.category}
                </div>
            </div>
        </li>
    );
}
