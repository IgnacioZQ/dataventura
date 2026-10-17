"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { PublicRoute } from "@/content/types";
import { IslandScenery, StopSymbol, stops } from "@/components/archipelago/map-scenery";
import { AppNav } from "@/components/ui/app-nav";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { playUiSound } from "@/lib/audio";
import { currentIslandSlug, isIslandUnlocked, levelInfo } from "@/lib/game";

type Progress = Record<string, { completed: boolean; stars: number; attempts: number }>;

function Stars({ count, className = "" }: { count: number; className?: string }) {
  return (
    <span className={`map-stars ${className}`} role="img" aria-label={`${count} de 3 estrellas`}>
      {[1, 2, 3].map((star) => <i key={star} className={star <= count ? "on" : ""}>★</i>)}
    </span>
  );
}

function Treasure({ unlocked, uid }: { unlocked: boolean; uid: string }) {
  return (
    <div
      className={`map-treasure ${unlocked ? "map-treasure-unlocked" : ""}`}
      role="img"
      aria-label={unlocked ? "Cofre del tesoro abierto: ruta completada" : "Cofre del tesoro: completa todas las islas de esta ruta para abrirlo"}
    >
      <span className="treasure-spark" aria-hidden="true">✦</span>
      <svg className="treasure-box" viewBox="0 0 64 56" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-treasure-metal`} x1="0" x2=".9" y1="0" y2="1">
            <stop offset="0" stopColor="#fff3d1" /><stop offset=".45" stopColor="#ffc56b" /><stop offset="1" stopColor="#a96a1c" />
          </linearGradient>
        </defs>
        {unlocked ? (
          <>
            <path d="M13 20 18 6h32l5 14-8 5H21l-8-5Z" fill="#fff3d1" stroke="#211432" strokeWidth="3" strokeLinejoin="round" />
            <path d="M14 24h36v24H14z" fill={`url(#${uid}-treasure-metal)`} stroke="#211432" strokeWidth="3" />
            <path d="M14 33h36M27 24v24m10-24v24" stroke="#211432" strokeWidth="3" />
            <path d="M29 31h7v9h-7z" fill="#fff" stroke="#211432" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M13 23V16a19 19 0 0 1 38 0v7" fill="#a98bd5" stroke="#211432" strokeWidth="3" />
            <path d="M13 23h38v25H13z" fill="#8f77bd" stroke="#211432" strokeWidth="3" />
            <path d="M13 32h38M28 23v25m9-25v25" stroke="#211432" strokeWidth="3" />
            <path d="M29 30h7v9h-7z" fill="#fff" stroke="#211432" strokeWidth="2" />
          </>
        )}
      </svg>
      <span className="treasure-stars" aria-hidden="true">{unlocked ? "✦  ✦  ✦" : "TESORO"}</span>
    </div>
  );
}

function Boat() {
  return (
    <svg className="boat-craft" viewBox="0 0 88 72" aria-hidden="true">
      <path className="boat-wake" d="M9 63c10-5 17 5 27 0s17 5 27 0 14 4 18 1" fill="none" stroke="#e9ddff" strokeLinecap="round" strokeWidth="3" />
      <path d="M14 48h62L64 63H28L14 48Z" fill="#321747" stroke="#e9ddff" strokeLinejoin="round" strokeWidth="3" />
      <path d="M42 7v42" stroke="#e9ddff" strokeLinecap="round" strokeWidth="4" />
      <path d="M38 13 17 42h21V13Z" fill="#f8f6ff" stroke="#8b5cf6" strokeLinejoin="round" strokeWidth="2" />
      <path d="M46 19 68 43H46V19Z" fill="#9b78e8" stroke="#e9ddff" strokeLinejoin="round" strokeWidth="2" />
      <path d="m42 8 8 5-8 5-8-5 8-5Z" fill="#fff" stroke="#211432" strokeWidth="2" />
      <circle cx="42" cy="13" r="1.6" fill="#211432" />
      <path d="M37 54h21" stroke="#c4b5fd" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function ArchipelagoMap({
  routes, progress, playerName, totalXp, streak, dueReviews, soundEnabled
}: {
  routes: PublicRoute[];
  progress: Progress;
  playerName: string;
  totalXp: number;
  streak: number;
  dueReviews: number;
  soundEnabled: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const level = levelInfo(totalXp);

  const { orderedSlugs, completed, currentSlug } = useMemo(() => {
    const slugs = routes.flatMap((route) => route.islands.map((island) => island.slug));
    const done = new Set(slugs.filter((slug) => progress[slug]?.completed));
    return { orderedSlugs: slugs, completed: done, currentSlug: currentIslandSlug(slugs, done) };
  }, [routes, progress]);

  // Al entrar, el barco espera en la siguiente isla por jugar (o en la última si ya terminó todo).
  const focusSlug = currentSlug ?? orderedSlugs[orderedSlugs.length - 1];
  const initialRoute = Math.max(0, routes.findIndex((route) => route.islands.some((island) => island.slug === focusSlug)));
  const [selectedRoute, setSelectedRoute] = useState(initialRoute);
  const [selectedStops, setSelectedStops] = useState<Record<string, number>>(() => ({
    [routes[initialRoute].slug]: Math.max(0, routes[initialRoute].islands.findIndex((island) => island.slug === focusSlug))
  }));
  const currentRouteRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (initialRoute > 0) currentRouteRef.current?.scrollIntoView({ block: "start" });
  }, [initialRoute]);

  const unlocked = (slug: string) => isIslandUnlocked(orderedSlugs, completed, slug);
  const allDone = currentSlug === null;

  return (
    <main className="archipelago-page relative min-h-screen overflow-hidden text-white">
      <div className="archipelago-sky" aria-hidden="true" />
      <header className="archipelago-hud sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-7">
        <Link href="/dashboard" aria-label="DataMind, mapa principal" className="flex items-center gap-2 font-black tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/30 bg-[#211432] text-lg text-violet-200 shadow-[0_3px_0_#100a19]">✦</span>
          <span className="hud-brand text-lg">DataMind</span>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <span className={`hud-streak ${streak > 0 ? "hud-streak-on" : ""}`} role="img" aria-label={streak > 0 ? `Racha de ${streak} ${streak === 1 ? "día" : "días"}` : "Sin racha activa: juega hoy para empezar una"}>
            <span aria-hidden="true">🔥</span>{streak}
          </span>
          <Link href="/profile" className="player-progress-chip" aria-label={`Perfil de ${playerName}, ${level.xp} puntos de experiencia, nivel ${level.level}: ${level.rank}`}>
            <span className="player-progress-avatar" aria-hidden="true">{playerName.trim().charAt(0).toLocaleUpperCase() || "N"}</span>
            <span className="player-progress-copy">
              <span className="player-progress-name">{playerName}</span>
              <span className="player-progress-meta">Nv. {level.level} · {level.rank} · {level.xp} XP</span>
              <span className="player-progress-track" role="progressbar" aria-label={`Progreso al nivel ${level.level + 1}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level.progress * 100)}>
                <span style={{ width: `${level.progress * 100}%` }} />
              </span>
            </span>
          </Link>
          <SoundToggle enabledInitially={soundEnabled} />
        </div>
      </header>

      <h1 className="sr-only">Archipiélago de los Datos</h1>

      {dueReviews > 0 && (
        <Link href="/review" className="map-banner">
          <span aria-hidden="true">↻</span>
          <span><b>{dueReviews} {dueReviews === 1 ? "concepto listo" : "conceptos listos"} para repasar.</b> Tres minutos para no olvidarlos.</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
      {allDone && dueReviews === 0 && (
        <p className="map-banner map-banner-done">
          <span aria-hidden="true">✦</span>
          <span><b>¡Recorriste todo el archipiélago!</b> Repite islas para ganar estrellas o adelanta tu Repaso.</span>
        </p>
      )}

      <div className="route-map-stack">
        {routes.map((route, routeIndex) => {
          const selectedStop = selectedStops[route.slug] ?? 0;
          const island = route.islands[selectedStop] ?? route.islands[0];
          const completedCount = route.islands.filter((item) => completed.has(item.slug)).length;
          const treasureUnlocked = completedCount === route.islands.length;
          const routeUnlocked = unlocked(route.islands[0].slug);
          const islandUnlocked = unlocked(island.slug);
          const islandProgress = progress[island.slug];
          const stop = stops[selectedStop] ?? stops[0];
          const uid = `route-${routeIndex}`;

          return (
            <section
              key={route.slug}
              ref={routeIndex === initialRoute ? currentRouteRef : undefined}
              className={`route-section ${routeUnlocked ? "" : "route-section-locked"}`}
              aria-labelledby={`route-title-${route.slug}`}
            >
              <div className={`route-chapter-heading ${selectedRoute === routeIndex ? "route-chapter-heading-active" : ""}`}>
                <div>
                  <p>RUTA {String(routeIndex + 1).padStart(2, "0")} · {route.level}</p>
                  <h2 id={`route-title-${route.slug}`}>{route.name}</h2>
                </div>
                <span>{routeUnlocked ? `${completedCount}/${route.islands.length}` : "🔒"}</span>
              </div>
              <div className="relative z-0 mx-auto w-full max-w-[640px] px-3 sm:px-0">
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: "easeOut" }}
                  className={`archipelago-map route-map route-map-${routeIndex + 1} relative mx-auto aspect-[640/1080] w-full overflow-hidden rounded-[2.5rem] border-[5px] border-violet-200/40 shadow-[0_18px_55px_#05030b99]`}
                >
                  <IslandScenery uid={uid} />
                  {route.islands.slice(0, stops.length).map((item, index) => {
                    const position = stops[index];
                    const isSelected = routeIndex === selectedRoute && index === selectedStop;
                    const isUnlocked = unlocked(item.slug);
                    const itemProgress = progress[item.slug];
                    const isCurrent = item.slug === currentSlug;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => {
                          setSelectedRoute(routeIndex);
                          setSelectedStops((previous) => ({ ...previous, [route.slug]: index }));
                          playUiSound("select");
                        }}
                        aria-pressed={isSelected}
                        aria-label={`${isUnlocked ? "Isla" : "Isla bloqueada"} ${index + 1}: ${item.name}${itemProgress?.completed ? `, completada con ${itemProgress.stars} estrellas` : ""}`}
                        className={[
                          "map-stop",
                          isSelected ? "map-stop-selected" : "",
                          isCurrent ? "map-stop-next" : "",
                          itemProgress?.completed ? "map-stop-completed" : "",
                          !isUnlocked ? "map-stop-locked" : ""
                        ].join(" ")}
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                      >
                        <span className="map-stop-number">{itemProgress?.completed ? "✓" : !isUnlocked ? "🔒" : String(index + 1).padStart(2, "0")}</span>
                        <StopSymbol name={position.symbol} />
                        {itemProgress?.completed && <Stars count={itemProgress.stars} className="map-stop-stars" />}
                        {(isSelected || isCurrent) && <span className="map-stop-pulse" aria-hidden="true" />}
                      </button>
                    );
                  })}
                  {selectedRoute === routeIndex && (
                    <div
                      className={`island-info-bubble ${islandUnlocked ? "" : "island-info-bubble-locked"}`}
                      data-side={stop.x < 50 ? "right" : "left"}
                      role="group"
                      aria-labelledby={`island-info-title-${island.slug}`}
                      style={{ left: `${stop.x + (stop.x < 50 ? 11 : -11)}%`, top: `${Math.max(14, Math.min(stop.y, 82))}%` }}
                    >
                      <p className="island-info-level">{island.skillLabel}</p>
                      <h2 id={`island-info-title-${island.slug}`}>{island.name}</h2>
                      <p className="island-info-challenge">{island.topic}</p>
                      {islandProgress?.completed
                        ? <Stars count={islandProgress.stars} className="island-info-stars" />
                        : (
                          <p className="island-info-progress">
                            {islandUnlocked ? `${island.challengeCount} desafíos · hasta ${island.maxXp} XP` : "Completa la isla anterior para abrirla"}
                          </p>
                        )}
                      {islandUnlocked ? (
                        <Link href={`/session?island=${island.slug}`} className="island-info-cta">
                          {islandProgress?.completed ? "Repetir" : "¡Jugar!"} <span aria-hidden="true">→</span>
                        </Link>
                      ) : (
                        <span className="island-info-cta island-info-cta-locked" aria-disabled="true">Bloqueada <span aria-hidden="true">🔒</span></span>
                      )}
                    </div>
                  )}
                  <Treasure unlocked={treasureUnlocked} uid={uid} />
                  <div
                    className="map-boat"
                    aria-hidden="true"
                    style={{
                      // El barco queda al lado opuesto de la burbuja de información.
                      left: `${Math.max(7, Math.min(stop.x + (stop.x < 50 ? -17 : 17), 93))}%`,
                      top: `${Math.max(stop.y - 8, 4)}%`
                    }}
                  >
                    <Boat />
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>
      <AppNav active="map" dueReviews={dueReviews} />
    </main>
  );
}
