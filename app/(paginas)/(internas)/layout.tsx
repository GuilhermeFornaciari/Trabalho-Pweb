import Header from "@/components/header";

export default function PaginasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-olive-50 min-h-screen flex flex-col">
      <Header></Header>
      <div className="flex flex-col flex-1 items-center justify-center h-full pt-20">
        {children}
      </div>
    </div>
  );
}