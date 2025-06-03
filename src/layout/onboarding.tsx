import { Outlet } from "react-router";
import { cn } from "@/lib/utils";

export default function Layout() {
  return (
    <>
      <div className="fixed inset-0 z-[1] overflow-auto">
        <div className="w-full mx-auto bg-background flex flex-col">
          {/* Main Content */}
          <main
            className={cn(
              "flex-1 pt-[var(--safe-top)] pb-[calc(var(--safe-bottom)+rem)] px-4"
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
