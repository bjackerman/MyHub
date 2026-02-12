import { promises as fs } from "fs";
import path from "path";

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
  let previousIndent = 0;

  lines.forEach((line, index) => {
    const lineNo = index + 1;

    if (!line.trim() || line.trim().startsWith("#")) {
      return;
    }

    if (line.includes("\t")) {
      errors.push({ line: lineNo, message: "Tabs are not allowed. Use spaces for indentation." });
    }

    const indent = line.match(/^\s*/)?.[0].length ?? 0;

    if (indent % 2 !== 0) {
      errors.push({ line: lineNo, message: "Indentation must use multiples of 2 spaces." });
    }

    if (indent - previousIndent > 2) {
      errors.push({ line: lineNo, message: "Indentation jumped too far; nest one level at a time." });
    }

    const isListItem = /^\s*-\s+/.test(line);
    const isKeyValue = /^\s*[A-Za-z0-9_]+:\s*(.*)$/.test(line);

    if (!isListItem && !isKeyValue) {
      errors.push({
        line: lineNo,
        message: "Line must be a key/value pair (key:) or list item (- value).",
      });
    }

    previousIndent = indent;
  });

  const requiredTopLevel = ["version", "site", "layout", "setup"];
  requiredTopLevel.forEach((key) => {
    const re = new RegExp(`^${key}:`, "m");
    if (!re.test(yaml)) {
      errors.push({ line: 1, message: `Missing required top-level key: ${key}` });
    }
  });

  if (!/^\s*version:\s*\d+\s*$/m.test(yaml)) {
    errors.push({ line: 1, message: "version must be a number (for example: version: 1)." });
  }

  if (!/^\s*site:\s*$/m.test(yaml) || !/^\s*layout:\s*$/m.test(yaml) || !/^\s*setup:\s*$/m.test(yaml)) {
    errors.push({ line: 1, message: "site, layout, and setup should be object sections (key: on its own line)." });
  }

  return errors;
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
