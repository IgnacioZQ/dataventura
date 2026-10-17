import { Composition } from "remotion";
import { HeroLoop } from "./HeroLoop";

// 12 s a 30 fps. El último cuadro vuelve al estado inicial, así que el video se repite sin corte.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroLoop"
        component={HeroLoop}
        durationInFrames={360}
        fps={30}
        width={1200}
        height={900}
      />
      {/* Versión 9:16 para Reels y Shorts: la misma escena centrada con más aire arriba y abajo */}
      <Composition
        id="HeroVertical"
        component={HeroLoop}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
