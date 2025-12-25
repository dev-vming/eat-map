import { NextResponse } from "next/server";
import prisma from "@/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    // params 에서 값들 가져오기
    const page = searchParams.get("page") as string;
    const limit = searchParams.get("limit") as string;
    const query = searchParams.get("query") as string;
    const district = searchParams.get("district") as string;
    const id = searchParams.get("id") as string;

    const session = await getServerSession(authOptions);

    if (page) {
        // 페이지가 있는 경우 페이지네이션 처리
        const count = await prisma.store.count();
        const skipPage = parseInt(page) - 1;
        const stores = await prisma.store.findMany({
            orderBy: { id: "asc" },
            where: {
                name: query ? { contains: query } : undefined,
                address: district ? { contains: district } : undefined,
            },
            take: parseInt(limit),
            skip: skipPage * 10,
        });

        return NextResponse.json(
            {
                page: parseInt(page),
                data: stores,
                totalCount: count,
                totalPage: Math.ceil(count / 10),
            },
            {
                status: 200,
            }
        );
    } else {
        // 페이지가 없는 경우 모든 데이터 리턴
        const stores = await prisma.store.findMany({
            orderBy: { id: "asc" },
            where: {
                id: id ? parseInt(id) : undefined,
            },
            include: {
                likes: {
                    where: session
                        ? { userId: parseInt(session.user.id) }
                        : undefined,
                },
            },
        });

        return NextResponse.json(id ? stores[0] : stores, {
            status: 200,
        });
    }
}

export async function POST(req: Request) {
    const formData = await req.json();

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
        data: {
            ...formData,
            lat: data.documents[0].y,
            lng: data.documents[0].x,
        },
    });

    return NextResponse.json(result, { status: 200 });
}

export async function PUT(req: Request) {
    const formData = await req.json();

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

    // 사용자 입력값 + 카카오 좌표 값 수정
    const result = await prisma.store.update({
        where: {
            id: formData.id,
        },
        data: {
            ...formData,
            lat: data.documents[0].y,
            lng: data.documents[0].x,
        },
    });

    return NextResponse.json(result, { status: 200 });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);

    // params 에서 값 가져오기
    const id = searchParams.get("id");

    if (id) {
        // 사용자가 선택한 id의 데이터를 삭제
        const result = await prisma.store.delete({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(result, { status: 200 });
    }
    return NextResponse.json(null, { status: 500 });
}
