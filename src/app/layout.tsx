import "@/styles/globals.css";
import { Metadata } from "next";
import { NextLayout, NextProvider } from "./providers";

export const metadata: Metadata = {
    title: "eat-map",
    description: "서울시 인증 식당 데이터를 이용한 맛집 앱",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="eng">
            <body>
                <NextProvider>
                    <NextLayout>{children}</NextLayout>
                </NextProvider>
            </body>
        </html>
    );
}
