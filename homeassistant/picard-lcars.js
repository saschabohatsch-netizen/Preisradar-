// PICARD · LCARS – Hommage-Dashboard fuer /dashboard-picard
// Karten: custom:picard-lcars-header, custom:picard-lcars-bar, custom:picard-lcars-tile
(() => {
if (customElements.get('picard-lcars-tile')) return;
const PATH = '/dashboard-picard';
const FONT = "'Antonio','Arial Narrow','Roboto Condensed',sans-serif";
const COL = { orange:'#ff9933', peach:'#ffcc99', lilac:'#cc99cc', violet:'#9999ff', blue:'#88bbff',
  red:'#dd5555', gold:'#ffaa33', pink:'#cc6699', tan:'#d9a066' };
const col = c => COL[c] || c || COL.orange;

// ---------- Schrift + globales Theme (nur auf /dashboard-picard) ----------
if (!document.getElementById('picard-font')) {
  const l = document.createElement('link'); l.id = 'picard-font'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&display=swap';
  document.head.appendChild(l);
}
const G = document.createElement('style'); G.id = 'picard-lcars-style';
G.textContent = `html.picard-lcars{
--primary-color:#ff9933!important;--accent-color:#cc99cc!important;--mdc-theme-primary:#ff9933!important;
--primary-background-color:#000!important;--secondary-background-color:#0c0c0c!important;
--lovelace-background:#000!important;--card-background-color:#000!important;
--ha-card-background:#000!important;--ha-card-border-width:0!important;--ha-card-box-shadow:none!important;
--primary-text-color:#ffcc99!important;--secondary-text-color:#cc99cc!important;--divider-color:#2a2a2a!important;
--app-header-background-color:#000!important;--app-header-text-color:#ff9933!important;
--app-header-border-bottom:4px solid #ff9933!important;
--sidebar-background-color:#000!important;--sidebar-text-color:#ffcc99!important;--sidebar-icon-color:#cc99cc!important;
--sidebar-selected-icon-color:#ff9933!important;--sidebar-selected-text-color:#ff9933!important;
--state-icon-color:#ff9933!important;--switch-checked-color:#ff9933!important;--slider-color:#ff9933!important;
--ha-font-family-body:${FONT}!important;--ha-font-family-heading:${FONT}!important;
--mdc-typography-font-family:${FONT}!important;--paper-font-common-base_-_font-family:${FONT}!important;
color-scheme:dark}
@keyframes pcRed{0%,100%{opacity:1}50%{opacity:.35}}`;
document.head.appendChild(G);
const sync = () => document.documentElement.classList.toggle('picard-lcars', location.pathname.startsWith(PATH));
window.addEventListener('location-changed', sync); window.addEventListener('popstate', sync);
setInterval(sync, 1000); sync();

// ---------- Hilfen ----------
let actx = null;
const chirp = (hi) => {
  if (window.__picardSound === false) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(hi ? 1320 : 990, t); o.frequency.setValueAtTime(hi ? 1760 : 1320, t + .06);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.05, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .14);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .15);
  } catch (e) {}
};
const code = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return String(1000 + h % 9000); };
const num = (v) => Number(v).toLocaleString('de-DE', { maximumFractionDigits: 1 });
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const TR = { on:'AN', off:'AUS', home:'ZUHAUSE', not_home:'ABWESEND', away:'ABWESEND', playing:'SPIELT', paused:'PAUSE',
  idle:'BEREIT', standby:'STANDBY', docked:'IM DOCK', cleaning:'REINIGT', returning:'KEHRT ZURÜCK', error:'FEHLER',
  heat:'HEIZEN', auto:'AUTO', cool:'KÜHLEN', heating:'HEIZT', unavailable:'OFFLINE', unknown:'UNBEKANNT',
  cloudy:'BEWÖLKT', sunny:'SONNIG', partlycloudy:'TEILS BEWÖLKT', 'clear-night':'KLAR', rainy:'REGEN', pouring:'STARKREGEN',
  fog:'NEBEL', snowy:'SCHNEE', 'snowy-rainy':'SCHNEEREGEN', windy:'WINDIG', lightning:'GEWITTER', 'lightning-rainy':'GEWITTER', hail:'HAGEL' };
const tr = (s) => TR[s] || String(s ?? '').toUpperCase();
const DC = { temperature:'TEMPERATUR', humidity:'LUFTFEUCHTE', battery:'ENERGIEZELLE', power:'LEISTUNG', illuminance:'LICHT' };
const TOGGLE = ['light','switch','input_boolean','fan','automation'];
const DEFCOL = { light:'orange', climate:'violet', sensor:'peach', media_player:'lilac', vacuum:'gold', weather:'blue',
  binary_sensor:'red', select:'pink', input_select:'pink', update:'tan', device_tracker:'blue', input_boolean:'gold', switch:'gold' };
const isGroupLight = (a) => a.entity_id || a.is_hue_group;

// ---------- Kachel ----------
const TCSS = `:host{display:block;height:100%;font-family:${FONT}}*{box-sizing:border-box}
.t{display:flex;gap:5px;height:100%;min-height:80px;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;--c:#ff9933}
.cap{flex:0 0 44px;background:var(--c);border-radius:999px 0 0 999px;display:flex;align-items:flex-end;justify-content:center;padding:0 0 9px 6px;color:#000;font-size:11px;font-weight:700;letter-spacing:.5px;transition:opacity .3s}
.m{flex:1;min-width:0;background:var(--c);color:#000;display:flex;flex-direction:column;justify-content:space-between;padding:7px 14px 8px 12px;border-radius:0 4px 4px 0;transition:background .3s,color .3s,filter .15s}
.t:active .m{filter:brightness(1.3)}
.off .cap{opacity:.5}.off .m{background:#000;color:var(--c);box-shadow:inset 0 0 0 2px var(--c)}
.un .cap{background:#444}.un .m{background:#000;color:#555;box-shadow:inset 0 0 0 2px #333}
.al .m,.al .cap{background:#dd5555!important;color:#000!important;animation:pcRed 1s steps(2) infinite}
.n{font-size:17px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;min-width:0}
.s{font-size:11px;letter-spacing:1px;text-transform:uppercase;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.v{font-size:30px;font-weight:700;line-height:1;white-space:nowrap}.v small{font-size:14px;margin-left:3px;font-weight:600}
.v.x{font-size:19px}
.ctl{display:flex;gap:4px;margin-top:6px}
.ctl button{flex:1;min-width:0;height:28px;border:0;border-radius:14px;background:#000;color:var(--c);font:700 16px ${FONT};letter-spacing:1px;text-transform:uppercase;cursor:pointer;padding:0 6px;white-space:nowrap;overflow:hidden}
.off .ctl button{background:var(--c);color:#000}
.ctl button:active{filter:brightness(1.6)}
.seg{display:flex;gap:3px;margin-top:6px;height:12px}
.seg i{flex:1;background:rgba(0,0,0,.25);border-radius:2px}.seg i.on{background:#000}
.off .seg i{background:var(--c);opacity:.25}`;

class PicardTile extends HTMLElement {
  setConfig(c) { if (!c.entity) throw new Error('entity fehlt'); this._c = c;
    if (!this.shadowRoot) { const r = this.attachShadow({ mode:'open' });
      r.addEventListener('click', e => this._click(e));
      r.addEventListener('pointerdown', e => { this._lp = false; clearTimeout(this._lt);
        this._lt = setTimeout(() => { this._lp = true; chirp(false); this._more(); }, 550); });
      ['pointerup','pointerleave','pointercancel'].forEach(ev => r.addEventListener(ev, () => clearTimeout(this._lt)));
    } }
  getGridOptions() { return { columns: 6, rows: 'auto', min_columns: 3 }; }
  getCardSize() { return 2; }
  set hass(h) { this._h = h; const s = h.states[this._c.entity]; const k = s ? s.last_updated + s.state : '-';
    if (k !== this._k) { this._k = k; this._r(); } }
  _s(d, sv, data) { this._h.callService(d, sv, Object.assign({ entity_id: this._c.entity }, data || {})); }
  _more() { this.dispatchEvent(new CustomEvent('hass-more-info', { detail:{ entityId:this._c.entity }, bubbles:true, composed:true })); }
  _click(e) {
    if (this._lp) { this._lp = false; return; }
    const a = e.composedPath().find(n => n.dataset && n.dataset.a); if (!a) return;
    const x = a.dataset.a, d = this._c.entity.split('.')[0], s = this._h.states[this._c.entity];
    chirp(x !== 'more');
    if (x === 'more') return this._more();
    if (x === 'main') { if (TOGGLE.includes(d)) return this._s('homeassistant', 'toggle'); return this._more(); }
    if (x === 'br') return this._s('light', 'turn_on', { brightness_pct: +a.dataset.v });
    if (x === 'tmp') { const at = s.attributes, st = at.target_temp_step || .5;
      const t = Math.round(((at.temperature ?? at.current_temperature ?? 20) + (+a.dataset.v) * st) * 10) / 10;
      return this._s('climate', 'set_temperature', { temperature: t }); }
    if (x === 'prev' || x === 'next') return this._s(d, x === 'prev' ? 'select_previous' : 'select_next', { cycle: true });
    this._s(d, x);
  }
  _r() {
    const c = this._c, h = this._h, R = this.shadowRoot; if (!h || !R) return;
    const s = h.states[c.entity], d = c.entity.split('.')[0];
    const color = col(c.color || DEFCOL[d]);
    if (!s) { R.innerHTML = `<style>${TCSS}</style><div class="t un"><div class="cap">----</div><div class="m"><div class="n">${esc(c.name || c.entity)}</div><div class="s">NICHT GEFUNDEN</div></div></div>`; return; }
    const a = s.attributes, st = s.state, un = st === 'unavailable' || st === 'unknown' && !['select','input_select','sensor'].includes(d);
    let v = '', u = '', sub = '', on = true, ctl = '', seg = '', small = false, al = false;
    const B = (x, t, data) => `<button data-a="${x}"${data ? ` data-v="${data}"` : ''}>${t}</button>`;
    if (d === 'light') { on = st === 'on';
      if (on && a.brightness != null) { v = Math.round(a.brightness / 2.55); u = '%'; } else { v = tr(st); small = true; }
      sub = on ? 'ENERGIE' : 'BEREIT';
      if ((a.supported_color_modes || []).some(m => m !== 'onoff') && !isGroupLight(a)) {
        const p = on ? Math.round((a.brightness || 0) / 2.55) : 0;
        seg = '<div class="seg">' + [10,20,30,40,50,60,70,80,90,100].map(x => `<i data-a="br" data-v="${x}" class="${p >= x - 5 ? 'on' : ''}"></i>`).join('') + '</div>';
      } }
    else if (d === 'climate') { on = a.hvac_action === 'heating';
      v = a.current_temperature != null ? num(a.current_temperature) : '–'; u = '°';
      sub = (tr(a.hvac_action || st)) + (a.temperature != null ? ` · SOLL ${num(a.temperature)}°` : '');
      ctl = B('tmp', '−', -1) + B('tmp', '+', 1); }
    else if (d === 'sensor') { const n = Number(st);
      if (st !== '' && !isNaN(n)) { v = num(n); u = a.unit_of_measurement || ''; } else { v = tr(st); small = true; }
      sub = DC[a.device_class] || 'SENSOR'; }
    else if (d === 'weather') { v = a.temperature != null ? num(a.temperature) : '–'; u = a.temperature_unit || '°'; sub = tr(st); }
    else if (d === 'binary_sensor') { on = st === 'on'; al = on && ['smoke','heat','gas','carbon_monoxide','safety','problem','moisture'].includes(a.device_class) || on && c.alarm;
      v = al ? 'ALARM' : (on ? 'AKTIV' : 'NORMAL'); small = true; sub = 'SENSORGITTER'; }
    else if (d === 'media_player') { on = st === 'playing'; v = tr(st); small = true;
      sub = a.media_title ? a.media_title + (a.media_artist ? ' · ' + a.media_artist : '') : 'KOMM-SYSTEM';
      if (!['off','unavailable','standby'].includes(st)) ctl = B('media_previous_track', '◀◀') + B('media_play_pause', st === 'playing' ? '❚❚' : '▶') + B('media_next_track', '▶▶'); }
    else if (d === 'vacuum') { on = ['cleaning','returning'].includes(st); v = tr(st); small = true; sub = 'DROHNE';
      if (!un) ctl = B('start', 'START') + B('return_to_base', 'DOCK'); }
    else if (d === 'select' || d === 'input_select') { v = st === 'unknown' ? '—' : st; small = true; sub = 'PROGRAMM';
      ctl = B('prev', '◀') + B('next', '▶'); }
    else if (d === 'update') { on = st === 'on'; v = a.installed_version || tr(st); small = true;
      sub = on ? `UPDATE ${a.latest_version || ''}` : 'AKTUELL'; }
    else if (d === 'device_tracker' || d === 'person') { on = st === 'home'; v = tr(st); small = true; sub = 'POSITION'; }
    else { on = !['off','idle','unavailable','not_home'].includes(st); v = tr(st); small = true; sub = TOGGLE.includes(d) ? 'SYSTEM' : d.toUpperCase(); }
    if (c.sub) sub = c.sub;
    const cls = 't' + (un ? ' un' : (!on ? ' off' : '')) + (al ? ' al' : '');
    R.innerHTML = `<style>${TCSS}</style><div class="${cls}" style="--c:${color}">
<div class="cap" data-a="more">${code(c.entity)}</div>
<div class="m" data-a="main"><div class="n">${esc(c.name || a.friendly_name || c.entity)}</div>
<div class="r"><div class="s">${esc(sub)}</div><div class="v${small ? ' x' : ''}">${esc(v)}${u ? `<small>${esc(u)}</small>` : ''}</div></div>${seg}${ctl ? `<div class="ctl">${ctl}</div>` : ''}</div></div>`;
  }
}
customElements.define('picard-lcars-tile', PicardTile);

// ---------- Abschnitts-Balken ----------
class PicardBar extends HTMLElement {
  setConfig(c) { this._c = c; if (!this.shadowRoot) this.attachShadow({ mode:'open' }); this._r(); }
  set hass(h) {}
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }
  getCardSize() { return 1; }
  _r() { const c = this._c, k = col(c.color);
    this.shadowRoot.innerHTML = `<style>:host{display:block;font-family:${FONT}}
.b{display:flex;align-items:center;gap:6px;height:34px;margin-top:8px}
.l{flex:0 0 34px;height:34px;background:${k};border-radius:17px 0 0 17px}
.t{color:${k};font-size:24px;font-weight:600;letter-spacing:3px;text-transform:uppercase;white-space:nowrap;padding:0 4px;line-height:34px}
.f{flex:1;height:16px;background:${k};min-width:20px}
.c{flex:0 0 auto;height:16px;padding:0 10px;background:${k};color:#000;font-size:11px;font-weight:700;letter-spacing:1px;line-height:16px;border-radius:0 8px 8px 0}</style>
<div class="b"><div class="l"></div><div class="t">${esc(c.title || '')}</div><div class="f"></div><div class="c">${esc(c.code || code(c.title || 'x').slice(0,2) + '-' + code((c.title || 'x') + 'y'))}</div></div>`; }
}
customElements.define('picard-lcars-bar', PicardBar);

// ---------- Kopf (LCARS-Rahmen) ----------
const QUOTES = ['„Machen Sie es so.“','„Energie!“','„Tee. Earl Grey. Heiß.“','„Bis hierher und nicht weiter!“',
  '„Dinge sind nur so lange unmöglich, bis sie es nicht mehr sind.“','„Man kann alles richtig machen und trotzdem verlieren. Das ist keine Schwäche, das ist das Leben.“'];
const stardate = (dt) => { const y = dt.getFullYear(), s = new Date(y, 0, 1), e = new Date(y + 1, 0, 1);
  return ((y - 1946) * 1000 + (dt - s) / (e - s) * 1000).toFixed(1).replace('.', ','); };
const HCSS = `:host{display:block;font-family:${FONT};color:#ffcc99}*{box-sizing:border-box}
.f{display:grid;grid-template-columns:var(--cw) 1fr;grid-template-rows:auto 1fr auto;column-gap:6px;--cw:150px;--sw:118px;--bh:28px;--o:#ff9933}
.e{position:relative;background:var(--o);height:76px;border-radius:60px 0 0 0}
.e::after{content:"";position:absolute;left:var(--sw);top:var(--bh);right:0;bottom:0;background:#000;border-radius:26px 0 0 0}
.e.b{border-radius:0 0 0 60px}.e.b::after{top:0;bottom:var(--bh);border-radius:0 0 0 26px}
.tb{display:flex;gap:6px;align-items:flex-start;height:76px}
.tb .x{height:var(--bh);background:var(--o)}.tb .g{flex:1}
.tb .ti{font-size:52px;font-weight:600;line-height:.9;letter-spacing:4px;color:var(--o);text-transform:uppercase;padding:0 6px;margin-top:-4px;white-space:nowrap}
.tb .rc{width:40px;height:var(--bh);background:var(--o);border-radius:0 14px 14px 0}
.bb{display:flex;gap:6px;align-items:flex-end;height:76px}.bb .x{height:var(--bh)}
.side{width:var(--sw);display:flex;flex-direction:column;gap:6px;padding:6px 0}
.side div{background:#cc99cc;color:#000;font-size:12px;font-weight:700;letter-spacing:1px;padding:4px 8px;display:flex;align-items:flex-end;justify-content:flex-end}
.c{padding:12px 6px 12px 18px;display:flex;flex-direction:column;justify-content:center;gap:14px;min-width:0}
.sd{font-size:20px;letter-spacing:3px;color:#9999ff}
.q{font-size:32px;line-height:1.1;color:#ffcc99;cursor:pointer;letter-spacing:.5px}
.q span{display:block;font-size:15px;letter-spacing:3px;color:#cc99cc;margin-top:6px}
.st{display:flex;flex-wrap:wrap;gap:6px}
.st div{background:var(--k);color:#000;border-radius:16px;padding:5px 14px;font-size:15px;font-weight:700;letter-spacing:1px;white-space:nowrap}
.red .e,.red .tb .x,.red .tb .rc,.red .bb .x{background:#dd5555!important}.red .ti{color:#dd5555!important}
.red .e,.red .tb,.red .bb{animation:pcRed 1s steps(2) infinite}
@media (max-width:700px){.f{--cw:78px;--sw:56px;--bh:20px}.tb .ti{font-size:34px}.q{font-size:24px}.side div{font-size:10px;padding:3px 5px}}`;
class PicardHeader extends HTMLElement {
  setConfig(c) { this._c = c; this._qi = null; if (c.sound === false) window.__picardSound = false;
    if (!this.shadowRoot) { this.attachShadow({ mode:'open' }).addEventListener('click', e => {
      if (e.composedPath().some(n => n.classList && n.classList.contains('q'))) { chirp(true); this._qi = ((this._qi ?? this._day()) + 1) % QUOTES.length; this._r(true); } }); }
    clearInterval(this._iv); this._iv = setInterval(() => this._r(true), 20000); }
  disconnectedCallback() { clearInterval(this._iv); this._iv = null; }
  connectedCallback() { if (!this._iv && this._c) this._iv = setInterval(() => this._r(true), 20000); }
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }
  getCardSize() { return 5; }
  _day() { const n = new Date(); return Math.floor((n - new Date(n.getFullYear(), 0, 0)) / 864e5) % QUOTES.length; }
  set hass(h) { this._h = h; this._r(false); }
  _r(force) {
    const h = this._h, c = this._c, R = this.shadowRoot; if (!h || !R) return;
    const S = Object.values(h.states);
    const lights = S.filter(s => s.entity_id.startsWith('light.') && s.state === 'on' && !isGroupLight(s.attributes)).length;
    const cl = S.filter(s => s.entity_id.startsWith('climate.')), heat = cl.filter(s => s.attributes.hvac_action === 'heating').length;
    const out = c.outside && h.states[c.outside] ? num(h.states[c.outside].state) + '°' : null;
    const red = (c.alert_entities || []).some(e => h.states[e] && h.states[e].state === 'on');
    const now = new Date(), tm = now.toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' });
    const key = [lights, heat, cl.length, out, red, tm, this._qi].join('|');
    if (!force && key === this._k) return; this._k = key;
    const q = red ? '„Roter Alarm! Alle Mann auf die Stationen!“' : (lights === 4 && this._qi == null ? '„Es gibt vier Lichter!“' : QUOTES[this._qi ?? this._day()]);
    const chip = (k, t) => `<div style="--k:${k}">${t}</div>`;
    R.innerHTML = `<style>${HCSS}</style><div class="f${red ? ' red' : ''}">
<div class="e"></div><div class="tb"><div class="x" style="width:24px"></div><div class="x g"></div><div class="ti">${esc(red ? 'ROTER ALARM' : (c.title || 'BRÜCKE'))}</div><div class="rc"></div></div>
<div class="side"><div style="flex:0 0 46px">${code('a' + tm).slice(0,2)}-${code(tm)}</div><div style="flex:1;background:#9999ff">${code('b' + lights)}</div><div style="flex:0 0 34px;background:#ff9933">LCARS ${code('c').slice(0,2)}</div></div>
<div class="c"><div class="sd">STERNZEIT ${stardate(now)} · ${tm}</div>
<div class="q" title="Antippen für das nächste Zitat">${esc(q)}<span>— CAPT. JEAN-LUC PICARD</span></div>
<div class="st">${chip('#ff9933', `LICHTER ${lights}`)}${chip('#9999ff', `HEIZUNG ${heat}/${cl.length}`)}${out ? chip('#88bbff', `AUSSEN ${out}`) : ''}${chip(red ? '#dd5555' : '#cc99cc', red ? 'ALARM' : 'ALLE SYSTEME NORMAL')}</div></div>
<div class="e b"></div><div class="bb"><div class="x" style="width:24px;background:#cc6699"></div><div class="x" style="flex:2;background:#ff9933"></div><div class="x" style="flex:1;background:#ffcc99"></div><div class="x" style="flex:3;background:#cc99cc"></div><div class="x" style="width:40px;background:#9999ff;border-radius:0 14px 14px 0"></div></div></div>`;
  }
}
customElements.define('picard-lcars-header', PicardHeader);
(window.customCards = window.customCards || []).push(
  { type:'picard-lcars-tile', name:'Picard LCARS Kachel' },
  { type:'picard-lcars-bar', name:'Picard LCARS Balken' },
  { type:'picard-lcars-header', name:'Picard LCARS Kopf' });
})();
