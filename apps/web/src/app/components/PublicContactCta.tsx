"use client";

import Link from "next/link";
import { useId, useState } from "react";

type PublicContactCtaProps = {
  contactHref: string;
  whatsappHref: string | null;
};

export function PublicContactCta({
  contactHref,
  whatsappHref
}: PublicContactCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`publicContactCta ${isOpen ? "isOpen" : ""}`}>
      <div className="publicContactCtaPanel" id={panelId}>
        <p className="publicContactCtaCopy">
          Si tienes dudas sobre una carrera, podemos orientarte.
        </p>
        {whatsappHref ? (
          <a
            className="publicContactCtaLink publicContactCtaPrimary"
            href={whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            Escríbenos por WhatsApp
          </a>
        ) : null}
        <Link
          className="publicContactCtaLink publicContactCtaSecondary"
          href={contactHref}
        >
          Déjanos tus datos y te orientamos
        </Link>
      </div>

      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="publicContactCtaTrigger"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        ¿Necesitas orientación?
      </button>
    </div>
  );
}
