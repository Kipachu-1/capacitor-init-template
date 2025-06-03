import { Toaster as ToasterComponent } from "sonner";

interface ToasterProps {}

const Toaster: React.FC<ToasterProps> = () => {
  return (
    <ToasterComponent
      toastOptions={{
        style: {
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      }}
      mobileOffset={{ bottom: 80 }}
    />
  );
};

export default Toaster;
