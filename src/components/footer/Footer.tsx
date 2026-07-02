import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-outline-variant py-12 px-edge-margin-mobile md:px-edge-margin-desktop max-w-container-max mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-gutter">
        {/* Logo */}
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          GospelReads.
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6" aria-label="Links do rodapé">
          <Link
            href="/privacidade"
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Privacidade
          </Link>
          <Link
            href="/termos"
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Termos
          </Link>
          <Link
            href="/contato"
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Contato
          </Link>
          <Link
            href="/diario"
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Diário
          </Link>
        </nav>

        {/* Copyright */}
        <span className="text-caption text-on-surface-variant">
          © {new Date().getFullYear()} GospelReads.
        </span>
      </div>
    </footer>
  );
}
