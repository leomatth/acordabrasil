"use client";

import { useState } from "react";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

type NewsletterFormState = {
  name: string;
  email: string;
  acceptUpdates: boolean;
};

const initialState: NewsletterFormState = {
  name: "",
  email: "",
  acceptUpdates: false,
};

export function NewsletterForm() {
  const track = useTrackEvent();
  const [formState, setFormState] = useState<NewsletterFormState>(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      setError("Digite seu nome para continuar.");
      setSuccess(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formState.email)) {
      setError("Digite um e-mail válido.");
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
    track(ANALYTICS_EVENTS.NEWSLETTER_SIGNUP, {
      section: "newsletter",
      source: "newsletter_form",
      label: formState.acceptUpdates ? "opt_in_updates" : "signup_only",
    });
    setFormState(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">Nome</span>
          <input
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
            placeholder="Seu nome"
          />
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="font-medium">E-mail</span>
          <input
            type="email"
            value={formState.email}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-[#0f3d2e]"
            placeholder="voce@email.com"
          />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={formState.acceptUpdates}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, acceptUpdates: event.target.checked }))
          }
          className="mt-0.5"
        />
        <span>Quero receber novidades e conteúdos do AcordaBrasil.</span>
      </label>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      {success ? (
        <p className="mt-3 text-sm text-emerald-700">
          Inscrição realizada com sucesso! Em breve você receberá as atualizações.
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-4 inline-flex rounded-md bg-[#0f3d2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#14553f]"
      >
        Quero receber
      </button>
    </form>
  );
}
