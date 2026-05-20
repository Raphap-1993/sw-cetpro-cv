"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import styles from "../public-site.module.css";

const AUTO_ADVANCE_MS = 6500;

export type HomeHeroSlide = {
  body: string;
  id: string;
  mediaUrl: string;
  title: string;
};

type HomeHeroSliderProps = {
  children?: ReactNode;
  slides: HomeHeroSlide[];
};

export function HomeHeroSlider({ children, slides }: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (activeIndex <= slides.length - 1) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, slides.length]);

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function goToPreviousSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1
    );
  }

  function goToNextSlide() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  }

  return (
    <div
      aria-label="Galería institucional del CETPRO César Vallejo de Pucallpa"
      aria-roledescription={hasMultipleSlides ? "carousel" : undefined}
      className={`${styles.heroImageCard} ${styles.heroSliderCard}`}
    >
      <div className={styles.heroSliderViewport}>
        {slides.map((slide, index) => (
          <figure
            aria-hidden={index !== activeIndex}
            className={styles.heroSlide}
            data-active={index === activeIndex}
            key={slide.id}
          >
            <img
              alt={slide.title}
              className={styles.heroSlideImage}
              src={slide.mediaUrl}
            />
            <figcaption className={styles.heroImageCaption}>
              <strong>{slide.title}</strong>
              <p>{slide.body}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {children ? <div className={styles.heroSliderOverlay}>{children}</div> : null}

      {hasMultipleSlides ? (
        <div className={styles.heroSliderToolbar}>
          <div className={styles.heroSliderButtons}>
            <button
              aria-label="Ver imagen anterior"
              className={styles.heroSliderButton}
              onClick={goToPreviousSlide}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              aria-label="Ver imagen siguiente"
              className={styles.heroSliderButton}
              onClick={goToNextSlide}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className={styles.heroSliderDots}>
            {slides.map((slide, index) => (
              <button
                aria-label={`Ir a la imagen ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={styles.heroSliderDot}
                data-active={index === activeIndex}
                key={slide.id}
                onClick={() => goToSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
