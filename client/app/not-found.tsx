import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Página não encontrada.</p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
