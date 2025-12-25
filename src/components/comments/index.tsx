"use client";

import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CommentApiResponse } from "@/interface";
import { useQuery } from "react-query";
import Pagination from "../Pagination";

interface CommentProps {
    storeId: number;
    params?: {
        page: string;
    };
}

export default function Comments({ storeId, params }: CommentProps) {
    const { status } = useSession();

    const router = useRouter();
    const page = params?.page || "1";

    const fetchComments = async () => {
        const { data } = await axios.get(
            `/api/comments?storeId=${storeId}&page=${page}&limit=5`
        );
        return data as CommentApiResponse;
    };

    const { data: comments, refetch } = useQuery(
        `comments-${storeId}-${page}`,
        fetchComments
    );

    return (
        <div className="px-2 md:max-w-4xl mx-auto py-8 mb-20">
            {/* 댓글 작성 폼 */}
            {status === "authenticated" && (
                <CommentForm storeId={storeId} refetch={refetch} />
            )}
            {/* 댓글 리스트 */}
            <CommentList comments={comments} />
            {/* 페이지네이션 */}
            <Pagination
                total={comments?.totalPage}
                page={page}
                pathname={`/stores/${storeId}`}
            />
        </div>
    );
}
