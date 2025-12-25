import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);

    // params 에서 값들 가져오기
    const page = searchParams.get("page") as string;
    const limit = searchParams.get("limit") as string;
    const storeId = searchParams.get("storeId") as string;
    const user = searchParams.get("user");

    const skipPage = parseInt(page) - 1;
    const count = await prisma.comment.count({
        where: {
            storeId: storeId ? parseInt(storeId) : undefined,
            userId:
                user && session?.user.id ? parseInt(session?.user.id) : undefined,
        },
    });

    const comments = await prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        where: {
            storeId: storeId ? parseInt(storeId) : undefined,
            userId: user && session?.user.id ? parseInt(session?.user.id) : undefined,
        },
        skip: skipPage * parseInt(limit),
        take: parseInt(limit),
        include: {
            user: true,
            store: true,
        },
    });

    return NextResponse.json(
        {
            data: comments,
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

    const datas = await req.json();

    const comment = await prisma.comment.create({
        data: {
            storeId: parseInt(datas.storeId),
            body: datas.body,
            userId: parseInt(session?.user.id),
        },
    });
    return NextResponse.json(comment, { status: 200 });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);

    // params 에서 값 가져오기
    const id = searchParams.get("id") as string;

    if (!session || !session.user || !id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.comment.delete({
        where: {
            id: parseInt(id),
        },
    });

    return NextResponse.json(result, { status: 200 });
}
