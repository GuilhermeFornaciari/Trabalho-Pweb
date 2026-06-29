import Header from "@/components/header";
import Providers from "./providers";

export default function PaginasLayout({children,}: {children: React.ReactNode;}) {
  return (
    <Providers>
      <div className="min-h-screen bg-olive-50 flex flex-col">
        <Header></Header>
        <div className="flex-1">
            {children}
        </div>
      </div>
    </Providers>
  );
}