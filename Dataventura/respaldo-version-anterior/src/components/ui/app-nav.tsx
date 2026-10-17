import Link from "next/link";

const items = [
  { key: "map", href: "/dashboard", label: "Mapa", icon: "M3 6.5 8.5 4l7 2.5L21 4v13.5L15.5 20l-7-2.5L3 20V6.5ZM8.5 4v13.5m7-11V20" },
  { key: "review", href: "/review", label: "Repaso", icon: "M20 7v5h-5M4 17v-5h5M5.5 9a7 7 0 0 1 12-2L20 12M4 12l2.5 5a7 7 0 0 0 12-2" },
  { key: "profile", href: "/profile", label: "Perfil", icon: "M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20c.8-3.5 3.1-5.3 7-5.3s6.2 1.8 7 5.3" }
] as const;

/** Barra de navegación inferior, al estilo de una app de celular. */
export function AppNav({ active, dueReviews }: { active: (typeof items)[number]["key"]; dueReviews: number }) {
  return (
    <nav className="app-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <Link key={item.key} href={item.href} className={item.key === active ? "app-nav-item app-nav-active" : "app-nav-item"} aria-current={item.key === active ? "page" : undefined}>
          <span className="app-nav-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon} /></svg>
            {item.key === "review" && dueReviews > 0 && (
              <b className="app-nav-badge" aria-label={`${dueReviews} repasos pendientes`}>{dueReviews > 9 ? "9+" : dueReviews}</b>
            )}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
