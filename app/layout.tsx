import "./globals.css";
import type {Metadata} from "next";
export const metadata:Metadata={title:"منظور تقني",description:"حلول رقمية وانظمة تقنية"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html dir="rtl" lang="ar"><body>{children}</body></html>}
