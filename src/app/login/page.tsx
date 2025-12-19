"use client";

import { useFormStatus } from "react-dom";
import { login } from "@/app/actions";
import { useState } from "react";
import { User, Lock } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 font-medium"
        >
            {pending ? "Ingresando..." : "Ingresar"}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(formData: FormData) {
        const result = await login(formData);
        if (result?.error) {
            setErrorMessage(result.error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Aladino Pelotero</h1>
                    <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
                </div>

                <form action={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <User size={18} />
                            </span>
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                                placeholder="Usuario"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <Lock size={18} />
                            </span>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                            {errorMessage}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
