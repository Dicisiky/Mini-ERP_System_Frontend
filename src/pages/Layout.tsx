import AppSidebar from "@/components/partials/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-gray-100/60">
        <ToastContainer />
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
