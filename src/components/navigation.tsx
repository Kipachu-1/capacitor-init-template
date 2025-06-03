import { Home, Library, Plus, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { useMemo } from "react";
import { hapticsImpactLight } from "@/utils";

interface NavigationBarProps {}

const navItems = [
  { path: "/", icon: Home, label: "home" },
  { path: "/create", icon: Plus, label: "create" },
  { path: "/library", icon: Library, label: "library" },
  { path: "/settings", icon: Settings, label: "settings" },
];

const getNavItems = (t: TFunction) => {
  return navItems.map((item) => ({
    ...item,
    label: t(`navigation.${item.label}`),
  }));
};

const NavigationBar: React.FC<NavigationBarProps> = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const navs = useMemo(() => getNavItems(t), [t]);

  return (
    <div className="fixed z-40 bottom-0 left-0 right-0 h-[var(--navbar-height)] pb-[var(--safe-bottom)] border-t bg-card mx-auto">
      <nav className="flex w-full items-center h-full justify-around relative">
        {navs.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="w-full h-full"
              onClick={hapticsImpactLight}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center h-full transition-all duration-200",
                  "",
                  isActive && "text-primary"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs mt-1 transition-all",
                    isActive
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationBar;
