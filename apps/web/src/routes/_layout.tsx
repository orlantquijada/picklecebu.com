import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer } from "#/components/landing/footer";
import { Header } from "#/components/landing/header";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/_layout")({ component: Layout });
