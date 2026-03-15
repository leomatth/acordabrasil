# AcordaBrasil

Plataforma cívica em Next.js 14 + TypeScript + TailwindCSS para visualização de gastos públicos, impostos, PECs, eleições e políticos.

## Executar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Modo de dados (mock / hybrid / live)

O projeto suporta integração gradual com fontes públicas reais sem remover os mocks.

Copie `.env.example` para `.env.local` e ajuste:

```bash
NEXT_PUBLIC_DATA_MODE=mock
NEXT_PUBLIC_TRANSPARENCY_API_URL=https://api.exemplo.gov.br
CAMARA_API_BASE_URL=https://dadosabertos.camara.leg.br/api/v2
```

Regras de execução:

- `mock`: usa somente dados simulados.
- `hybrid`: tenta API pública e faz fallback para mock se houver falha.
- `live`: tenta API pública, registra erro tratado e mantém a UI estável com fallback controlado.

## Analytics e tracking de eventos

Arquitetura desacoplada em camadas:

- `lib/analytics/events.ts`: catálogo padronizado de eventos.
- `lib/analytics/analytics.ts`: função central `trackEvent(eventName, payload)`.
- `lib/analytics/providers.ts`: adapters para providers (debug/placeholder real).
- `components/AnalyticsProvider.tsx`: page view automático no App Router + painel debug.
- `hooks/useTrackEvent.ts`: hook reutilizável para componentes.

Configuração por ambiente:

```bash
NEXT_PUBLIC_ANALYTICS_MODE=off
```

Modos disponíveis:

- `off`: desativa tracking.
- `debug`: registra eventos no console e mostra painel de sessão em desenvolvimento.
- `enabled`: mantém trilha ativa com adapter placeholder pronto para integração futura (GA, GTM, Plausible, PostHog, Umami).

Boas práticas aplicadas:

- Não coletar dados pessoais sensíveis.
- Priorizar eventos de navegação e produto.
- UI sem acoplamento direto com ferramenta específica de analytics.

## Arquitetura de dados

Camadas implementadas:

- `lib/services/*`: orquestram modo de dados, fetch, cache e fallback.
- `lib/adapters/*`: convertem payload externo para modelo interno do AcordaBrasil.
- `lib/utils/fetchWithFallback.ts`: utilitário central para API + fallback de mock.
- `types/*`: tipagem interna padronizada por domínio.

Princípios:

- Componentes React não consomem API externa diretamente.
- UI usa modelos internos padronizados.
- Falhas externas não derrubam as páginas.

## Estratégia de migração gradual

Ordem planejada no código:

1. Gastos públicos
2. Impostos / arrecadação
3. PECs e projetos de lei
4. Eleições e pesquisas
5. Políticos

## Build e qualidade

```bash
npm run lint
npm run build
```
