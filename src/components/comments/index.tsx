import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentProps {
    storeId: number;
}

export default function Comments({ storeId }: CommentProps) {
    const { status } = useSession();

    return (
        <div className="px-2 md:max-w-4xl mx-auto py-8 mb-20">
            {/* 댓글 작성 폼 */}
            {status === "authenticated" && <CommentForm storeId={storeId} />}
            {/* 댓글 리스트 */}
            <CommentList storeId={storeId} />
        </div>
    );
}
