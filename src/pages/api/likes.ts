import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/db";
import { LikeApiResponse, LikeInterface } from "@/interface";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LikeInterface | LikeApiResponse>
) {
    const session = await getServerSession(req, res, authOptions);

    // 찜하기는 로그인 한 사용자만 가능하므로 로그인 데이터가 없다면 401 오류 return
    if (!session?.user) {
        return res.status(401);
    }

    if (req.method === "POST") {
        // 찜하기 로직
        const { storeId }: { storeId: number } = req.body;

        // like 데이터가 존재하는 지 확인
        let like = await prisma.like.findFirst({
            where: {
                storeId,
                userId: parseInt(session?.user.id),
            },
        });

        // like 데이터가 있다면 해당 like 데이터 삭제, 없다면 like 데이터 생성
        if (like) {
            // 이미 찜을 한 상황 : like 데이터 삭제
            like = await prisma.like.delete({
                where: {
                    id: like.id,
                },
            });
            return res.status(204).json(like);
        } else {
            // 찜이 되어있지 않은 상황 : like 데이터 추가
            like = await prisma.like.create({
                data: {
                    storeId,
                    userId: parseInt(session?.user.id),
                },
            });
            return res.status(201).json(like);
        }
    } else {
        // GET 요청 처리
        const likes = await prisma.like.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                userId: parseInt(session.user.id),
            },
            include: {
                store: true,
            },
        });

        return res.status(200).json({ data: likes });
    }
}
