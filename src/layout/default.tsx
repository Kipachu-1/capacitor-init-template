import { Outlet } from "react-router";
import { cn } from "@/lib/utils";
import NavigationBar from "@/components/navigation";

export default function Layout() {
  return (
    <>
      <div className="fixed min-h-full inset-0 bg-background overflow-auto">
        <div
          id="status-bar"
          className="fixed bg-dots z-[100] top-0 right-0 left-0 h-[var(--safe-top)] w-full"
        ></div>
        <div className="w-full bg-background flex flex-col">
          {/* Main Content */}
          <main
            className={cn(
              "flex-1 pt-[var(--safe-top)] pb-[calc(var(--safe-bottom)+8rem)] px-4"
            )}
          >
            <Outlet />
          </main>

          {/* Podcast Player */}
          <NavigationBar />
        </div>
      </div>
    </>
  );
}
