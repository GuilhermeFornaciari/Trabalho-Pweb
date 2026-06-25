import Header from "@/components/header";
import Providers from "./providers";

export default function PaginasLayout({children,}: {children: React.ReactNode;}) {
  return (
    <Providers>
      <div className="min-h-screen bg-olive-50 min-h-screen flex flex-col">
        <Header></Header>
        <div className="flex flex-col flex-1 items-center justify-center h-full pt-20">
            {children}
        </div>
      </div>
    </Providers>
  );
}