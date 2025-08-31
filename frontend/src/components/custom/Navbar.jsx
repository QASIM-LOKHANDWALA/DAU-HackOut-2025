import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { LogOut, Settings, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleSignOut = () => {
        logout();
        navigate("/auth");
    };

    const handleProfile = () => {
        navigate("/dashboard/profile");
    };

    const handleSettings = () => {
        navigate("/dashboard/settings");
    };
    return (
        <nav className="p-4 flex items-center justify-between w-full">
            {/* <SidebarTrigger /> */}

            <div className="flex items-center gap-4">
                <Link to="/dashboard" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleProfile}>
                            <User /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSettings}>
                            <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={handleSignOut}
                        >
                            <LogOut /> Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
};

export default Navbar;
