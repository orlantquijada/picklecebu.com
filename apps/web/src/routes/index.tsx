import { createFileRoute } from "@tanstack/react-router";

const HomePage = () => <div>Hello</div>;

export const Route = createFileRoute("/")({ component: HomePage });
