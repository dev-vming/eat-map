import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // params 에서 값들 가져오기
    const page = searchParams.get("page") as string;
    const limit = searchParams.get("limit") as string;

    const count = await prisma.like.count({
        where: {
            userId: parseInt(session.user.id),
        },
    });
    const skipPage = parseInt(page) - 1;

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
        skip: skipPage * parseInt(limit),
        take: parseInt(limit),
    });

    return NextResponse.json(
        {
            data: likes,
            page: parseInt(page),
            totalPage: Math.ceil(count / parseInt(limit)),
        },
        { status: 200 }
    );
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // like 데이터가 존재하는 지 확인
    let like = await prisma.like.findFirst({
        where: {
            storeId: body.storeId,
            userId: parseInt(session.user.id),
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
        return NextResponse.json(like, { status: 200 });
    } else {
        // 찜이 되어있지 않은 상황 : like 데이터 추가
        like = await prisma.like.create({
            data: {
                storeId: body.storeId,
                userId: parseInt(session.user.id),
            },
        });
        return NextResponse.json(like, { status: 201 });
    }
}
