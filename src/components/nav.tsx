import Link from "next/link";

const links = [
  { href: "/", label: "首頁" },
  { href: "/about", label: "自我介紹" },
  { href: "/blog", label: "部落格" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-cyan-500/20 bg-[#05070d]/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        >
          &lt;Josh/&gt;
        </Link>
        <ul className="flex items-center gap-6 font-mono text-sm font-medium text-slate-400">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-cyan-300"
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
