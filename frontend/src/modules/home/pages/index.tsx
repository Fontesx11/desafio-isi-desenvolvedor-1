import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, ChevronRight, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PitchMarkings } from '../components/pitch-markings';
import { FLOW_STEPS } from '../constants/home.constants';

export default function HomePage() {
  const navigate = useNavigate();

  // "ou tecle Enter": mesmo destino do botão Iniciar
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        navigate({ to: '/players' });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 lg:px-10">
      {/* Campo na proporção do Figma (1200 × 700); a partir de 2xl, 1440 × 840 */}
      <div className="relative flex w-full max-w-[1200px] flex-col rounded-3xl border border-zinc-200 px-1 pt-14 pb-8 lg:aspect-[12/7] 2xl:max-w-[1440px] 2xl:pt-16 2xl:pb-10">
        <PitchMarkings />

        <section className="relative mx-auto flex max-w-[780px] flex-col items-center bg-background px-4 pb-10 text-center 2xl:max-w-[940px] 2xl:pb-12">
          <div className="flex items-center gap-5 2xl:gap-6">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground 2xl:size-[68px] 2xl:text-4xl">
              P
            </span>
            <span className="text-3xl font-semibold tracking-tight 2xl:text-4xl">
              Passe
            </span>
          </div>
          <h1 className="mt-14 text-3xl font-semibold tracking-tight text-balance lg:text-[40px] lg:whitespace-nowrap 2xl:mt-16 2xl:text-5xl">
            Gestão da liga, do mercado à classificação
          </h1>
          <p className="mt-5 max-w-[620px] text-zinc-600 2xl:mt-6 2xl:max-w-[740px] 2xl:text-lg">
            Cadastre jogadores, monte os clubes e negocie com contrato de
            fidelidade. Depois, escale os titulares e jogue partidas com placar
            calculado pelos atributos.
          </p>
          <div className="mt-6 flex items-center gap-3 2xl:mt-8 2xl:gap-4">
            <Button
              asChild
              className="h-10 w-[200px] gap-2 2xl:h-12 2xl:w-60 2xl:text-base"
            >
              <Link to="/players">
                Iniciar
                <ArrowRight />
              </Link>
            </Button>
            <span className="hidden text-sm text-zinc-500 sm:inline 2xl:text-base">
              ou tecle
              <kbd className="ml-2 rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-sans text-xs text-zinc-600 2xl:text-sm">
                Enter
              </kbd>
            </span>
          </div>
        </section>

        <ol className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-6 lg:gap-8 2xl:gap-10">
          {FLOW_STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="h-full rounded-xl border border-zinc-200 bg-background p-4 text-left 2xl:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-primary 2xl:size-10">
                    <step.icon className="size-4 2xl:size-5" />
                  </span>
                  <span className="font-mono text-xs text-zinc-500 2xl:text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-4 text-sm font-medium 2xl:mt-5 2xl:text-base">
                  {step.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 2xl:text-sm">
                  {step.description}
                </p>
              </div>
              {index < FLOW_STEPS.length - 1 && (
                <ChevronRight
                  aria-hidden
                  className="absolute top-1/2 -right-6 hidden size-4 -translate-y-1/2 text-zinc-400 lg:block 2xl:-right-7"
                />
              )}
            </li>
          ))}
        </ol>

        <p className="relative mx-auto mt-8 flex w-fit items-center gap-2 bg-background px-2 text-xs text-zinc-500 2xl:mt-10 2xl:text-sm">
          <Clock className="size-4" />
          Liga Fictícia 2026 · Horário de Brasília (UTC−3)
        </p>
      </div>
    </main>
  );
}
