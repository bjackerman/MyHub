import { promises as fs } from "fs";
import path from "path";
import { load } from "js-yaml";

export type ValidationError = {
  line: number;
  message: string;
};

export type ConfigHistoryEntry = {
  version: number;
  timestamp: string;
  updatedBy: string;
  yaml: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "layout-config.yaml");
const HISTORY_PATH = path.join(DATA_DIR, "layout-config-history.json");
const SUPPORTED_WIDGET_TYPES = ["notes", "bookmarks", "tasks", "ai", "calendar", "clock", "weather"] as const;

export const DEFAULT_CONFIG_YAML = `version: 1
site:
  name: "My Hub"
  theme: "light"
  locale: "en-US"

layout:
  header:
    showLogo: true
    navItems:
      - label: "Home"
        path: "/"
      - label: "Settings"
        path: "/settings"

  sidebar:
    enabled: true
    sections:
      - title: "General"
        links:
          - label: "Profile"
            path: "/profile"

  widgets:
    - id: "notes"
      title: "Quick Notes"
      type: "notes"
      x: 0
      y: 0
      width: 300
      height: 320
    - id: "bookmarks"
      title: "Bookmarks"
      type: "bookmarks"
      x: 320
      y: 0
      width: 280
      height: 320
    - id: "clock"
      title: "World Clock"
      type: "clock"
      x: 620
      y: 0
      width: 280
      height: 200
    - id: "tasks"
      title: "Tasks"
      type: "tasks"
      x: 0
      y: 340
      width: 300
      height: 360
    - id: "ai"
      title: "AI Assistant"
      type: "ai"
      x: 320
      y: 340
      width: 580
      height: 360
    - id: "calendar"
      title: "Schedule"
      type: "calendar"
      x: 920
      y: 340
      width: 280
      height: 360

setup:
  auth:
    provider: "local"
    allowSignup: false
  features:
    yamlEditor: true
    auditLog: true
`;

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(CONFIG_PATH);
  } catch {
    await fs.writeFile(CONFIG_PATH, DEFAULT_CONFIG_YAML, "utf8");
  }

  try {
    await fs.access(HISTORY_PATH);
  } catch {
    await fs.writeFile(HISTORY_PATH, "[]", "utf8");
  }
}

export async function getConfig() {
  await ensureDataFiles();
  const yaml = await fs.readFile(CONFIG_PATH, "utf8");
  const history = await getHistory();
  const currentVersion = history.length ? history[history.length - 1].version + 1 : 1;

  return {
    yaml,
    version: currentVersion,
  };
}

export function validateLayoutYaml(yaml: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!yaml.trim()) {
    return [{ line: 1, message: "YAML cannot be empty." }];
  }

  const lines = yaml.replace(/\r\n/g, "\n").split("\n");
  lines.forEach((line, index) => {
    if (line.includes("\t")) {
      errors.push({ line: index + 1, message: "Tabs are not allowed. Use spaces for indentation." });
    }
  });

  let parsed: Record<string, unknown>;
  try {
    parsed = load(yaml, { json: true }) as Record<string, unknown>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid YAML syntax.";
    errors.push({ line: 1, message });
    return errors;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return [{ line: 1, message: "Top-level YAML value must be a mapping/object." }];
  }

  const requiredTopLevel = ["version", "site", "layout", "setup"];
  requiredTopLevel.forEach((key) => {
    if (!(key in parsed)) {
      errors.push({ line: 1, message: `Missing required top-level key: ${key}` });
    }
  });

  if (typeof parsed.version !== "number") {
    errors.push({ line: 1, message: "version must be a number (for example: version: 1)." });
  }

  if (!isRecord(parsed.site)) {
    errors.push({ line: 1, message: "site must be an object section." });
  }

  if (!isRecord(parsed.layout)) {
    errors.push({ line: 1, message: "layout must be an object section." });
  }

  if (!isRecord(parsed.setup)) {
    errors.push({ line: 1, message: "setup must be an object section." });
  }

  if (isRecord(parsed.layout)) {
    const widgets = parsed.layout.widgets;
    if (!Array.isArray(widgets)) {
      errors.push({ line: 1, message: "layout.widgets must be a list of widget objects." });
    } else {
      const ids = new Set<string>();
      widgets.forEach((widget, index) => {
        const item = widget as Record<string, unknown>;
        const prefix = `layout.widgets[${index}]`;
        if (!isRecord(widget)) {
          errors.push({ line: 1, message: `${prefix} must be an object.` });
          return;
        }

        if (typeof item.id !== "string" || !item.id.trim()) {
          errors.push({ line: 1, message: `${prefix}.id must be a non-empty string.` });
        } else if (ids.has(item.id)) {
          errors.push({ line: 1, message: `${prefix}.id must be unique. Duplicate: ${item.id}` });
        } else {
          ids.add(item.id);
        }

        if (typeof item.title !== "string" || !item.title.trim()) {
          errors.push({ line: 1, message: `${prefix}.title must be a non-empty string.` });
        }

        if (typeof item.type !== "string") {
          errors.push({ line: 1, message: `${prefix}.type must be a string.` });
        } else if (!SUPPORTED_WIDGET_TYPES.includes(item.type as (typeof SUPPORTED_WIDGET_TYPES)[number])) {
          errors.push({
            line: 1,
            message: `${prefix}.type must be one of: ${SUPPORTED_WIDGET_TYPES.join(", ")}.`,
          });
        }

        ["x", "y", "width", "height"].forEach((field) => {
          if (typeof item[field] !== "number") {
            errors.push({ line: 1, message: `${prefix}.${field} must be a number.` });
          }
        });

        if (item.isLocked !== undefined && typeof item.isLocked !== "boolean") {
          errors.push({ line: 1, message: `${prefix}.isLocked must be a boolean when provided.` });
        }
      });
    }
  }

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function getHistory(): Promise<ConfigHistoryEntry[]> {
  await ensureDataFiles();

  const raw = await fs.readFile(HISTORY_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw) as ConfigHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveConfig(yaml: string, updatedBy = "admin") {
  await ensureDataFiles();

  const errors = validateLayoutYaml(yaml);
  if (errors.length > 0) {
    return { ok: false as const, errors };
  }

  const history = await getHistory();
  const nextVersion = history.length ? history[history.length - 1].version + 1 : 1;

  const entry: ConfigHistoryEntry = {
    version: nextVersion,
    timestamp: new Date().toISOString(),
    updatedBy,
    yaml,
  };

  history.push(entry);

  await fs.writeFile(CONFIG_PATH, yaml, "utf8");
  await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2), "utf8");

  return { ok: true as const, version: nextVersion };
}

export async function rollbackConfig(version: number) {
  const history = await getHistory();
  const target = history.find((entry) => entry.version === version);

  if (!target) {
    return { ok: false as const, message: `Version ${version} not found.` };
  }

  await fs.writeFile(CONFIG_PATH, target.yaml, "utf8");
  return { ok: true as const };
}
