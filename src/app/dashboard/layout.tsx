import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        
        <div className="flex bg-transparent">
            <Sidebar />
            {/* MAIN CONTENT*/}
            <div className="flex-1 flex flex-col">

                {/* TOP NAVBAR*/}
                <header className="bg-white/60 backdrop-blur-md border-b border-white/20 shadow-sm px-8 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            School Management System
                        </h2>

                        <p className="text-gray-900">
                            Welcome to the admin dashboard
                        </p>
                    </div>

                    {/*ADMIN INFO */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-semibold text-gray-900">
                                Admin
                            </p>
                            <p className="text-sm text-gray-900">
                                School Administrator
                            </p>
                        </div>

                        <Image
                        src="/images/logo.png"
                        alt="Admin"
                        width={45}
                        height={45}
                        className="rounded-full"
                        />
                        
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main
                className="min-h-screen bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage:"linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('/images/photo-1.jpg')",
                }}
                
                >

                    {/* CONTENT WRAPPER */}
                    <div className="relative z-10 w-full p-6">
                {children}
        </div>
        </main>
        </div>
        </div>
    );
}
