"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { PublicNavItem } from "../public-site";

type PublicSiteHeaderProps = {
  ctaHref?: string;
  ctaLabel: string;
  navItems: PublicNavItem[];
  siteName: string;
  tagline: string;
};

export function PublicSiteHeader({
  ctaHref,
  ctaLabel,
  navItems,
  siteName,
  tagline
}: PublicSiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((current) => !current);
  const isCurrentPath = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="publicHeader">
      <div className="shell publicHeaderInner">
        <Link className="publicBrand" href="/" onClick={closeMenu}>
          <span aria-hidden="true" className="publicBrandMark">
            <span className="publicBrandMarkSeal">CV</span>
            <span className="publicBrandMarkWord">CETPRO</span>
          </span>
          <span className="publicBrandCopy">
            <span className="publicBrandMeta">
              <span>Pucallpa</span>
              <span>Formación presencial</span>
            </span>
            <strong>{siteName}</strong>
            <small>{tagline}</small>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="publicNav">
          {navItems.map((item) => (
            <Link
              aria-current={isCurrentPath(item.href) ? "page" : undefined}
              className={isCurrentPath(item.href) ? "isCurrent" : undefined}
              key={`${item.href}:${item.label}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {ctaHref ? (
          <Link className="publicHeaderCta" href={ctaHref}>
            {ctaLabel}
          </Link>
        ) : null}

        <div className="publicMenu">
          <button
            aria-controls="public-menu-panel"
            aria-expanded={isMenuOpen}
            className="publicMenuButton"
            onClick={toggleMenu}
            type="button"
          >
            Menú
          </button>

          <nav
            aria-label="Navegación móvil"
            className={`publicMenuPanel ${isMenuOpen ? "isOpen" : ""}`}
            id="public-menu-panel"
          >
            {navItems.map((item) => (
              <Link
                aria-current={isCurrentPath(item.href) ? "page" : undefined}
                className={isCurrentPath(item.href) ? "isCurrent" : undefined}
                key={`mobile:${item.href}:${item.label}`}
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            {ctaHref ? (
              <Link className="publicMenuCta" href={ctaHref} onClick={closeMenu}>
                {ctaLabel}
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
