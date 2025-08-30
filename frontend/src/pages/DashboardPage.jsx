import React from "react";
import { Routes, Route } from "react-router-dom";
import AppSidebar from "../components/custom/AppSidebar";
import { SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import Navbar from "../components/custom/Navbar";
import HydrogenDashboard from "../components/custom/HydrogenDashboard";

const DashboardHome = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold">Dashboard Home</h2>
        <p>Welcome to your dashboard!</p>
    </div>
);
const Inbox = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold">Inbox</h2>
        <p>Your messages will appear here.</p>
    </div>
);
const Calendar = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <p>Your events and appointments.</p>
    </div>
);
const Search = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold">Search</h2>
        <p>Search through your data.</p>
    </div>
);
const Settings = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p>Manage your preferences.</p>
    </div>
);
const Profile = () => (
    <div className="p-6">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p>Manage your profile information.</p>
    </div>
);

const DashboardPage = () => {
    return (
        <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 w-full">
                <Navbar />
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<HydrogenDashboard />} />
                        <Route path="/inbox" element={<Inbox />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
