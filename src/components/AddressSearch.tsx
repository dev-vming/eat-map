import { StoreType } from "@/interface";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import DaumpostcodeEmbed from "react-daum-postcode";
import { useState } from "react";

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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = "";

        // 데이터가 도로명 주소인 경우
        if (data.addressType === "R") {
            // 법정동명 이름이 있는 경우
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            // 건물명이 있는 경우
            if (data.buildingName !== "") {
                extraAddress +=
                    extraAddress !== ""
                        ? `, ${data.buildingName}`
                        : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        // address 필드에 값 추가
        setValue("address", fullAddress);
    };
    return (
        <>
            <div className="col-span-full">
                <label
                    htmlFor="address"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                    주소
                </label>
                <div className="mt-2">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        <input
                            readOnly
                            placeholder="주소를 검색해주세요."
                            {...register("address", { required: true })}
                            className="col-span-2 md:col-span-3 block w-full rounded-md border-0 outline-none px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                            type="button"
                            onClick={() => setIsOpen((val) => !val)}
                            className="bg-blue-700 hover:bg-blue-600 py-1.5 px-2 rounded text-white"
                        >
                            주소 검색
                        </button>
                    </div>

                    {errors.address?.type === "required" && (
                        <div className="pt-2 text-xs text-red-600">
                            필수 입력 사항입니다.
                        </div>
                    )}
                </div>
            </div>
            {isOpen && (
                <DaumpostcodeEmbed
                    className="border border-gray-300 w-full col-span-full md:col-span-3 rounded-md p-2"
                    onComplete={handleComplete}
                />
            )}
        </>
    );
}
