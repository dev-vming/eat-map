import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { useRouter } from "next/router";
import axios from "axios";
import { CommentApiResponse } from "@/interface";
import { useQuery } from "react-query";

interface CommentProps {
    storeId: number;
}

export default function Comments({ storeId }: CommentProps) {
    const { status } = useSession();

        const router = useRouter();
        const { page = "1" } = router.query;
    
        const fetchComments = async () => {
            const { data } = await axios.get(
                `/api/comments?storeId=${storeId}&page=${page}&limit=10`
            );
            return data as CommentApiResponse;
        };
    
    const { data: comments } = useQuery(`comments-${storeId}`, fetchComments);

    return (
        <div className="px-2 md:max-w-4xl mx-auto py-8 mb-20">
            {/* 댓글 작성 폼 */}
            {status === "authenticated" && <CommentForm storeId={storeId} />}
            {/* 댓글 리스트 */}
            <CommentList comments={comments} />
        </div>
    );
}
