// JARVIS Glass-Layer: Milchglas-Look fuer /dashboard-jarvis (entfernen = diese Ressource loeschen)
(() => {
  if (window.__jvGlass) return; window.__jvGlass = 1;
  const P = "/dashboard-jarvis";
  const G = "linear-gradient(135deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.04) 45%,rgba(255,255,255,.02) 100%)";
  const GLOBAL = `
html.jarvis-hud:root {
  --lovelace-background: radial-gradient(circle at 12% 18%, rgba(24,223,255,.32) 0, rgba(24,223,255,0) 32%),
    radial-gradient(circle at 88% 12%, rgba(130,90,255,.26) 0, rgba(130,90,255,0) 30%),
    radial-gradient(circle at 78% 88%, rgba(255,125,37,.26) 0, rgba(255,125,37,0) 34%),
    radial-gradient(circle at 20% 92%, rgba(0,180,160,.20) 0, rgba(0,180,160,0) 30%),
    linear-gradient(160deg, #06121d 0%, #0a1b2b 50%, #040b13 100%) fixed !important;
  --ha-card-background: ${G} !important;
  --card-background-color: rgba(12,30,44,.55) !important;
  --ha-card-border-color: rgba(255,255,255,.16) !important;
  --ha-card-border-width: 1px !important;
  --ha-card-border-radius: 22px !important;
  --ha-card-box-shadow: 0 8px 32px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.18) !important;
  --app-header-background-color: rgba(6,18,29,.55) !important;
  --app-header-border-bottom: 1px solid rgba(255,255,255,.12) !important;
}
html.jarvis-hud ha-card { backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%); }
html.jarvis-hud .header, html.jarvis-hud app-header, html.jarvis-hud .toolbar { backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); }`;
  const R = {
    "jarvis-tile": `
.p{background:${G},rgba(10,28,42,.38)!important;backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);border:1px solid rgba(255,255,255,.17)!important;border-radius:22px!important}
.p::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 38%);box-shadow:inset 0 1px 0 rgba(255,255,255,.30)}
.p.on,.p.w{background:radial-gradient(ellipse at 0 0,rgba(255,125,37,.30),transparent 62%),${G},rgba(10,28,42,.38)!important;border-color:rgba(255,180,110,.50)!important}
.b button{background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.18)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:inset 0 1px 0 rgba(255,255,255,.16)!important;color:#d6e6ef!important}
.b button.a{background:rgba(24,223,255,.20)!important;border-color:rgba(24,223,255,.65)!important;color:#c9f6ff!important}
.bar{background:rgba(255,255,255,.07)!important;border:1px solid rgba(255,255,255,.16)!important}`,
    "ha-card": `:host{backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%)}`
  };
  const gs = document.createElement("style"); gs.id = "jarvis-glass-style"; gs.textContent = GLOBAL;
  const S = {}; for (const t in R) S[t] = new CSSStyleSheet();
  const done = new WeakSet();
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      const sr = el.shadowRoot; if (!sr) continue;
      const s = S[el.localName];
      if (s && !done.has(sr)) { sr.adoptedStyleSheets = [...sr.adoptedStyleSheets, s]; done.add(sr); }
      walk(sr);
    }
  };
  let on = null;
  const tick = () => {
    const a = location.pathname.startsWith(P);
    if (a !== on) {
      on = a;
      for (const t in R) S[t].replaceSync(a ? R[t] : "");
      if (a && !gs.isConnected) document.head.appendChild(gs);
      if (!a && gs.isConnected) gs.remove();
    }
    if (a) walk(document);
  };
  window.addEventListener("location-changed", () => { setTimeout(tick, 300); setTimeout(tick, 1200); });
  setInterval(tick, 2500); tick();
})();
