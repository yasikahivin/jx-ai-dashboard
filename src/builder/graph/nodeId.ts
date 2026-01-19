import { NodeKind } from "../../features/builder/types";

const parseSuffix = (value: string, prefix: string): number | null => {
  if (!value.startsWith(prefix)) {
    return null;
  }
  const suffix = value.slice(prefix.length);
  const parsed = Number.parseInt(suffix, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const generateNodeId = (kind: NodeKind, existingIds: string[]): string => {
  const prefix = `${kind}_`;
  const used = new Set(existingIds);
  let max = 0;

  existingIds.forEach((id) => {
    const suffix = parseSuffix(id, prefix);
    if (suffix !== null && suffix > max) {
      max = suffix;
    }
  });

  // Deterministically pick the next available id while avoiding collisions.
  let next = max + 1;
  let candidate = `${prefix}${next}`;
  while (used.has(candidate)) {
    next += 1;
    candidate = `${prefix}${next}`;
  }

  return candidate;
};
