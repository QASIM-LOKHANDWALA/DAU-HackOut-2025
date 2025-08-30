import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({});
    const { login, register, error, loading, clearAuthErrors } = useAuth();

    useEffect(() => {
        console.log("state of loading: ", loading);
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(formData);
                toast.success("Logged in successfully");
            } else {
                await register(formData);
                toast.success("Registered successfully");
            }
            navigate("/dashboard");
        } catch (err) {
            toast.error(err);
        } finally {
            setFormData({});
            clearAuthErrors();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            return { ...prev, [name]: value };
        });
    };

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            {...props}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                {!isLogin && (
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            onChange={handleChange}
                            value={formData.name || ""}
                        />
                    </div>
                )}
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        onChange={handleChange}
                        value={formData.email || ""}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        onChange={handleChange}
                        value={formData.password || ""}
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-zinc-900"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            Processing...
                        </>
                    ) : isLogin ? (
                        "Login"
                    ) : (
                        "Create Account"
                    )}
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                        Or continue with
                    </span>
                </div>
                <Button variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                        />
                    </svg>
                    Login with GitHub
                </Button>
            </div>
            <div className="text-center text-sm">
                {isLogin
                    ? "Don't have an account? "
                    : "Already have an account? "}
                <span
                    onClick={() => setIsLogin(!isLogin)}
                    className="underline underline-offset-4 hover:cursor-pointer"
                >
                    {isLogin ? "Sign up" : "Login"}
                </span>
            </div>
        </form>
    );
}
