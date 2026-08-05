// university-life-video.jsx — "University life" film, Industry blueprint style.
// Requires animations-v2.jsx and tweaks-panel.jsx loaded first (same x-import).
const { SceneStage, useScene, Easing } = window;

const C = {
  bg: '#f2f2f3', surface: '#e9e9ea', ink: '#1d1f20',
  steel: '#5980a6', steel700: '#416180', steel900: '#1d2d3d',
  line: 'rgba(29,31,32,0.16)', faint: 'rgba(29,31,32,0.55)', hair: 'rgba(29,31,32,0.08)'
};
const HEAD = "'Barlow Condensed', system-ui, sans-serif";
const BODY = "'Barlow', system-ui, sans-serif";
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// ── the only three motion helpers in the piece ──
const MOTION = {
  enter(t, delay, dur) {
    const p = Easing.easeOutCubic(clamp01((t - delay) / (dur || 0.55)));
    return { opacity: p, transform: `translateY(${(1 - p) * 20}px)` };
  },
  draw(t, delay, dur) {
    return Easing.easeInOutCubic(clamp01((t - delay) / (dur || 0.8)));
  },
  pop(t, delay, dur) {
    const p = Easing.easeOutBack(clamp01((t - delay) / (dur || 0.5)));
    const o = clamp01((t - delay) / 0.25);
    return { opacity: o, transform: `scale(${0.85 + 0.15 * p})` };
  }
};
// exit envelope: 1 through the scene, eases to 0 across the last 0.45s
function exitFade(t, dur) { return Easing.easeOutQuad(clamp01((dur - t) / 0.45)); }

const CHAPTERS = ['BUILT', 'RESEARCH', 'FOUNDED', 'MENTORED', 'MADE'];

function Cross({ x, y, size, color }) {
  const s = size || 11, c = color || 'rgba(29,31,32,0.55)';
  return (
    <div style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s }}>
      <div style={{ position: 'absolute', left: s / 2, top: 0, width: 1, height: s, background: c }}></div>
      <div style={{ position: 'absolute', top: s / 2, left: 0, width: s, height: 1, background: c }}></div>
    </div>
  );
}

// persistent sheet: grid, frame, title block, chapter rail. Identical at every
// scene boundary except the lit count (which only advances mid-scene).
function SheetChrome({ lit, wobble }) {
  const dx = Math.sin((wobble || 0) * Math.PI * 2) * 5;
  const dy = (1 - Math.cos((wobble || 0) * Math.PI * 2)) * 4;
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, fontFamily: BODY }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.55,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(89,128,166,0.10) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, rgba(89,128,166,0.10) 0 1px, transparent 1px 48px)'
      }}></div>
      <div style={{ position: 'absolute', inset: 26, border: `1px solid ${C.line}` }}></div>
      <Cross x={26} y={26} /><Cross x={1254} y={26} /><Cross x={26} y={694} /><Cross x={1254} y={694} />
      <Cross x={1150 + dx} y={80 + dy} size={15} color={C.steel} />
      <div style={{ position: 'absolute', top: 27, left: 27, right: 27, height: 34, borderBottom: `1px solid ${C.hair}`, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.hair}`, fontFamily: HEAD, fontWeight: 600, fontSize: 13, letterSpacing: '0.14em', color: C.steel700 }}>RB-UNI-001</div>
        <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.hair}`, fontSize: 10, letterSpacing: '0.18em', color: C.faint }}>UNIVERSITY LIFE · THE FILM</div>
        <div style={{ padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 10, letterSpacing: '0.18em', color: C.faint }}>REV A</div>
        <div style={{ marginLeft: 'auto', padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 10, letterSpacing: '0.18em', color: C.faint }}>NOTTINGHAM TRENT UNIVERSITY</div>
      </div>
      <div style={{ position: 'absolute', bottom: 27, left: 27, right: 27, height: 40, borderTop: `1px solid ${C.hair}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 22 }}>
        {CHAPTERS.map((c, i) => {
          const on = i < lit;
          return (
            <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, border: `1px solid ${on ? C.steel700 : C.line}`, background: on ? C.steel : 'transparent' }}></div>
              <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', color: on ? C.steel900 : C.faint }}>{'0' + (i + 1) + ' ' + c}</div>
            </div>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: 10, letterSpacing: '0.18em', color: C.faint }}>FOUR YEARS · ON RECORD</div>
      </div>
    </div>
  );
}

function IconPanel({ caption, children, t }) {
  const box = MOTION.draw(t, 0.55, 0.7);
  return (
    <div style={{ position: 'relative', width: 380, height: 300, flex: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, border: `1px solid ${C.line}`, clipPath: `inset(0 ${(1 - box) * 100}% 0 0)` }}></div>
      <Cross x={0} y={0} size={9} /><Cross x={380} y={0} size={9} /><Cross x={0} y={300} size={9} /><Cross x={380} y={300} size={9} />
      <svg viewBox="0 0 320 220" style={{ position: 'absolute', left: 30, top: 18, width: 320, height: 220 }} fill="none">{children}</svg>
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 10.5, letterSpacing: '0.16em', color: C.faint, opacity: clamp01((t - 1.2) / 0.4) }}>{caption}</div>
    </div>
  );
}

function ChapterLayer({ idx, head, rows, caption, t, p, dur, icon }) {
  const ex = exitFade(t, dur);
  const lit = t > 0.7 ? idx : idx - 1;
  const breathe = 1 + 0.012 * Math.sin(p * Math.PI);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: BODY, color: C.ink }}>
      <SheetChrome lit={lit} wobble={p} />
      <div style={{ position: 'absolute', inset: '90px 70px 96px 70px', display: 'flex', gap: 60, alignItems: 'center', opacity: ex, transform: `translateY(${(1 - ex) * -16}px) scale(${breathe})` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...MOTION.pop(t, 0.15), fontFamily: HEAD, fontWeight: 600, fontSize: 15, letterSpacing: '0.2em', color: C.steel700 }}>{'CHAPTER 0' + idx}</div>
          <div style={{ ...MOTION.enter(t, 0.3), fontFamily: HEAD, fontWeight: 600, fontSize: 104, lineHeight: 0.95, letterSpacing: '0.01em', color: C.steel900, margin: '6px 0 30px' }}>{head}</div>
          <div>
            {rows.map((r, i) => {
              const st = MOTION.enter(t, 0.75 + i * 0.28);
              return (
                <div key={i} style={{ ...st, display: 'flex', gap: 16, alignItems: 'baseline', borderTop: `1px solid ${C.hair}`, padding: '13px 0' }}>
                  <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 16, color: C.steel700, width: 18, flex: 'none' }}>{String.fromCharCode(97 + i)}</div>
                  <div>
                    <div style={{ fontSize: 21, fontWeight: 600 }}>{r[0]}</div>
                    {r[1] ? <div style={{ fontSize: 14.5, color: C.faint, marginTop: 2 }}>{r[1]}</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <IconPanel caption={caption} t={t}>{icon}</IconPanel>
      </div>
    </div>
  );
}

// ── icons (stroke drawings, drawn on by MOTION.draw) ──
function dashed(d, drawP, extra) {
  return <path d={d} pathLength="1" stroke={C.steel700} strokeWidth="1.6" strokeDasharray="1" strokeDashoffset={1 - drawP} {...(extra || {})} />;
}

function PlaneIcon({ t }) {
  const d1 = MOTION.draw(t, 0.7, 0.9), d2 = MOTION.draw(t, 1.2, 0.6);
  return (
    <g>
      {dashed('M160 30 C167 58 167 88 164 116 L164 148 C164 161 162 172 160 182 C158 172 156 161 156 148 L156 116 C153 88 153 58 160 30 Z', d1)}
      {dashed('M156 90 L56 138 L56 150 L156 116 Z', d1)}
      {dashed('M164 90 L264 138 L264 150 L164 116 Z', d1)}
      {dashed('M157 160 L120 186 L120 194 L157 176 Z', d2)}
      {dashed('M163 160 L200 186 L200 194 L163 176 Z', d2)}
      {dashed('M160 44 L160 20', d2)}
    </g>
  );
}

function FlightIcon({ t }) {
  const dp = MOTION.draw(t, 0.8, 1.6);
  const P0 = { x: 48, y: 168 }, Cp = { x: 160, y: 40 }, P1 = { x: 276, y: 108 };
  const bez = (u) => ({
    x: (1 - u) * (1 - u) * P0.x + 2 * (1 - u) * u * Cp.x + u * u * P1.x,
    y: (1 - u) * (1 - u) * P0.y + 2 * (1 - u) * u * Cp.y + u * u * P1.y
  });
  const m = bez(dp), m2 = bez(Math.min(1, dp + 0.02));
  const ang = Math.atan2(m2.y - m.y, m2.x - m.x) * 180 / Math.PI;
  return (
    <g>
      <path d={`M${P0.x} ${P0.y} Q${Cp.x} ${Cp.y} ${P1.x} ${P1.y}`} pathLength="1" stroke={C.steel} strokeWidth="1.6" strokeDasharray="0.045 0.03" opacity="0.7" clipPath="none" style={{ strokeDashoffset: 0 }} strokeDashoffset={0} clipRule="nonzero" strokeOpacity={dp > 0 ? 0.8 : 0} />
      <g transform={`translate(${m.x} ${m.y}) rotate(${ang})`} opacity={clamp01((t - 0.8) / 0.2)}>
        <path d="M-9 5 L11 0 L-9 -5 L-4 0 Z" fill={C.steel700} />
      </g>
      <g opacity={clamp01((t - 0.5) / 0.3)}>
        <circle cx={P0.x} cy={P0.y} r="6" stroke={C.steel700} strokeWidth="1.6" />
        <text x={P0.x - 12} y={P0.y + 26} fontFamily={HEAD} fontSize="13" letterSpacing="2" fill={C.faint}>UK</text>
      </g>
      <g opacity={clamp01((t - 1.9) / 0.4)}>
        <circle cx={P1.x} cy={P1.y} r="6" stroke={C.steel700} strokeWidth="1.6" />
        <text x={P1.x - 10} y={P1.y + 30} fontFamily={HEAD} fontSize="13" letterSpacing="2" fill={C.faint}>NL</text>
      </g>
    </g>
  );
}

function DroneIcon({ t }) {
  const d1 = MOTION.draw(t, 0.7, 0.8);
  const spin = t * 540;
  const arms = [[68, 48], [252, 48], [68, 172], [252, 172]];
  return (
    <g>
      {dashed('M136 96 L184 96 L184 124 L136 124 Z', d1)}
      {arms.map((a, i) => dashed(`M160 110 L${a[0]} ${a[1]}`, d1, { key: 'a' + i }))}
      {arms.map((a, i) => (
        <g key={'r' + i} opacity={clamp01((t - 1.3 - i * 0.1) / 0.3)}>
          <circle cx={a[0]} cy={a[1]} r="24" stroke={C.steel} strokeWidth="1.4" opacity="0.7" />
          <g transform={`rotate(${spin} ${a[0]} ${a[1]})`}>
            <line x1={a[0] - 22} y1={a[1]} x2={a[0] + 22} y2={a[1]} stroke={C.steel700} strokeWidth="1.6" />
          </g>
        </g>
      ))}
    </g>
  );
}

function StepsIcon({ t }) {
  const d1 = MOTION.draw(t, 0.7, 1.1);
  return (
    <g>
      {dashed('M36 190 L124 190 L124 136 L212 136 L212 82 L292 82', d1)}
      <path d="M292 82 L280 74 M292 82 L280 90" pathLength="1" stroke={C.steel700} strokeWidth="1.6" strokeDasharray="1" strokeDashoffset={1 - MOTION.draw(t, 1.7, 0.3)} />
      <circle cx="80" cy="172" r="9" stroke={C.steel} strokeWidth="1.6" opacity={clamp01((t - 1.0) / 0.3)} />
      <circle cx="168" cy="118" r="9" stroke={C.steel} strokeWidth="1.6" opacity={clamp01((t - 1.25) / 0.3)} />
      <circle cx="252" cy="64" r="9" stroke={C.steel} strokeWidth="1.6" opacity={clamp01((t - 1.5) / 0.3)} />
    </g>
  );
}

function MediaIcon({ t }) {
  const d1 = MOTION.draw(t, 0.7, 0.9);
  const bars = [0, 1, 2, 3, 4];
  return (
    <g>
      {dashed('M30 56 L214 56 L214 176 L30 176 Z', d1)}
      <path d="M108 92 L108 140 L146 116 Z" fill={C.steel700} opacity={clamp01((t - 1.4) / 0.35)} />
      {bars.map((i) => {
        const h = 22 + Math.abs(Math.sin(t * 2.2 + i * 1.1)) * 46;
        return <line key={i} x1={244 + i * 13} y1={116 + h / 2} x2={244 + i * 13} y2={116 - h / 2} stroke={C.steel} strokeWidth="5" opacity={clamp01((t - 1.6 - i * 0.08) / 0.3)} />;
      })}
    </g>
  );
}

// ── scenes ──
function TitleScene() {
  const { localTime: t, progress: p, dur } = useScene();
  const ex = exitFade(t, dur);
  const rule = MOTION.draw(t, 0.8, 0.8);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: BODY, color: C.ink }}>
      <SheetChrome lit={0} wobble={p} />
      <div style={{ position: 'absolute', inset: '90px 70px 96px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: ex, transform: `translateY(${(1 - ex) * -16}px)` }}>
        <div style={{ ...MOTION.pop(t, 0.25), fontFamily: HEAD, fontWeight: 600, fontSize: 15, letterSpacing: '0.24em', color: C.steel700, border: `1px solid ${C.line}`, padding: '7px 16px' }}>RAKSHITH BANGALORE</div>
        <div style={{ ...MOTION.enter(t, 0.5), fontFamily: HEAD, fontWeight: 600, fontSize: 150, lineHeight: 0.94, letterSpacing: '0.005em', color: C.steel900, margin: '26px 0 22px' }}>UNIVERSITY LIFE</div>
        <div style={{ width: 340 * rule, height: 1, background: C.steel, marginBottom: 20 }}></div>
        <div style={{ ...MOTION.enter(t, 1.15), fontSize: 19, color: C.faint }}>Four years at Nottingham Trent University, beyond the degree.</div>
      </div>
    </div>
  );
}

function BuiltScene() {
  const s = useScene();
  return <ChapterLayer idx={1} head="BUILT" t={s.localTime} p={s.progress} dur={s.dur}
    rows={[['Aircraft cabin lab', 'Two years on an Embraer ERJ 145, made a laboratory'], ['Acoustics, vibration and visuals', 'Studio speakers, bass shakers, exterior screens'], ['EU Clean Sky 2 · Comfdemo', 'A platform for aviation comfort research']]}
    caption="ERJ 145 · THREE SYSTEMS · ONE LAB" icon={<PlaneIcon t={s.localTime} />} />;
}

function ResearchScene() {
  const s = useScene();
  return <ChapterLayer idx={2} head="RESEARCH" t={s.localTime} p={s.progress} dur={s.dur}
    rows={[['TurboProp comfort dynamics', 'How a cabin feels, measured and modelled'], ['A charter aircraft to the Netherlands', 'Flight research that left the lab'], ['Summer research scholarship', 'Signal equalisation in MATLAB, CUDA-accelerated']]}
    caption="FROM THE LAB TO A REAL FLIGHT" icon={<FlightIcon t={s.localTime} />} />;
}

function FoundedScene() {
  const s = useScene();
  return <ChapterLayer idx={3} head="FOUNDED" t={s.localTime} p={s.progress} dur={s.dur}
    rows={[['Robotics club', 'Started it, then ran it'], ['Drone society', 'Built a community of builders']]}
    caption="TWO SOCIETIES · FROM ZERO" icon={<DroneIcon t={s.localTime} />} />;
}

function MentoredScene() {
  const s = useScene();
  return <ChapterLayer idx={4} head="MENTORED" t={s.localTime} p={s.progress} dur={s.dur}
    rows={[['CERT student mentor', 'Then lead student mentor'], ['Student ambassador', 'Open-day talks and campus tours']]}
    caption="MENTOR · LEAD MENTOR · AMBASSADOR" icon={<StepsIcon t={s.localTime} />} />;
}

function MadeScene() {
  const s = useScene();
  return <ChapterLayer idx={5} head="MADE" t={s.localTime} p={s.progress} dur={s.dur}
    rows={[['Social media content', 'Filmed, cut and published'], ['A YouTube channel', 'Engineering, shared as it happened'], ['Learning designer', 'Online learning assets for the university']]}
    caption="CONTENT · CHANNEL · COURSEWARE" icon={<MediaIcon t={s.localTime} />} />;
}

function CloseScene() {
  const { localTime: t, progress: p, dur } = useScene();
  const ex = exitFade(t, dur);
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: BODY, color: C.ink }}>
      <SheetChrome lit={5} wobble={p} />
      <div style={{ position: 'absolute', inset: '90px 70px 96px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: ex, transform: `translateY(${(1 - ex) * -16}px)` }}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 30 }}>
          {CHAPTERS.map((c, i) => (
            <div key={c} style={{ ...MOTION.pop(t, 0.2 + i * 0.12), fontFamily: HEAD, fontWeight: 600, fontSize: 14, letterSpacing: '0.14em', color: C.steel700, border: `1px solid ${C.line}`, padding: '6px 12px' }}>{c}</div>
          ))}
        </div>
        <div style={{ ...MOTION.enter(t, 0.9), fontFamily: HEAD, fontWeight: 600, fontSize: 130, lineHeight: 0.95, color: C.steel900 }}>AND MORE.</div>
        <div style={{ ...MOTION.enter(t, 1.35), fontSize: 20, color: C.steel700, marginTop: 22, letterSpacing: '0.06em' }}>bkrakshith.com</div>
      </div>
    </div>
  );
}

function UniversityLifeVideo() {
  const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <SceneStage width={1280} height={720} bg={C.bg} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        {{ Title: TitleScene, Built: BuiltScene, Research: ResearchScene, Founded: FoundedScene, Mentored: MentoredScene, Made: MadeScene, Close: CloseScene }}
      </SceneStage>
      <window.TweaksPanel>
        <window.TweakSection label="Timeline" />
        <window.TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </window.TweaksPanel>
    </div>
  );
}
window.UniversityLifeVideo = UniversityLifeVideo;
