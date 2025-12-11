import { StoreType } from "@/interface";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface AddressProps {
    register: UseFormRegister<StoreType>;
    errors: FieldErrors<StoreType>;
    setValue: UseFormSetValue<StoreType>;
}

export default function AddressSearch({
    register,
    errors,
    setValue,
}: AddressProps) {
    return (
        <div className="col-span-full">
            <label
                htmlFor="address"
                className="block text-sm/6 font-medium text-gray-900"
            >
                주소 (다음 주소 검색 API 연동 예정)
            </label>
            <div className="mt-2">
                <input
                    {...register("address", { required: true })}
                    className="block w-full rounded-md border-0 outline-none px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.address?.type === "required" && (
                    <div className="pt-2 text-xs text-red-600">
                        필수 입력 사항입니다.
                    </div>
                )}
            </div>
        </div>
    );
}
