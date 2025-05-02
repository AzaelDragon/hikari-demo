// @ts-ignore
import 'react-color-palette/css';

import 'github-markdown-css/github-markdown-dark.css';
import { createFileRoute } from '@tanstack/react-router';
import { type DockItem, FloatingDock } from '@/components/floating-dock.tsx';
import { MorphGradientCanvas, type MorphGradientInitCallback } from '@dragonspark/hikari-react';
import { IoColorFilterSharp, IoDocument } from 'react-icons/io5';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PiWaveSineDuotone } from 'react-icons/pi';
import { MdScreenRotation, MdTransform } from 'react-icons/md';
import { HiMiniPlayPause } from 'react-icons/hi2';
import { GiAmplitude } from 'react-icons/gi';
import { ModalBody, ModalContent, ModalContext } from '@/components/animated-modal.tsx';
import { ColorPicker, type IColor, useColor, ColorService } from 'react-color-palette';
import { cn } from '@/lib/utils.ts';
import { MorphGradient } from '@dragonspark/hikari-effects';
import { LabelInputContainer } from '@/components/label-input-container.tsx';
import { Label } from '@/components/label.tsx';
import { Input } from '@/components/input.tsx';
import { RiSeedlingLine } from 'react-icons/ri';
import { TbAxisX, TbAxisY, TbDelta, TbZoomInArea } from 'react-icons/tb';
import { AnimatePresence, motion } from 'motion/react';
import { LuBlocks, LuScale3D } from 'react-icons/lu';
import { markdown as GradientDocs } from '../docs/morph-gradient.md';
import { MdRenderer } from '@/components/md-renderer.tsx';
import { BiReset } from 'react-icons/bi';
import { RxShadowInner } from 'react-icons/rx';

export const Route = createFileRoute('/morph-gradient')({
  component: RouteComponent
});

const DEFAULTS = {
  BASE_COLOR: '#09235C',
  WAVE1_COLOR: '#57B7EA',
  WAVE2_COLOR: '#408A79',
  WAVE3_COLOR: '#408A79',
  AMPLITUDE: 320,
  SEED: 5,
  FREQ_X: 14e-5,
  FREQ_Y: 29e-5,
  FREQ_DELTA: 1e-5,
  ZOOM: 1,
  ROTATION: 0,
  DENSITY: [0.06, 0.16],
  WIREFRAME: false
};

function RouteComponent() {
  useEffect(() => {
    document.title = "Hikari GL - Morph Gradient";
  }, []);

  // Gradient conf
  const gradientRef = useRef<MorphGradient>(null);
  const onInitGradient: MorphGradientInitCallback = (gradient) => (gradientRef.current = gradient);

  // Color properties
  const [colorOpen, setColorOpen] = useState<boolean>(false);
  const [baseColor, setBaseColor] = useColor(DEFAULTS.BASE_COLOR);
  const [waveColor1, setWaveColor1] = useColor(DEFAULTS.WAVE1_COLOR);
  const [waveColor2, setWaveColor2] = useColor(DEFAULTS.WAVE2_COLOR);
  const [waveColor3, setWaveColor3] = useColor(DEFAULTS.WAVE3_COLOR);

  // Wave properties
  const [waveOpen, setWaveOpen] = useState<boolean>(false);
  const [amplitude, setAmplitude] = useState<number>(DEFAULTS.AMPLITUDE);
  const [seed, setSeed] = useState<number>(DEFAULTS.SEED);
  const [freqX, setFreqX] = useState<number>(DEFAULTS.FREQ_X);
  const [freqY, setFreqY] = useState<number>(DEFAULTS.FREQ_Y);
  const [freqDelta, setFreqDelta] = useState<number>(DEFAULTS.FREQ_DELTA);

  // Transform properties
  const [transformOpen, setTransformOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(DEFAULTS.ZOOM);
  const [rotation, setRotation] = useState<number>(DEFAULTS.ROTATION);
  const [density, setDensity] = useState<number[]>(DEFAULTS.DENSITY);

  // Misc properties
  const [playGradient, setPlayGradient] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [addShadow, setAddShadow] = useState<boolean>(false);

  // Viewport
  const [viewDocs, setViewDocs] = useState<boolean>(false);

  const [snippetOpen, setSnippetOpen] = useState<boolean>(false);

  const resetDefaults = () => {
    setBaseColor(ColorService.convert("hex", DEFAULTS.BASE_COLOR));
    setWaveColor1(ColorService.convert("hex", DEFAULTS.WAVE1_COLOR));
    setWaveColor2(ColorService.convert("hex", DEFAULTS.WAVE2_COLOR));
    setWaveColor3(ColorService.convert("hex", DEFAULTS.WAVE3_COLOR));
    setAmplitude(DEFAULTS.AMPLITUDE);
    setSeed(DEFAULTS.SEED);
    setFreqX(DEFAULTS.FREQ_X);
    setFreqY(DEFAULTS.FREQ_Y);
    setFreqDelta(DEFAULTS.FREQ_DELTA);
    setZoom(DEFAULTS.ZOOM);
    setRotation(DEFAULTS.ROTATION);
    setDensity(DEFAULTS.DENSITY);
    setShowWireframe(DEFAULTS.WIREFRAME);
  };

  const dockItems: DockItem[] = [
    {
      title: 'Colors',
      icon: <IoColorFilterSharp className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setColorOpen(true)
    },
    {
      title: 'Wave Parameters',
      icon: <PiWaveSineDuotone className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setWaveOpen(true)
    },
    {
      title: 'Transform Parameters',
      icon: <MdTransform className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setTransformOpen(true)
    },
    {
      title: 'Play/Stop',
      icon: <HiMiniPlayPause className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setPlayGradient((p) => !p)
    },
    {
      title: 'Toggle Wireframe',
      icon: <LuScale3D className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setShowWireframe((w) => !w)
    },
    {
      title: 'Toggle Shadow',
      icon: <RxShadowInner className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setAddShadow((w) => !w)
    },
    {
      title: 'Copy Code',
      icon: <LuBlocks className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setSnippetOpen((s) => !s)
    },
    {
      title: 'View Docs',
      icon: <IoDocument className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => setViewDocs((d) => !d)
    },
    {
      title: 'Reset defaults',
      icon: <BiReset className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => resetDefaults()
    }
  ];

  const [selectedColor, setSelectedColor] = useState<number>(0);
  const currentColor = useMemo(() => {
    switch (selectedColor) {
      case 1:
        return { color: waveColor1, onChange: setWaveColor1 };
      case 2:
        return { color: waveColor2, onChange: setWaveColor2 };
      case 3:
        return { color: waveColor3, onChange: setWaveColor3 };
      default:
        return { color: baseColor, onChange: setBaseColor };
    }
  }, [selectedColor, waveColor1, waveColor2, waveColor3, baseColor]);

  const ActiveColorSelector = ({
    id,
    color,
    name
  }: {
    id: number;
    color: IColor;
    name: string;
  }) => {
    return (
      <div
        className={cn(
          'transition-all ease-in-out w-20 h-20 rounded-xl opacity-100 cursor-pointer overflow-hidden',
          selectedColor === id && 'ring-4 ring-stone-700 ring-offset-6 ring-offset-stone-900'
        )}
        style={{ backgroundColor: color.hex }}
        onClick={() => setSelectedColor(id)}
      >
        <div className="transition-opacity duration-400 w-full h-full opacity-0 hover:opacity-75 bg-stone-800 text-white flex align-bottom p-2 font-bold text-sm">
          {name}
        </div>
      </div>
    );
  };

  const waveCoalescence = useMemo(
    () => [waveColor1.hex, waveColor2.hex, waveColor3.hex],
    [waveColor1, waveColor2, waveColor3]
  );

  useEffect(() => {
    if (!gradientRef.current) return;

    if (playGradient) {
      gradientRef.current.play();
    } else {
      gradientRef.current.pause();
    }
  }, [gradientRef, playGradient]);

  // Snippet Gen
  const builtSnippet = useMemo(() => {
    let codeSnippet = '<MorphGradientCanvas';

    if (baseColor.hex !== DEFAULTS.BASE_COLOR) codeSnippet += `\n  baseColor={'${baseColor.hex}'}`;

    if (
      waveColor1.hex !== DEFAULTS.WAVE1_COLOR ||
      waveColor2.hex !== DEFAULTS.WAVE2_COLOR ||
      waveColor3.hex !== DEFAULTS.WAVE3_COLOR
    )
      codeSnippet += `\n  waveColors={['${waveColor1.hex}', '${waveColor2.hex}', '${waveColor3.hex}']}`;

    if (density[0] !== DEFAULTS.DENSITY[0] || density[1] !== DEFAULTS.DENSITY[1])
      codeSnippet += `\n  density={[${density[0]}, ${density[1]}]}`;

    if (zoom !== DEFAULTS.ZOOM) codeSnippet += `\n  zoom={${zoom}}`;

    if (rotation !== DEFAULTS.ROTATION) codeSnippet += `\n  rotation={${rotation}}`;

    if (amplitude !== DEFAULTS.AMPLITUDE) codeSnippet += `\n  amplitude={${amplitude}}`;

    if (seed !== DEFAULTS.SEED) codeSnippet += `\n  seed={${seed}}`;

    if (freqX !== DEFAULTS.FREQ_X) codeSnippet += `\n  freqX={${freqX}}`;

    if (freqY !== DEFAULTS.FREQ_Y) codeSnippet += `\n  freqY={${freqY}}`;

    if (freqDelta !== DEFAULTS.FREQ_DELTA) codeSnippet += `\n  freqDelta={${freqDelta}}`;

    if (showWireframe !== DEFAULTS.WIREFRAME) codeSnippet += `\n  wireframe={${showWireframe}}`;

    codeSnippet += ' />';

    return `\`\`\`tsx\n${codeSnippet}\n\`\`\``;
  }, [
    baseColor,
    waveColor1,
    waveColor2,
    waveColor3,
    amplitude,
    seed,
    freqX,
    freqY,
    freqDelta,
    zoom,
    rotation,
    density,
    showWireframe
  ]);

  return (
    <>
      <ModalContext.Provider value={{ open: colorOpen, setOpen: setColorOpen }}>
        <ModalBody>
          <ModalContent className="mt-2">
            <div className="text-2xl font-semibold text-neutral-300 flex flex-row align-middle content-center mb-4 gap-x-2">
              <IoColorFilterSharp size={32} />
              <span>Color Customization</span>
            </div>
            <div className="flex flex-row mt-4 mb-12 gap-x-8">
              <ActiveColorSelector color={baseColor} id={0} name={'Base'} />
              <ActiveColorSelector color={waveColor1} id={1} name={'Wave 1'} />
              <ActiveColorSelector color={waveColor2} id={2} name={'Wave 2'} />
              <ActiveColorSelector color={waveColor3} id={3} name={'Wave 3'} />
            </div>
            <div className="bg-stone-900 opacity-100">
              <ColorPicker {...currentColor} />
            </div>
          </ModalContent>
        </ModalBody>
      </ModalContext.Provider>

      <ModalContext.Provider value={{ open: waveOpen, setOpen: setWaveOpen }}>
        <ModalBody>
          <ModalContent className="mt-2">
            <div className="text-2xl font-semibold text-neutral-300 flex flex-row align-middle content-center mb-4 gap-x-2">
              <PiWaveSineDuotone size={32} />
              <span>Wave Parameters</span>
            </div>
            <div className="flex flex-col mt-4 mb-12 gap-x-8">
              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full">
                <LabelInputContainer>
                  <Label htmlFor="amplitude" className="flex flex-row gap-x-2">
                    <GiAmplitude /> Amplitude
                  </Label>
                  <Input
                    id="amplitude"
                    placeholder="Amplitude (#)"
                    type="number"
                    value={amplitude}
                    onChange={(e) => setAmplitude(parseFloat(e.target?.value ?? DEFAULTS.AMPLITUDE))}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="seed" className="flex flex-row gap-x-2">
                    <RiSeedlingLine /> Seed
                  </Label>
                  <Input
                    id="seed"
                    placeholder="Seed (#)"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseFloat(e.target?.value ?? DEFAULTS.SEED))}
                  />
                </LabelInputContainer>
              </div>
              <div className="mt-2 mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full">
                <LabelInputContainer>
                  <Label htmlFor="freqX" className="flex flex-row gap-x-2">
                    <TbAxisX /> Freq. in X axis
                  </Label>
                  <Input
                    id="freqX"
                    placeholder="Freq. in X axis (#)"
                    type="number"
                    value={freqX}
                    onChange={(e) => setFreqX(parseFloat(e.target?.value ?? DEFAULTS.FREQ_X))}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="freqY" className="flex flex-row gap-x-2">
                    <TbAxisY /> Freq. in Y axis
                  </Label>
                  <Input
                    id="freqY"
                    placeholder="Freq. in Y axis (#)"
                    type="number"
                    value={freqY}
                    onChange={(e) => setFreqY(parseFloat(e.target?.value ?? DEFAULTS.FREQ_Y))}
                  />
                </LabelInputContainer>
              </div>
              <div className="mt-2 mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full">
                <LabelInputContainer>
                  <Label htmlFor="seed" className="flex flex-row gap-x-2">
                    <TbDelta /> Frequency Delta
                  </Label>
                  <Input
                    id="freqDelta"
                    placeholder="Freq. Delta (#)"
                    type="number"
                    value={freqDelta}
                    onChange={(e) => setFreqDelta(parseFloat(e.target?.value ?? DEFAULTS.FREQ_DELTA))}
                  />
                </LabelInputContainer>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </ModalContext.Provider>

      <ModalContext.Provider value={{ open: transformOpen, setOpen: setTransformOpen }}>
        <ModalBody>
          <ModalContent className="mt-2">
            <div className="text-2xl font-semibold text-neutral-300 flex flex-row align-middle content-center mb-4 gap-x-2">
              <MdTransform size={32} />
              <span>Transform Parameters</span>
            </div>
            <div className="flex flex-col mt-4 mb-12 gap-x-8">
              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full">
                <LabelInputContainer>
                  <Label htmlFor="zoom" className="flex flex-row gap-x-2">
                    <TbZoomInArea /> Zoom Scale
                  </Label>
                  <Input
                    id="zoom"
                    placeholder="Zoom Scale (#)"
                    type="number"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target?.value ?? DEFAULTS.ZOOM))}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="seed" className="flex flex-row gap-x-2">
                    <MdScreenRotation /> Orthographic Rotation
                  </Label>
                  <Input
                    id="rotation"
                    placeholder="Orthographic Rotation (#)"
                    type="number"
                    value={rotation}
                    onChange={(e) => setRotation(parseFloat(e.target?.value ?? DEFAULTS.ROTATION))}
                  />
                </LabelInputContainer>
              </div>
              <div className="mt-2 mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full">
                <LabelInputContainer>
                  <Label htmlFor="densityX" className="flex flex-row gap-x-2">
                    <TbAxisX /> Mesh Density in X axis
                  </Label>
                  <Input
                    id="densityX"
                    placeholder="Mesh Density in X axis (#)"
                    type="number"
                    value={freqX}
                    onChange={(e) => setDensity([parseFloat(e.target?.value ?? DEFAULTS.DENSITY[0]), density[1]])}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="densityY" className="flex flex-row gap-x-2">
                    <TbAxisY /> Mesh Density in Y axis
                  </Label>
                  <Input
                    id="densityY"
                    placeholder="Mesh Density in Y axis (#)"
                    type="number"
                    value={freqY}
                    onChange={(e) => setDensity([density[0], parseFloat(e.target?.value ?? DEFAULTS.DENSITY[1])])}
                  />
                </LabelInputContainer>
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </ModalContext.Provider>

      <ModalContext.Provider value={{ open: snippetOpen, setOpen: setSnippetOpen }}>
        <ModalBody>
          <ModalContent className="mt-2">
            <div className="text-2xl font-semibold text-neutral-300 flex flex-row align-middle content-center mb-4 gap-x-2">
              <LuBlocks size={32} />
              <span>Code Snippet</span>
            </div>
            <div className="flex flex-col mt-4 mb-12 gap-x-8">
              <div className="markdown-body">
                <MdRenderer markdown={builtSnippet} />
              </div>
            </div>
          </ModalContent>
        </ModalBody>
      </ModalContext.Provider>

      <div className="relative w-full h-full">
        <AnimatePresence mode="popLayout">
          {viewDocs ? (
            <motion.div
              key="gradient-docs"
              className="w-full max-h-full overflow-y-scroll flex flex-row align-middle justify-center bg-[#0d1117]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div></div>
              <div className="markdown-body block h-fit">
                <MdRenderer markdown={GradientDocs} />
                <div className="min-h-[100px]">&nbsp;</div>
              </div>
              <div></div>
            </motion.div>
          ) : (
            <motion.div
              key="gradient-canvas"
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <MorphGradientCanvas
                baseColor={baseColor.hex}
                waveColors={waveCoalescence}
                wireframe={showWireframe}
                onInit={onInitGradient}
                amplitude={amplitude}
                seed={seed}
                freqX={freqX}
                freqY={freqY}
                freqDelta={freqDelta}
                zoom={zoom}
                rotation={rotation}
                density={density as [number, number]}
                darkenTop={addShadow}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingDock
          items={dockItems}
          desktopClassName="z-[999] absolute bottom-5 left-5"
          mobileClassName="z-[999] absolute bottom-5 left-5"
        />
      </div>
    </>
  );
}
