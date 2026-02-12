"use client";

import { useEffect, useMemo, useState } from "react";

type ValidationError = {
  line: number;
  message: string;
};

type HistoryEntry = {
  version: number;
  timestamp: string;
  updatedBy: string;
};

export default function ConfigEditorPage() {
  const [yaml, setYaml] = useState("");
  const [baselineYaml, setBaselineYaml] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [status, setStatus] = useState("Loading...");
  const [isBusy, setIsBusy] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const hasChanges = useMemo(() => yaml !== baselineYaml, [yaml, baselineYaml]);

  async function loadConfig() {
    setIsBusy(true);
    setStatus("Loading current config...");

    const [configRes, historyRes] = await Promise.all([
      fetch("/api/config"),
      fetch("/api/config/history"),
    ]);

    const configJson = (await configRes.json()) as { yaml: string; version: number };
    const historyJson = (await historyRes.json()) as { history: HistoryEntry[] };

    setYaml(configJson.yaml);
    setBaselineYaml(configJson.yaml);
    setHistory(historyJson.history ?? []);
    setErrors([]);
    setStatus(`Loaded version ${configJson.version}.`);
    setIsBusy(false);
  }

  useEffect(() => {
    void loadConfig();
  }, []);

  async function validateYaml() {
    setIsBusy(true);
    setStatus("Validating...");

    const response = await fetch("/api/config/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yaml }),
    });

    const result = (await response.json()) as { valid: boolean; errors: ValidationError[] };

    setErrors(result.errors ?? []);
    setStatus(result.valid ? "YAML is valid." : `Validation failed with ${result.errors.length} issue(s).`);
    setIsBusy(false);
  }

  async function saveYaml() {
    setIsBusy(true);
    setStatus("Saving...");

    const response = await fetch("/api/config/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yaml, updatedBy: "dashboard-admin" }),
    });

    const result = (await response.json()) as {
      ok: boolean;
      version?: number;
      errors?: ValidationError[];
    };

    if (!response.ok || !result.ok) {
      setErrors(result.errors ?? [{ line: 1, message: "Save failed." }]);
      setStatus("Save blocked: YAML did not pass validation.");
      setIsBusy(false);
      return;
    }

    setStatus(`Saved successfully as version ${result.version}.`);
    setBaselineYaml(yaml);
    await loadConfig();
    setIsBusy(false);
  }

  async function rollback(version: number) {
    setIsBusy(true);
    setStatus(`Rolling back to version ${version}...`);

    const response = await fetch(`/api/config/rollback/${version}`, { method: "POST" });

    if (!response.ok) {
      setStatus("Rollback failed.");
      setIsBusy(false);
      return;
    }

    await loadConfig();
    setStatus(`Rolled back to version ${version}.`);
    setIsBusy(false);
  }

  function formatYaml() {
    const normalized = yaml
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.replace(/\s+$/g, ""))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");

    setYaml(normalized.endsWith("\n") ? normalized : `${normalized}\n`);
    setStatus("Applied basic formatting (trimmed trailing spaces/extra empty lines).");
  }

  return (
    <main className="min-h-screen bg-[#0f1417] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">YAML Layout Config Editor</h1>
          <p className="text-[#9db0b9]">
            Edit your dashboard schema YAML (including widget layout), validate before save, and rollback to prior versions.
          </p>
          <p className="text-xs text-[#9db0b9]">
            Supported widget types: notes, bookmarks, tasks, ai, calendar, clock, weather.
          </p>
          <p className="text-sm text-primary">Status: {status}</p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={validateYaml}
            disabled={isBusy}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            Validate
          </button>
          <button
            onClick={saveYaml}
            disabled={isBusy}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={formatYaml}
            disabled={isBusy}
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            Format
          </button>
          <button
            onClick={() => setYaml(baselineYaml)}
            disabled={isBusy || !hasChanges}
            className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            Revert
          </button>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-[#2a353b] bg-[#161f24] p-3">
            <textarea
              className="w-full min-h-[560px] resize-y font-mono text-sm bg-[#0f1417] border border-[#2a353b] rounded-lg p-4 outline-none focus:ring-2 focus:ring-primary"
              value={yaml}
              onChange={(event) => setYaml(event.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="rounded-xl border border-[#2a353b] bg-[#161f24] p-4 space-y-4">
            <h2 className="text-xl font-semibold">Verification</h2>
            {errors.length === 0 ? (
              <p className="text-emerald-400 text-sm">No validation errors found.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {errors.map((error, index) => (
                  <li key={`${error.line}-${index}`} className="bg-red-500/10 border border-red-500/30 rounded p-2">
                    <span className="font-semibold">Line {error.line}:</span> {error.message}
                  </li>
                ))}
              </ul>
            )}

            <h3 className="text-lg font-semibold pt-2 border-t border-[#2a353b]">History</h3>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {history.length === 0 ? (
                <p className="text-[#9db0b9] text-sm">No saved versions yet.</p>
              ) : (
                history.map((entry) => (
                  <div key={entry.version} className="border border-[#2a353b] rounded p-2 text-sm">
                    <p className="font-semibold">v{entry.version}</p>
                    <p className="text-[#9db0b9]">{new Date(entry.timestamp).toLocaleString()}</p>
                    <p className="text-[#9db0b9] mb-2">by {entry.updatedBy}</p>
                    <button
                      onClick={() => rollback(entry.version)}
                      disabled={isBusy}
                      className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                    >
                      Rollback
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
