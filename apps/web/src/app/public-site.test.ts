import assert from "node:assert/strict";
import test from "node:test";
import { getPublicWhatsAppHref, publicContactHref } from "./public-site";

test("public site exposes the shared contact route", () => {
  assert.equal(publicContactHref, "/contacto");
});

test("public site trims the configured WhatsApp url", () => {
  const previous = process.env.NEXT_PUBLIC_WHATSAPP_URL;

  process.env.NEXT_PUBLIC_WHATSAPP_URL = " https://wa.me/51999999999?text=Hola ";

  assert.equal(
    getPublicWhatsAppHref(),
    "https://wa.me/51999999999?text=Hola"
  );

  if (typeof previous === "string") {
    process.env.NEXT_PUBLIC_WHATSAPP_URL = previous;
    return;
  }

  delete process.env.NEXT_PUBLIC_WHATSAPP_URL;
});

test("public site returns null when WhatsApp is not configured", () => {
  const previous = process.env.NEXT_PUBLIC_WHATSAPP_URL;

  delete process.env.NEXT_PUBLIC_WHATSAPP_URL;

  assert.equal(getPublicWhatsAppHref(), null);

  if (typeof previous === "string") {
    process.env.NEXT_PUBLIC_WHATSAPP_URL = previous;
  }
});
