"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter();

    const [ email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await res.json();

    if (data.token) {
        document.cookie = `token=${data.token}; path=/`;

        if (data.user && data.user.role) {
            localStorage.setItem("user_role", data.user.role);
        }
        router.push("/dashboard");
    } else {
        alert(data.message || "Login failed");
    }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
            backgroundImage: "url('/images/photo-4.jpg')"
        }}
        >
            <div className="bg-white p-6 rounded-xl shadow w-[350px]">
                <h1 className="text-2xl font-bold mb-4 text-black">
                    Admin Login
                </h1>

                <input
                className="border w-full p-2 mb-3 text-black"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <input
                className="border w-ful p-2 mb-4 text-black"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white w-full py-2 rounded"
                  >
                    Login
                  </button>
            </div>
        </div>
    );
}