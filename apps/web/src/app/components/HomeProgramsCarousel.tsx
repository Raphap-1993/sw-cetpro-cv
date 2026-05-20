"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../public-site.module.css";

export type HomeProgramCarouselItem = {
  body: string;
  duration: string;
  fallbackImageUrl: string;
  href: string;
  id: string;
  imageUrl: string;
  mediaKind: "graphic" | "photo";
  modality: string;
  studyPlanLabel: string;
  title: string;
};

type HomeProgramsCarouselProps = {
  programs: HomeProgramCarouselItem[];
};

export function HomeProgramsCarousel({ programs }: HomeProgramsCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiplePrograms = programs.length > 1;

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const images = Array.from(
      track.querySelectorAll<HTMLImageElement>("img[data-fallback-src]")
    );

    const repairImage = (image: HTMLImageElement) => {
      const fallbackSrc = image.dataset.fallbackSrc;

      if (!fallbackSrc || image.dataset.fallbackApplied === "true") {
        return;
      }

      if (image.complete && image.naturalWidth === 0) {
        image.dataset.fallbackApplied = "true";
        image.src = fallbackSrc;
        image.parentElement?.setAttribute("data-media-kind", "graphic");
      }
    };

    const cleanups = images.map((image) => {
      repairImage(image);

      const handleError = () => repairImage(image);
      image.addEventListener("error", handleError);

      return () => image.removeEventListener("error", handleError);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [programs]);

  useEffect(() => {
    if (activeIndex <= programs.length - 1) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, programs.length]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frame = 0;

    const syncActiveIndex = () => {
      window.cancelAnimationFrame(frame);

      frame = window.requestAnimationFrame(() => {
        const cards = Array.from(track.children);

        if (cards.length === 0) {
          return;
        }

        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let nextIndex = 0;
        let nextDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, index) => {
          if (!(card instanceof HTMLElement)) {
            return;
          }

          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const distance = Math.abs(trackCenter - cardCenter);

          if (distance < nextDistance) {
            nextDistance = distance;
            nextIndex = index;
          }
        });

        setActiveIndex(nextIndex);
      });
    };

    syncActiveIndex();
    track.addEventListener("scroll", syncActiveIndex, { passive: true });
    window.addEventListener("resize", syncActiveIndex);

    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", syncActiveIndex);
      window.removeEventListener("resize", syncActiveIndex);
    };
  }, [programs.length]);

  function scrollToProgram(index: number) {
    const track = trackRef.current;
    const card = track?.children.item(index);

    if (!(card instanceof HTMLElement)) {
      return;
    }

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
    setActiveIndex(index);
  }

  function goToPreviousProgram() {
    scrollToProgram(activeIndex === 0 ? programs.length - 1 : activeIndex - 1);
  }

  function goToNextProgram() {
    scrollToProgram((activeIndex + 1) % programs.length);
  }

  return (
    <div
      aria-label="Carrusel de programas de estudio del CETPRO César Vallejo de Pucallpa"
      aria-roledescription={hasMultiplePrograms ? "carousel" : undefined}
      className={styles.programCarouselFrame}
    >
      {hasMultiplePrograms ? (
        <div className={styles.programCarouselTopbar}>
          <div className={styles.programCarouselControls}>
            <span className={styles.programCarouselStatus} aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(programs.length).padStart(2, "0")}
            </span>
            <div className={styles.programCarouselButtons}>
              <button
                aria-label="Ver programa anterior"
                className={styles.programCarouselButton}
                onClick={goToPreviousProgram}
                type="button"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                aria-label="Ver programa siguiente"
                className={styles.programCarouselButton}
                onClick={goToNextProgram}
                type="button"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.programCarouselViewport}>
        <div className={styles.programCarouselTrack} ref={trackRef}>
          {programs.map((program, index) => (
            <article
              className={styles.programCarouselCard}
              data-active={index === activeIndex}
              key={program.id}
            >
              <div className={styles.programCarouselMedia} data-media-kind={program.mediaKind}>
                <span className={styles.programCarouselBadge}>{program.modality}</span>
                <img
                  alt=""
                  data-fallback-src={program.fallbackImageUrl}
                  loading="lazy"
                  onError={(event) => {
                    const image = event.currentTarget;

                    if (image.dataset.fallbackApplied === "true") {
                      return;
                    }

                    image.dataset.fallbackApplied = "true";
                    image.src = program.fallbackImageUrl;
                    image.parentElement?.setAttribute("data-media-kind", "graphic");
                  }}
                  src={program.imageUrl}
                />
              </div>

              <div className={styles.programCarouselBody}>
                <div className={styles.programCarouselText}>
                  <h3>{program.title}</h3>
                  <p>{program.body}</p>
                </div>

                <div className={styles.programCarouselFacts}>
                  <span>{program.duration}</span>
                  <span>{program.studyPlanLabel}</span>
                </div>

                <div className={styles.programCarouselFooter}>
                  <Link className={styles.programCarouselLink} href={program.href}>
                    Ver programa
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {hasMultiplePrograms ? (
        <div className={styles.programCarouselDots}>
          {programs.map((program, index) => (
            <button
              aria-label={`Ir a ${program.title}`}
              aria-pressed={index === activeIndex}
              className={styles.programCarouselDot}
              data-active={index === activeIndex}
              key={program.id}
              onClick={() => scrollToProgram(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
