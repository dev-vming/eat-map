import { useForm } from "react-hook-form";

interface CommentProps {
    storeId: number;
}

export default function Comments({ storeId }: CommentProps) {
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm();
    return (
        <div className="px-2 md:max-w-4xl mx-auto py-8 mb-20">
            {/* comment form */}

            <form
                onSubmit={handleSubmit(async (data) => {
                    console.log(data);
                })}
                className="flex flex-col space-y-2"
            >
                {errors.body?.type === "required" && (
                    <div className="text-xs text-red-600">
                        필수 입력 사항입니다.
                    </div>
                )}
                <textarea
                    placeholder="댓글을 작성해주세요..."
                    {...register("body", { required: true })}
                    className="block w-full min-h-[120px] resize-none border rounded-md bg-transparent py-2.5 px-4 text-black placeholder:text-gray-400 text-sm leading-6"
                    rows={3}
                />

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-semibold shadow-sm rounded-md"
                >
                    작성하기
                </button>
            </form>
        </div>
    );
}
