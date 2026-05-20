"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ROOT_SELECTOR = "#public-site-root";

function toElements(nodeList: NodeListOf<HTMLElement> | HTMLCollection): HTMLElement[] {
  return Array.from(nodeList).filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );
}

export function PublicSiteMotion() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const root = document.querySelector(ROOT_SELECTOR);

    if (!(root instanceof HTMLElement)) {
      return;
    }

    const ctx = gsap.context(() => {
      const headerPanel = root.querySelector<HTMLElement>(".publicHeaderPanel");
      const heroSection = root.querySelector<HTMLElement>("[data-hero-section]");
      const heroCopy = root.querySelector<HTMLElement>("[data-hero-copy]");
      const heroStage = root.querySelector<HTMLElement>("[data-hero-stage]");
      const isHomeHero = heroSection?.dataset.page === "home";
      const heroCopyItems = heroCopy
        ? toElements(heroCopy.querySelectorAll("[data-hero-item]"))
        : [];
      const heroStageItems = heroStage
        ? toElements(heroStage.querySelectorAll("[data-hero-stage-item]"))
        : [];

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

      heroTimeline.from(headerPanel, {
        y: -16,
        opacity: 0,
        scale: 0.99,
        duration: 0.58
      });

      if (heroCopyItems.length > 0) {
        heroTimeline.from(
          heroCopyItems,
          {
            y: 18,
            opacity: 0,
            scale: 0.985,
            duration: 0.56,
            stagger: 0.08
          },
          "-=0.24"
        );
      }

      if (heroStageItems.length > 0) {
        heroTimeline.from(
          heroStageItems,
          {
            y: 22,
            opacity: 0,
            scale: 0.985,
            duration: 0.6,
            stagger: 0.08
          },
          "-=0.28"
        );
      }

      if (isHomeHero && window.innerWidth >= 960 && heroSection && heroCopy && heroStage) {
        gsap.to(heroCopy, {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 0.8
          }
        });

        gsap.to(heroStage, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });
      }

      toElements(root.querySelectorAll("[data-section-header]")).forEach((header) => {
        gsap.from(toElements(header.children), {
          y: 18,
          opacity: 0,
          scale: 0.985,
          duration: 0.52,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 82%",
            once: true
          }
        });
      });

      [
        "[data-card-grid]",
        "[data-link-stack]",
        "[data-metric-grid]",
        "[data-step-list]",
        "[data-strip-grid]",
        "[data-panel-grid]",
        "[data-document-grid]",
        "[data-feature-grid]"
      ].forEach((selector) => {
        toElements(root.querySelectorAll(selector)).forEach((group) => {
          gsap.from(toElements(group.children), {
            y: 20,
            opacity: 0,
            scale: 0.985,
            duration: 0.54,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              once: true
            }
          });
        });
      });

      toElements(root.querySelectorAll("[data-reveal]")).forEach((element) => {
        gsap.from(element, {
          y: 18,
          opacity: 0,
          scale: 0.985,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true
          }
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
