"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { DataOriginBadge } from "@/components/DataOriginBadge";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  DEFAULT_STATE_CODE,
  brazilStatesData,
  getStateCodeFromMapName,
} from "@/lib/mockData";
import {
  getFirstStateByRange,
  matchesSpendingRange,
  type SpendingRange,
} from "@/lib/spendingRange";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import type { DataMode, DataSource } from "@/types/dataSource";
import type { StateSpending } from "@/types/publicSpending";
import type { StateCode } from "@/types/state";

const BRAZIL_GEO_URL =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const COLOR_SELECTED = "#0f3d2e";
const COLOR_HOVER = "#ffcc00";
const COLOR_STROKE = "#ffffff";
const COLOR_DIMMED = "#dbe5e1";

const filterOptions: Array<{ label: string; value: SpendingRange }> = [
  { label: "Todos", value: "all" },
  { label: "Alto gasto", value: "high" },
  { label: "Médio gasto", value: "medium" },
  { label: "Baixo gasto", value: "low" },
];

type TooltipData = {
  x: number;
  y: number;
  state: StateSpending;
};

type BrazilMapProps = {
  statesData?: Record<StateCode, StateSpending>;
  dataOrigin?: {
    source: DataSource;
    mode: DataMode;
    lastUpdated: string;
    errorMessage?: string;
  };
};

type GeographyLike = {
  properties: {
    name?: string;
  };
};

function lerp(value: number, start: number, end: number): number {
  return Math.round(start + value * (end - start));
}

function getHeatColor(gastoAnual: number, min: number, max: number): string {
  const ratio = max === min ? 0.5 : (gastoAnual - min) / (max - min);

  const from = { r: 127, g: 169, b: 151 };
  const to = { r: 15, g: 61, b: 46 };

  return `rgb(${lerp(ratio, from.r, to.r)}, ${lerp(ratio, from.g, to.g)}, ${lerp(ratio, from.b, to.b)})`;
}

function MapTooltip({ tooltip }: { tooltip: TooltipData | null }) {
  if (!tooltip) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed z-50 w-[230px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl"
      style={{ left: tooltip.x + 16, top: tooltip.y + 16 }}
      role="status"
      aria-live="polite"
    >
      <p className="font-semibold text-[#ffcc00]">{tooltip.state.nome}</p>
      <p className="mt-1">Anual: {formatCurrency(tooltip.state.gastoAnual)}</p>
      <p>Por habitante: {formatCurrency(tooltip.state.gastoPorHabitante)} / ano</p>
    </div>
  );
}

function DetailsPanel({ stateData }: { stateData: StateSpending }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[#0f3d2e]">{stateData.nome}</h3>
        <span className="rounded-full bg-[#0f3d2e] px-2.5 py-1 text-xs font-semibold text-white">
          {stateData.sigla}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm text-slate-700">
        <div>
          <dt className="font-medium text-slate-500">Gasto anual</dt>
          <dd className="font-semibold">{formatCurrency(stateData.gastoAnual)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Gasto mensal</dt>
          <dd className="font-semibold">{formatCurrency(stateData.gastoMensal)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Gasto por habitante</dt>
          <dd className="font-semibold">
            {formatCurrency(stateData.gastoPorHabitante)} / ano
          </dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3">
        <p className="text-sm font-medium text-slate-600">Principais áreas de gasto</p>

        {stateData.principaisAreas.map((area) => (
          <div key={`${stateData.sigla}-${area.nome}`} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{area.nome}</span>
              <span className="font-semibold text-[#0f3d2e]">{area.percentual}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#0f3d2e] transition-all duration-300"
                style={{ width: `${area.percentual}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function BrazilMap({
  statesData = brazilStatesData,
  dataOrigin,
}: BrazilMapProps) {
  const track = useTrackEvent();
  const [selectedStateCode, setSelectedStateCode] = useState<StateCode>(
    DEFAULT_STATE_CODE,
  );
  const [hoveredStateCode, setHoveredStateCode] = useState<StateCode | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [activeRange, setActiveRange] = useState<SpendingRange>("all");

  const selectedStateData = useMemo(() => {
    const selected = statesData[selectedStateCode];

    if (selected) {
      return selected;
    }

    const fallbackState = statesData[DEFAULT_STATE_CODE];

    if (fallbackState) {
      return fallbackState;
    }

    return Object.values(statesData)[0] ?? brazilStatesData[DEFAULT_STATE_CODE];
  }, [selectedStateCode, statesData]);

  const spendingBounds = useMemo(() => {
    const values = Object.values(statesData).map((state) => state.gastoAnual);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [statesData]);

  useEffect(() => {
    if (activeRange === "all") {
      return;
    }

    const selectedMatchesRange = matchesSpendingRange(
      selectedStateData.gastoAnual,
      spendingBounds,
      activeRange,
    );

    if (!selectedMatchesRange) {
      setSelectedStateCode(
        getFirstStateByRange(activeRange, spendingBounds, statesData, DEFAULT_STATE_CODE),
      );
    }
  }, [activeRange, selectedStateData.gastoAnual, spendingBounds, statesData]);

  const updateTooltipPosition = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    state: StateSpending,
  ) => {
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      state,
    });
  };

  const handleStateHover = (
    event: React.MouseEvent<SVGPathElement, MouseEvent>,
    geo: GeographyLike,
  ) => {
    const mapName = geo.properties.name;

    if (!mapName) {
      return;
    }

    const code = getStateCodeFromMapName(mapName);

    if (!code) {
      return;
    }

    const state = statesData[code];

    if (!state) {
      return;
    }

    setHoveredStateCode(code);
    updateTooltipPosition(event, state);
  };

  const handleStateLeave = () => {
    setHoveredStateCode(null);
    setTooltip(null);
  };

  const handleStateClick = (geo: GeographyLike) => {
    const mapName = geo.properties.name;

    if (!mapName) {
      return;
    }

    const code = getStateCodeFromMapName(mapName);

    if (code) {
      setSelectedStateCode(code);
      track(ANALYTICS_EVENTS.STATE_CLICK, {
        section: "home_map",
        source: "map",
        label: code,
      });
    }
  };

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-slate-600">
        Clique em um estado para ver os gastos públicos.
      </p>

      {dataOrigin ? (
        <DataOriginBadge
          source={dataOrigin.source}
          mode={dataOrigin.mode}
          lastUpdated={dataOrigin.lastUpdated}
          errorMessage={dataOrigin.errorMessage}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => {
          const isActive = activeRange === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setActiveRange(option.value);
                track(ANALYTICS_EVENTS.STATE_FILTER_CHANGE, {
                  section: "home_map",
                  source: "map_filter",
                  label: option.label,
                  value: option.value,
                });
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                isActive
                  ? "border-[#0f3d2e] bg-[#0f3d2e] text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:border-[#0f3d2e] hover:text-[#0f3d2e]"
              }`}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 760, center: [-52, -14] }}
            className="h-[360px] w-full sm:h-[420px]"
          >
            <ZoomableGroup>
              <Geographies geography={BRAZIL_GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const mapName = geo.properties.name ?? "";
                    const code = mapName ? getStateCodeFromMapName(mapName) : undefined;
                    const stateData = code ? statesData[code] : null;

                    const isSelected = code === selectedStateCode;
                    const isHovered = code !== undefined && code === hoveredStateCode;
                    const isInActiveRange = stateData
                      ? matchesSpendingRange(
                          stateData.gastoAnual,
                          spendingBounds,
                          activeRange,
                        )
                      : false;

                    const fillColor = !isInActiveRange
                      ? COLOR_DIMMED
                      : isSelected
                      ? COLOR_SELECTED
                      : isHovered
                        ? COLOR_HOVER
                        : stateData
                          ? getHeatColor(
                              stateData.gastoAnual,
                              spendingBounds.min,
                              spendingBounds.max,
                            )
                          : "#97b8ab";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(event) => handleStateHover(event, geo)}
                        onMouseMove={(event) => {
                          if (stateData) {
                            updateTooltipPosition(event, stateData);
                          }
                        }}
                        onMouseLeave={handleStateLeave}
                        onClick={() => handleStateClick(geo)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleStateClick(geo);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={stateData ? `Selecionar ${stateData.nome}` : "Selecionar estado"}
                        style={{
                          default: {
                            fill: fillColor,
                            stroke: COLOR_STROKE,
                            strokeWidth: isSelected ? 1 : 0.7,
                            opacity: isInActiveRange ? 1 : 0.45,
                            outline: "none",
                            transition: "fill 180ms ease, stroke-width 180ms ease",
                            cursor: "pointer",
                          },
                          hover: {
                            fill: isInActiveRange ? COLOR_HOVER : COLOR_DIMMED,
                            stroke: COLOR_STROKE,
                            strokeWidth: 1,
                            opacity: isInActiveRange ? 1 : 0.45,
                            outline: "none",
                            transition: "fill 180ms ease, stroke-width 180ms ease",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: isInActiveRange ? "#c69f00" : COLOR_DIMMED,
                            stroke: COLOR_STROKE,
                            strokeWidth: 1,
                            opacity: isInActiveRange ? 1 : 0.45,
                            outline: "none",
                            transition: "fill 180ms ease, stroke-width 180ms ease",
                            cursor: "pointer",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#9ec0b4]" /> Menor gasto
            <span className="inline-flex h-2 w-2 rounded-full bg-[#0f3d2e]" /> Maior gasto
          </div>
        </div>

        {selectedStateData ? <DetailsPanel stateData={selectedStateData} /> : null}
      </div>

      <MapTooltip tooltip={tooltip} />
    </section>
  );
}
