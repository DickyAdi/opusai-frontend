/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Returned by database, should be clear */
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import ErrorToaster from "@/components/utils/error_toaster";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Opus AI",
	description: "Made by us for your customized needs",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <hydration and trusted>
					dangerouslySetInnerHTML={{
						__html: `
          (function () {
            try {
              var themeMode = localStorage.getItem('theme-mode-storage');
              if (themeMode) {
                var state = JSON.parse(themeMode);
                if (state.state && state.state.currentTheme) {
                  document.documentElement.classList.add(state.state.currentTheme);
                  }
                if (state.state && state.state.currentFont) {
                  document.documentElement.classList.add(state.state.currentFont);
                }
              }
            } catch (e) {}
          })();
          `,
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
			>
				<NextTopLoader />
				{children}
				<Toaster />
				<ErrorToaster />
			</body>
		</html>
	);
}
