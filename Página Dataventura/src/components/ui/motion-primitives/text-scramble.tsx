'use client';
// Adaptado de Motion Primitives: el componente animado se crea una sola vez (antes se recreaba en cada paso y el
// elemento se desmontaba ~30 veces), el intervalo se limpia al desmontar, con «reducir movimiento» no se
// desordena, y los lectores de pantalla leen siempre el texto final (las letras al azar van ocultas).
import { type JSX, useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionProps, useReducedMotion } from 'motion/react';

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionComponent = useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component]
  );
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalo = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const reducir = useReducedMotion();
  const text = children;

  useEffect(() => () => clearInterval(intervalo.current), []);

  const scramble = () => {
    if (isAnimating || reducir) return;
    setIsAnimating(true);

    const steps = duration / speed;
    let step = 0;

    clearInterval(intervalo.current);
    intervalo.current = setInterval(() => {
      let scrambled = '';
      const progress = step / steps;

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(intervalo.current);
        setDisplayText(text);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    }, speed * 1000);
  };

  useEffect(() => {
    if (!trigger) return;

    scramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <MotionComponent className={className} {...props}>
      <span aria-hidden>{displayText}</span>
      <span className="sr-only">{text}</span>
    </MotionComponent>
  );
}
