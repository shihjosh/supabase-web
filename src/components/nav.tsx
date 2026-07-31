import Link from "next/link";

const links = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "履歷 / 自我介紹" },
  { href: "/blog", label: "部落格" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50"
        >
          Josh
        </Link>
        <ul className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-black dark:hover:text-zinc-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
