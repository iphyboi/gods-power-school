"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Receipt,
    CreditCard,
    Megaphone,
    ImageIcon,
    LucideIcon,
    Home,
    UserPlus,
    UploadCloud,
    CalendarDays,
    PlusCircle,
    LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Attendance from "@/models/Attendance";

const links: {
    name: string;
    href: string;
    icon: LucideIcon;
    isLogout?: boolean;
}[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },

    {
        name: "Students",
        href: "/dashboard/students",
        icon: Users, 
    },

    {
        name: "Add Students",
        href: "/dashboard/students/add",
        icon: UserPlus,
    },

    {
        name: "Results",
        href: "/dashboard/results",
        icon: Receipt,
        },

    {
        name: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
    },

    {
        name: "Add Payments",
        href: "/dashboard/payments/add",
        icon: PlusCircle,
    },

    {
        name: "Attendance",
        href: "/dashboard/attendance",
        icon: CalendarDays,
    },

    {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone
    },

    {
        name: "Gallery",
        href: "/dashboard/gallery",
        icon: ImageIcon
    },

    {
        name: "HomePage",
        href: "/",
        icon: Home,
    },
    {
        name: "Logout",
        href: "/dashboard",
        icon: LogOut,
        isLogout: true,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "token=; expires=Thu, 01 jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("user_role");
        router.push("/login");
        router.refresh();
    };

    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">
            <h1 className="text-2xl font-bold mb-10">
                School Portal
            </h1>

            <nav className="flex flex-col gap-3">
                {links.map((link) => {
                    const Icon = link.icon;

                    const isActive = pathname === link.href;

                    if(link.isLogout) {
                        return (
                            <button
                            key={link.name}
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded-lg transition text-red-400 hover:bg-red-950/20 w-full mt-6 border-t border-gray-800/60 pt-4"
                            >
                                <Icon size={20} className="text-red-500" />
                                <span>{link.name}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-3 p-3 rounded-lg transition ${
                            isActive
                            ? "bg-blue-600"
                            : "hover:bg-gray-800"
                        }`}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>

               
                    );
                })}
            </nav>
        </aside>
    );
}