"use client";

import { FormEvent, useEffect, useState } from "react";

type ProgramOption = {
  id: string;
  title: string;
};

type LeadFormProps = {
  defaultProgramId?: string;
  initialProgramId?: string;
  programs: ProgramOption[];
};

type FormFields = {
  fullName: string;
  phone: string;
  email: string;
  programId: string;
  message: string;
};

type SubmitState = {
  kind: "idle" | "submitting" | "success" | "error";
  message: string;
};

function buildInitialFields(initialProgramId = ""): FormFields {
  return {
    fullName: "",
    phone: "",
    email: "",
    programId: initialProgramId,
    message: ""
  };
}

export function LeadForm({
  defaultProgramId,
  initialProgramId,
  programs
}: LeadFormProps) {
  const preferredProgramId = initialProgramId ?? defaultProgramId ?? "";
  const [fields, setFields] = useState<FormFields>(() =>
    buildInitialFields(preferredProgramId)
  );
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: ""
  });

  const updateField = (field: keyof FormFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    setFields((current) => ({
      ...current,
      programId: preferredProgramId
    }));
  }, [preferredProgramId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      fullName: fields.fullName.trim(),
      phone: fields.phone.trim(),
      email: fields.email.trim(),
      message: fields.message.trim(),
      programId: fields.programId
    };

    if (!payload.fullName || !payload.phone || !payload.email) {
      setSubmitState({
        kind: "error",
        message: "Completa nombre, celular y correo."
      });
      return;
    }

    setSubmitState({
      kind: "submitting",
      message: "Enviando solicitud..."
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: payload.fullName,
          phone: payload.phone,
          email: payload.email,
          ...(payload.message ? { message: payload.message } : {}),
          ...(payload.programId ? { programId: payload.programId } : {})
        })
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { message?: string | string[] }
          | null;
        const message = Array.isArray(errorBody?.message)
          ? errorBody.message.join(" ")
          : errorBody?.message;

        throw new Error(message ?? "No se pudo registrar la solicitud.");
      }

      setFields(buildInitialFields(preferredProgramId));
      setSubmitState({
        kind: "success",
        message: "Solicitud registrada. Administracion revisara tus datos."
      });
    } catch (error) {
      setSubmitState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo registrar la solicitud."
      });
    }
  };

  return (
    <form className="leadForm" onSubmit={handleSubmit}>
      <label>
        Nombre completo
        <input
          name="fullName"
          minLength={3}
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Tu nombre"
          required
          value={fields.fullName}
        />
      </label>
      <label>
        Celular
        <input
          name="phone"
          inputMode="tel"
          minLength={6}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="999 999 999"
          required
          value={fields.phone}
        />
      </label>
      <label>
        Correo
        <input
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="correo@ejemplo.com"
          required
          type="email"
          value={fields.email}
        />
      </label>
      {programs.length > 0 ? (
        <label>
          Programa de interes
          <select
            name="programId"
            onChange={(event) => updateField("programId", event.target.value)}
            value={fields.programId}
          >
            <option value="">Por definir</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label>
        Mensaje
        <textarea
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Consulta o horario de interes"
          rows={4}
          value={fields.message}
        />
      </label>
      <button disabled={submitState.kind === "submitting"} type="submit">
        {submitState.kind === "submitting" ? "Enviando..." : "Enviar solicitud"}
      </button>
      {submitState.message ? (
        <p className={`formStatus ${submitState.kind}`} role="status">
          {submitState.message}
        </p>
      ) : null}
    </form>
  );
}
