"use client";

import Link from "next/link";
import { useState } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { InfoSection } from "@/components/InfoSection";
import { SectionTitle } from "@/components/SectionTitle";
import { SupportCard } from "@/components/SupportCard";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import {
  SUPPORT_PIX_KEY_PLACEHOLDER,
  projectUseOfFundsMock,
  supportMethodsMock,
  supportReasonsMock,
} from "@/lib/mockData";

export default function ApoiarPage() {
  const track = useTrackEvent();
  const [copied, setCopied] = useState(false);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_PIX_KEY_PLACEHOLDER);
      track(ANALYTICS_EVENTS.PIX_COPY, {
        section: "support",
        source: "pix_button",
        label: "copiar_pix",
      });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="container-page space-y-10 py-10">
      <SectionTitle
        title="Apoie o AcordaBrasil"
        subtitle="Ajude a manter um projeto independente de informação pública, transparência e educação política."
      />

      <InfoSection title="Por que apoiar" subtitle="Seu apoio ajuda a manter o projeto aberto e sustentável.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportReasonsMock.map((reason) => (
            <SupportCard key={reason.title} title={reason.title} description={reason.description} />
          ))}
        </div>
      </InfoSection>

      {/* Área reservada para monetização futura (banner entre seções) */}
      <AdPlaceholder label="Espaço para banner institucional futuro" className="hidden md:block" />

      <InfoSection title="Formas de apoio" subtitle="Opções em modo demonstrativo para futura integração real.">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-[#0f3d2e]">Pix</h3>
            <p className="mt-2 text-sm text-slate-600">Contribua com qualquer valor usando a chave demonstrativa.</p>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Chave Pix: <span className="font-semibold">{SUPPORT_PIX_KEY_PLACEHOLDER}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyPix}
              className="mt-3 rounded-md bg-[#0f3d2e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
            >
              Copiar chave
            </button>

            {copied ? (
              <p className="mt-2 text-xs font-medium text-emerald-700">Chave copiada para a área de transferência.</p>
            ) : null}

            <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
              QR Code placeholder
            </div>
          </article>

          {supportMethodsMock.slice(1).map((method) => (
            <SupportCard key={method.title} title={method.title} description={method.description} />
          ))}
        </div>

        <p className="text-xs text-slate-500">Dados de apoio ainda em modo demonstrativo.</p>
      </InfoSection>

      <InfoSection title="Transparência do projeto" subtitle="Compromisso com prestação de contas e uso responsável dos recursos.">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="space-y-2 text-sm text-slate-700">
            {projectUseOfFundsMock.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </InfoSection>

      <section className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0f3d2e]">Cada apoio ajuda o projeto a continuar</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sua contribuição fortalece uma plataforma independente e acessível para toda a sociedade.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyPix}
            className="rounded-md bg-[#0f3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
          >
            Copiar Pix
          </button>
          <Link
            href="/newsletter"
            onClick={() =>
              track(ANALYTICS_EVENTS.CTA_CLICK, {
                section: "support",
                source: "support_page",
                label: "newsletter",
              })
            }
            className="rounded-md border border-[#0f3d2e] px-4 py-2 text-sm font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
          >
            Ir para newsletter
          </Link>
        </div>
      </section>

      {/* Área reservada para monetização futura (rodapé da página) */}
      <AdPlaceholder label="Espaço para patrocinadores futuros" />
    </main>
  );
}
