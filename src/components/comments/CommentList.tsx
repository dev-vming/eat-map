import { CommentApiResponse, CommentInterface } from "@/interface";
import { useSession } from "next-auth/react";

interface CommentListProps {
    comments?: CommentApiResponse;
}

export default function CommentList({ comments }: CommentListProps) {
    const { data: session } = useSession();

    return (
        <div className="my-10">
            {comments?.data && comments?.data.length > 0 ? (
                comments.data.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex space-x-4 text-sm text-gray-500 mb-8 items-center border-b border-gray-100 pb-8"
                    >
                        <div>
                            <img
                                src={
                                    comment.user?.image ||
                                    "/image/markers/default.png"
                                }
                                width={40}
                                height={40}
                                className="rounded-full bg-gray-10"
                                alt="프로필 이미지"
                            />
                        </div>
                        <div className="flex flex-col space-y-1 flex-1">
                            <div>
                                {comment.user?.name ||
                                    comment.user?.email.split("@")[0]}
                            </div>

                            <div className="text-xs">
                                {new Date(
                                    comment.createdAt
                                ).toLocaleDateString()}
                            </div>

                            <div className="text-black font-base mt-1">
                                {comment.body}
                            </div>
                        </div>
                        <div>
                            {session?.user.id &&
                                comment.userId ===
                                    parseInt(session.user.id) && (
                                    <button
                                        type="button"
                                        className="underline text-gray-500 hover:text-gray-400"
                                    >
                                        삭제
                                    </button>
                                )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-4 border border-gray-200 rounded-md text-sm text-gray-400">
                    댓글이 없습니다.
                </div>
            )}
        </div>
    );
}
