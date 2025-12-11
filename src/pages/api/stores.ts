import type { NextApiRequest, NextApiResponse } from "next";
import { StoreApiResponse, StoreType } from "@/interface";
import prisma from "@/db";
import axios from "axios";

interface ResponsType {
    page?: string;
    limit?: string;
    query?: string;
    district?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType>
) {
    const {
        page = "",
        limit = "",
        query = "",
        district = "",
    }: ResponsType = req.query;

    if (req.method === "POST") {
        // 데이터 생성을 처리
        const formData = req.body;

        // 카카오 좌표 요청을 위한 헤더
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };

        // 카카오 좌표 검색
        const { data } = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
                formData.address
            )}`,
            { headers }
        );

        // 사용자 입력값 + 카카오 좌표 값 저장
        const result = await prisma.store.create({
            data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
        });

        return res.status(200).json(result);
    } else {
        // get 요청 처리
        if (page) {
            const count = await prisma.store.count();
            const skipPage = parseInt(page) - 1;
            const stores = await prisma.store.findMany({
                orderBy: { id: "asc" },
                where: {
                    name: query ? { contains: query } : {},
                    address: district ? { contains: district } : {},
                },
                take: parseInt(limit),
                skip: skipPage * 10,
            });

            res.status(200).json({
                page: parseInt(page),
                data: stores,
                totalCount: count,
                totalPage: Math.ceil(count / 10),
            });
        } else {
            const { id }: { id?: string } = req.query;

            const stores = await prisma.store.findMany({
                orderBy: { id: "asc" },
                where: {
                    id: id ? parseInt(id) : {},
                },
            });

            return res.status(200).json(id ? stores[0] : stores);
        }
    }
}
