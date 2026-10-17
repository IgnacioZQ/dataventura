"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CaptainNexus } from "@/components/ui/captain-nexus";
import { playUiSound } from "@/lib/audio";

const welcomeScenes = [
  {
    eyebrow: "CAPITÁN NEXUS · PUERTO DE PARTIDA",
    message: "¡Ahoy, {name}! Soy Nexus, capitán y dueño de este barco. Desde aquí navegaremos un mundo hecho de datos y preguntas interesantes.",
    cue: "newcomer"
  },
  {
    eyebrow: "PRIMERA LECCIÓN · EL MAR DE LOS DATOS",
    message: "Cada dato es una pista que viene de personas, lugares y momentos reales. Algunas pistas llegan completas; otras se pierden entre las olas.",
    cue: "data"
  },
  {
    eyebrow: "A BORDO · LA BRÚJULA DE LA EVIDENCIA",
    message: "No navegamos por corazonadas: observamos la evidencia, hacemos preguntas y elegimos un rumbo que podamos explicar.",
    cue: "evidence"
  },
  {
    eyebrow: "TU BITÁCORA · RUTAS POR DESCUBRIR",
    message: "Visitaremos islas, resolveremos misterios y guardaremos tu progreso. Cada ruta lleva más lejos y te invita a pensar con mayor profundidad.",
    cue: "routes"
  }
] as const;

const goals = [
  ["DECISIONES","Tomar mejores decisiones con datos"],
  ["PROFESIONAL","Mejorar mis habilidades profesionales"],
  ["ESTUDIOS","Prepararme para estudios o certificaciones"],
  ["CURIOSIDAD","Curiosidad personal"]
] as const;
const levels = [["PRINCIPIANTE","Principiante"],["INTERMEDIO","Intermedio"],["AVANZADO","Avanzado"]] as const;

export function OnboardingForm({ name }: { name:string }) {
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [scene,setScene]=useState(0);
  const prefersReducedMotion=useReducedMotion();
  const router=useRouter();

  function continueWelcome() {
    playUiSound("reveal");
    setScene((current)=>current+1);
  }

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form=new FormData(event.currentTarget);
    try {
      const response=await fetch("/api/onboarding",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          objetivoDeclarado:form.get("goal"),
          nivelInicial:form.get("level")
        })
      });
      const result: { error?:string }=await response.json();
      if(!response.ok) { setError(result.error??"No se pudo guardar tu perfil.");setBusy(false);return; }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("No fue posible conectar con DataMind. Inténtalo nuevamente.");
      setBusy(false);
    }
  }

  if(scene < welcomeScenes.length) {
    const current=welcomeScenes[scene];
    const motionTransition={duration:prefersReducedMotion?0:.32,ease:"easeOut" as const};

    return <section className="nexus-welcome" aria-label="Bienvenida al mundo de los datos">
      <div className="nexus-welcome-top">
        <span className="nexus-welcome-mark" aria-hidden="true">✦</span>
        <span>DATA MIND · BITÁCORA DEL CAPITÁN</span>
        <span className="nexus-welcome-step">{scene+1}/{welcomeScenes.length}</span>
      </div>
      <div className="nexus-welcome-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={scene}
            className="nexus-welcome-illustration"
            initial={prefersReducedMotion?false:{opacity:0,scale:.92,y:12}}
            animate={{opacity:1,scale:1,y:0}}
            exit={prefersReducedMotion?undefined:{opacity:0,scale:.97,y:-8}}
            transition={motionTransition}
          >
            <div className="nexus-orbit nexus-orbit-one" aria-hidden="true" />
            <div className="nexus-orbit nexus-orbit-two" aria-hidden="true" />
            <div className={`nexus-scene-cue nexus-scene-cue-${current.cue}`} aria-hidden="true">
              {current.cue==="newcomer"?"⚓":current.cue==="data"?"▤":current.cue==="evidence"?"⌖":"✦"}
            </div>
            {current.cue==="routes"&&<div className="nexus-mini-ship" aria-hidden="true"><span>▲</span><i /></div>}
            <CaptainNexus className="nexus-welcome-captain" />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`dialog-${scene}`}
            className="nexus-dialogue"
            initial={prefersReducedMotion?false:{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            exit={prefersReducedMotion?undefined:{opacity:0,y:-6}}
            transition={motionTransition}
          >
            <p>{current.eyebrow}</p>
            <h1>{current.message.replace("{name}",name)}</h1>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="nexus-welcome-controls">
        <div className="nexus-welcome-dots" aria-label={`Introducción, escena ${scene+1} de ${welcomeScenes.length}`}>
          {welcomeScenes.map((item,index)=><span key={item.cue} className={index===scene?"active":""} />)}
        </div>
        <button type="button" onClick={continueWelcome} className="nexus-continue">
          {scene===welcomeScenes.length-1?"¡A bordo!":"Continuar"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>;
  }

  return <section className="w-full rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl sm:p-10">
    <p className="text-sm uppercase tracking-[0.2em] text-violet">Preparación de la ruta</p>
    <h1 className="mt-3 text-3xl font-semibold">Hola, {name}. ¿Qué quieres entrenar?</h1>
    <p className="mt-2 text-sm text-lavender">Esta ruta recomienda desafíos; no limita lo que podrás aprender.</p>
    <form className="mt-7 space-y-6" onSubmit={submit}>
      <fieldset>
        <legend className="mb-3 font-semibold">Tu objetivo principal</legend>
        <div className="grid gap-2">
          {goals.map(([value,label],index)=><label key={value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3 hover:border-violet/60">
            <input type="radio" name="goal" value={value} defaultChecked={index===0} required />
            <span>{label}</span>
          </label>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 font-semibold">Tu nivel actual</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {levels.map(([value,label],index)=><label key={value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3 hover:border-violet/60">
            <input type="radio" name="level" value={value} defaultChecked={index===0} required />
            <span>{label}</span>
          </label>)}
        </div>
      </fieldset>
      {error&&<p className="text-sm text-rose-300" role="alert">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-violet px-5 py-3 font-semibold text-void disabled:opacity-50">
        {busy?"Guardando…":"Crear mi ruta"}
      </button>
    </form>
  </section>;
}
