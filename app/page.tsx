import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { BrazilMap } from "@/components/BrazilMap";
import { Counter } from "@/components/Counter";
import { DataDebugPanel } from "@/components/DataDebugPanel";
import { DataOriginBadge } from "@/components/DataOriginBadge";
import { LiveSpendCard } from "@/components/LiveSpendCard";
import { PecCard } from "@/components/PecCard";
import { SectionTitle } from "@/components/SectionTitle";
import { StatCard } from "@/components/StatCard";
import { TaxChart } from "@/components/TaxChart";
import { TrackedLink } from "@/components/TrackedLink";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { HERO_CONTENT, LIVE_SPEND_CONFIG } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatCurrency";
import { pecsMock } from "@/lib/mockData";
import {
  getAllStatesSpending,
  getPublicSpendingOverview,
} from "@/lib/services/publicSpendingService";
import { getTaxRealtimeMetrics } from "@/lib/services/taxesService";
import { createPageMetadata } from "@/lib/seo";
import { CalendarClock, Landmark, Users } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Gastos públicos do Brasil em dados simples | AcordaBrasil",
  description:
    "Veja gastos públicos, impostos, PECs e dados políticos explicados de forma simples.",
  path: "/",
});

export default async function Home() {
  const [spendingOverviewResult, stateSpendingResult, taxRealtimeResult] = await Promise.all([
    getPublicSpendingOverview(),
    getAllStatesSpending(),
    getTaxRealtimeMetrics(),
  ]);

  const spendingOverview = spendingOverviewResult.data;

  return (
    <main className="container-page space-y-14 py-10">
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0f3d2e] sm:text-4xl xl:text-5xl">
            {HERO_CONTENT.title}
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            {HERO_CONTENT.subtitle}
          </p>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[1.45fr_1fr]">
          <div className="order-2 xl:order-1">
            <BrazilMap
              statesData={stateSpendingResult.data}
              dataOrigin={{
                source: stateSpendingResult.source,
                mode: stateSpendingResult.mode,
                lastUpdated: stateSpendingResult.lastUpdated,
                errorMessage: stateSpendingResult.errorMessage,
              }}
            />
          </div>

          <div className="order-1 space-y-4 xl:order-2">
            <DataOriginBadge
              source={spendingOverviewResult.source}
              mode={spendingOverviewResult.mode}
              lastUpdated={spendingOverviewResult.lastUpdated}
              errorMessage={spendingOverviewResult.errorMessage}
            />

            <Counter
              label={HERO_CONTENT.counterLabel}
              value={spendingOverview.totalPublicSpending}
              variant="hero"
            />

            <LiveSpendCard
              title={HERO_CONTENT.viralTitle}
              caption={HERO_CONTENT.viralCaption}
              config={{
                ...LIVE_SPEND_CONFIG,
                amountPerSecond: taxRealtimeResult.data.ratePerSecond,
              }}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                title="Gasto hoje"
                value={formatCurrency(spendingOverview.spendingToday)}
                icon={CalendarClock}
              />
              <StatCard
                title="Gasto no mês"
                value={formatCurrency(spendingOverview.spendingMonth)}
                icon={Landmark}
              />
              <StatCard
                title="Gasto por cidadão"
                value={`${formatCurrency(spendingOverview.spendingPerCitizen)} / ano`}
                icon={Users}
              />
            </div>

            <DataDebugPanel
              mode={spendingOverviewResult.mode}
              source={spendingOverviewResult.source}
              lastUpdated={spendingOverviewResult.lastUpdated}
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle
          title="PECs e Projetos de Lei em destaque"
          subtitle="Projetos legislativos recentes com impacto orçamentário e atualização contínua."
        />

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {pecsMock.slice(0, 6).map((pec) => (
            <PecCard key={pec.id} pec={pec} variant="highlight" buttonLabel="Ver detalhes" />
          ))}
        </div>

        <div>
          <TrackedLink
            href="/pecs"
            eventName={ANALYTICS_EVENTS.CTA_CLICK}
            eventPayload={{ section: "home_pecs", source: "home", label: "Ver todos os projetos" }}
            className="inline-flex items-center rounded-md border border-[#0f3d2e] px-4 py-2 text-sm font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
          >
            Ver todos os projetos
          </TrackedLink>
        </div>
      </section>

      {/* Área reservada para monetização futura (banner entre seções da homepage) */}
      <AdPlaceholder label="Espaço para anúncio futuro" className="hidden md:block" />

      <section className="space-y-6">
        <SectionTitle
          title="Arrecadação de Impostos"
          subtitle="Resumo do dia e distribuição por tipo de imposto."
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <Counter
            label="Impostos arrecadados hoje"
            value={taxRealtimeResult.data.taxesCollectedToday}
          />
          <TaxChart />
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0f3d2e]">Apoie o AcordaBrasil</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajude a manter este projeto independente e acessível para todos.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <TrackedLink
            href="/apoiar"
            eventName={ANALYTICS_EVENTS.SUPPORT_CLICK}
            eventPayload={{ section: "home_support", source: "home", label: "Apoiar o projeto" }}
            className="rounded-md bg-[#0f3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
          >
            Apoiar o projeto
          </TrackedLink>
          <TrackedLink
            href="/newsletter"
            eventName={ANALYTICS_EVENTS.CTA_CLICK}
            eventPayload={{ section: "home_support", source: "home", label: "Receber newsletter" }}
            className="rounded-md border border-[#0f3d2e] px-4 py-2 text-sm font-semibold text-[#0f3d2e] transition hover:bg-[#0f3d2e] hover:text-white"
          >
            Receber newsletter
          </TrackedLink>
        </div>
      </section>

      {/* Área reservada para monetização futura (final de listagens/conteúdo) */}
      <AdPlaceholder label="Espaço final para patrocinadores futuros" />

      <section id="sobre" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          title="Sobre o AcordaBrasil"
          subtitle="MVP preparado para futura escala com contador em tempo real, simulação de impostos e novos painéis eleitorais."
        />
      </section>
    </main>
  );
}
