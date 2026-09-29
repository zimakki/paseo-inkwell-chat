import { Platform } from "react-native";
import { INKWELL_CSS } from "../shared/inkwell-css";
import { toolKeyFromLabel } from "../shared/tool-key";

// The plugin tsconfig has no DOM lib, so this module declares only what it uses.
interface DomNode {
  nodeType: number;
  textContent: string | null;
  parentElement: DomElement | null;
}
interface DomElement extends DomNode {
  id: string;
  isConnected: boolean;
  childNodes: ArrayLike<DomNode>;
  getAttribute(name: string): string | null;
  hasAttribute(name: string): boolean;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  matches(selectors: string): boolean;
  closest(selectors: string): DomElement | null;
  querySelector(selectors: string): DomElement | null;
  querySelectorAll(selectors: string): ArrayLike<DomElement>;
  remove(): void;
}
interface DomMutationRecord {
  target: DomNode;
  addedNodes: ArrayLike<DomNode>;
}
declare const document: {
  head: { appendChild(node: DomElement): void };
  body: DomElement;
  createElement(tagName: "style"): DomElement;
  getElementById(id: string): DomElement | null;
  querySelectorAll(selectors: string): ArrayLike<DomElement>;
};
declare const MutationObserver: new (callback: (records: ArrayLike<DomMutationRecord>) => void) => {
  observe(
    target: DomElement,
    options: { childList: boolean; subtree: boolean; characterData: boolean },
  ): void;
  disconnect(): void;
};
declare function requestAnimationFrame(callback: () => void): number;
declare function cancelAnimationFrame(handle: number): void;

const STYLE_ID = "inkwell-chat";
const BADGE_SELECTOR = '[data-testid="tool-call-badge"]';
const TOOL_ATTRIBUTE = "data-inkwell-tool";
const LABEL_ATTRIBUTE = "data-inkwell-label";
const ICON_ATTRIBUTE = "data-inkwell-icon";
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

let stopActive: (() => void) | null = null;

function ownText(element: DomElement): string {
  let text = "";
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === TEXT_NODE) text += node.textContent ?? "";
  }
  return text;
}

function labelElementOf(badge: DomElement): DomElement | null {
  const elements = badge.querySelectorAll("*");
  for (let i = 0; i < elements.length; i++) {
    if (ownText(elements[i]).trim() !== "") return elements[i];
  }
  return null;
}

function iconElementOf(badge: DomElement): DomElement | null {
  return badge.querySelector("svg");
}

function markOnly(badge: DomElement, attribute: string, keep: DomElement | null): void {
  const marked = badge.querySelectorAll(`[${attribute}]`);
  for (let i = 0; i < marked.length; i++) {
    if (marked[i] !== keep) marked[i].removeAttribute(attribute);
  }
  if (keep && !keep.hasAttribute(attribute)) keep.setAttribute(attribute, "");
}

function tagBadge(badge: DomElement): void {
  const labelElement = labelElementOf(badge);
  const key = labelElement ? toolKeyFromLabel(ownText(labelElement)) : null;
  markOnly(badge, LABEL_ATTRIBUTE, key ? labelElement : null);
  markOnly(badge, ICON_ATTRIBUTE, key ? iconElementOf(badge) : null);
  if (key === null) badge.removeAttribute(TOOL_ATTRIBUTE);
  else if (badge.getAttribute(TOOL_ATTRIBUTE) !== key) badge.setAttribute(TOOL_ATTRIBUTE, key);
}

function untagAll(): void {
  for (const attribute of [TOOL_ATTRIBUTE, LABEL_ATTRIBUTE, ICON_ATTRIBUTE]) {
    const tagged = document.querySelectorAll(`[${attribute}]`);
    for (let i = 0; i < tagged.length; i++) tagged[i].removeAttribute(attribute);
  }
}

export function startInkwell(): () => void {
  if (Platform.OS !== "web") return () => {};
  stopActive?.();

  document.getElementById(STYLE_ID)?.remove();
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = INKWELL_CSS;
  document.head.appendChild(style);

  const pending = new Set<DomElement>();
  let frame: number | null = null;
  const flush = () => {
    frame = null;
    for (const badge of pending) if (badge.isConnected) tagBadge(badge);
    pending.clear();
  };
  const addOwner = (node: DomNode) => {
    const element = node.nodeType === ELEMENT_NODE ? (node as DomElement) : node.parentElement;
    const badge = element?.closest(BADGE_SELECTOR);
    if (badge) pending.add(badge);
  };
  const observer = new MutationObserver((records) => {
    for (let i = 0; i < records.length; i++) {
      addOwner(records[i].target);
      const added = records[i].addedNodes;
      for (let j = 0; j < added.length; j++) {
        if (added[j].nodeType !== ELEMENT_NODE) continue;
        const element = added[j] as DomElement;
        if (element.matches(BADGE_SELECTOR)) pending.add(element);
        const inner = element.querySelectorAll(BADGE_SELECTOR);
        for (let k = 0; k < inner.length; k++) pending.add(inner[k]);
      }
    }
    if (pending.size > 0 && frame === null) frame = requestAnimationFrame(flush);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  const initial = document.querySelectorAll(BADGE_SELECTOR);
  for (let i = 0; i < initial.length; i++) tagBadge(initial[i]);

  const stop = () => {
    observer.disconnect();
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    pending.clear();
    style.remove();
    untagAll();
    if (stopActive === stop) stopActive = null;
  };
  stopActive = stop;
  return stop;
}
