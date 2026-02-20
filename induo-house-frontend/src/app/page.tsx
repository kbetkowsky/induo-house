'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import { PropertyListResponse, PageResponse, SearchParams } from '@/types/property';
import {
  Search, MapPin, Building2, Home, Trees, Briefcase,
  TrendingUp, Shield, Headphones, ChevronRight, ArrowRight,
  Star
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchLatest(): Promise<PropertyListResponse[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/properties/search?page=0&size=6&sort=createdAt,desc`,
      { credentials: 'include', cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.content ?? [];
  } catch { return []; }
}

async function fetchStats(): Promise<{ total: number; cities: number; agents: number }> {
  try {
    const res = await fetch(
      `${API_BASE}/api/properties/search?page=0&size=1`,
      { credentials: 'include', cache: 'no-store' }
    );
    if (!res.ok) return { total: 0, cities: 0, agents: 0 };
    const data = await res.json();
    const total = data.totalElements ?? 0;
    return { total, cities: Math.max(1, Math.round(total * 0.35)), agents: Math.max(1, Math.round(total * 0.18)) };
  } catch { return { total: 0, cities: 0, agents: 0 }; }
}

function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (target === 0 || started.current) return;
    started.current = true;
    const steps = 40;
    const step = duration / steps;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVal(Math.round((target * i) / steps));
      if (i >= steps) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

const CATEGORIES = [
  { label: 'Mieszkania',   icon: Building2,  type: 'APARTMENT', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  { label: 'Domy',         icon: Home,        type: 'HOUSE',     color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  { label: 'Działki',      icon: Trees,       type: 'LAND',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  { label: 'Komercyjne',   icon: Briefcase,   type: 'COMMERCIAL',color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
];

const FEATURES = [
  { icon: TrendingUp,   title: 'Tysiące ofert',    desc: 'Największa baza nieruchomości w Polsce — mieszkania, domy, działki, lokale.',    color: '#3b82f6' },
  { icon: Shield,       title: 'Zweryfikowane',    desc: 'Każde ogłoszenie przechodzi weryfikację. Kupujesz i wynajmujesz bezpiecznie.',     color: '#10b981' },
  { icon: Headphones,   title: 'Wsparcie 7/7',     desc: 'Nasz zespół ekspertów jest do Twojej dyspozycji każdego dnia tygodnia.',          color: '#f59e0b' },
];

const TESTIMONIALS = [
  { name: 'Anna K.',   role: 'Kupująca',    text: 'Znalazłam wymarzone mieszkanie w 3 dni. Niesamowite filtry i super obsługa!', stars: 5 },
  { name: 'Marek W.',  role: 'Agent',        text: 'Jako pośrednik bardzo cenię InduoHouse za łatwe dodawanie ofert i szeroki zasięg.', stars: 5 },
  { name: 'Zofia P.',  role: 'Wynajmująca', text: 'Szybko, prosto i bezpiecznie. Polecam każdemu kto szuka mieszkania.',            stars: 5 },
];

export default function HomePage() {
  const router = useRouter();
  const [city, setCity]           = useState('');
  const [txType, setTxType]       = useState('');
  const [propType, setPropType]   = useState('');
  const [latest, setLatest]       = useState<PropertyListResponse[]>([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [stats, setStats]         = useState({ total: 0, cities: 0, agents: 0 });
  const [heroLoaded, setHeroLoaded] = useState(false);

  const countTotal  = useCountUp(stats.total);
  const countCities = useCountUp(stats.cities);
  const countAgents = useCountUp(stats.agents);

  useEffect(() => {
    setHeroLoaded(true);
    fetchLatest().then(d => { setLatest(d); setLoadingLatest(false); });
    fetchStats().then(setStats);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (city)     p.set('city', city);
    if (txType)   p.set('transactionType', txType);
    if (propType) p.set('propertyType', propType);
    router.push(`/properties?${p.toString()}`);
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes gradAnim { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes float    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes blobMove {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(30px,-20px) scale(1.05); }
          66%     { transform: translate(-20px,15px) scale(0.97); }
        }
        .hero-blob {
          position:absolute; border-radius:50%; filter:blur(80px);
          animation: blobMove 12s ease-in-out infinite;
          pointer-events:none;
        }
        .category-card {
          display:flex; flex-direction:column; align-items:center; gap:12px;
          padding:28px 20px; border-radius:18px;
          border:1px solid var(--border-card);
          background:var(--bg-surface);
          cursor:pointer; text-decoration:none;
          transition:transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          box-shadow: var(--shadow-card);
        }
        .category-card:hover {
          transform:translateY(-6px);
          box-shadow:var(--shadow-card-hover);
          border-color:var(--border-hover);
        }
        .feature-card {
          padding:28px; border-radius:18px;
          border:1px solid var(--border-card);
          background:var(--bg-surface);
          box-shadow:var(--shadow-card);
          transition:transform 0.25s, box-shadow 0.25s;
        }
        .feature-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-card-hover); }
        .testimonial-card {
          padding:24px; border-radius:16px;
          border:1px solid var(--border-card);
          background:var(--bg-surface);
          box-shadow:var(--shadow-card);
        }
        .search-input {
          width:100%; padding:13px 16px;
          background:rgba(255,255,255,0.1);
          border:1px solid rgba(255,255,255,0.2);
          border-radius:12px; color:#fff;
          font-size:14px; font-family:inherit;
          outline:none; transition:border-color 0.2s, background 0.2s;
          backdrop-filter:blur(4px);
        }
        .search-input::placeholder { color:rgba(255,255,255,0.5); }
        .search-input:focus { border-color:rgba(255,255,255,0.5); background:rgba(255,255,255,0.15); }
        .search-select {
          width:100%; padding:13px 16px;
          background:rgba(255,255,255,0.1);
          border:1px solid rgba(255,255,255,0.2);
          border-radius:12px; color:#fff;
          font-size:14px; font-family:inherit;
          outline:none; appearance:none;
          backdrop-filter:blur(4px);
          cursor:pointer;
        }
        .search-select option { background:#1e293b; color:#f1f5f9; }
        .search-btn {
          padding:13px 28px;
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          border:none; border-radius:12px;
          color:#fff; font-size:15px; font-weight:700;
          cursor:pointer; white-space:nowrap;
          display:flex; align-items:center; gap:8px;
          transition:opacity 0.2s, transform 0.2s;
          font-family:inherit;
          box-shadow:0 4px 20px rgba(37,99,235,0.5);
        }
        .search-btn:hover { opacity:0.9; transform:translateY(-1px); }
        .stat-item {
          text-align:center; padding:0 24px;
        }
        .stat-item + .stat-item {
          border-left:1px solid rgba(255,255,255,0.12);
        }
        .section-label {
          font-size:11px; font-weight:800;
          text-transform:uppercase; letter-spacing:0.12em;
          color:var(--accent-bright); margin-bottom:10px;
        }
        .section-title {
          font-size:clamp(1.6rem,3vw,2.2rem);
          font-weight:800; letter-spacing:-0.025em;
          color:var(--text-primary); line-height:1.2;
        }
        @media (max-width:768px) {
          .hero-search-grid { grid-template-columns:1fr !important; }
          .categories-grid  { grid-template-columns:1fr 1fr !important; }
          .features-grid    { grid-template-columns:1fr !important; }
          .stats-row        { flex-direction:column; gap:20px !important; }
          .stat-item + .stat-item { border-left:none; border-top:1px solid rgba(255,255,255,0.12); padding-top:20px; }
        }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg,#020818 0%,#0a1628 40%,#0d1f3c 70%,#091428 100%)',
        paddingTop:140, paddingBottom:90,
      }}>
        {/* Animated blobs */}
        <div className="hero-blob" style={{ width:520, height:520, background:'rgba(37,99,235,0.18)', top:-100, left:-120, animationDelay:'0s' }} />
        <div className="hero-blob" style={{ width:400, height:400, background:'rgba(139,92,246,0.12)', top:80, right:-80,  animationDelay:'-4s' }} />
        <div className="hero-blob" style={{ width:300, height:300, background:'rgba(16,185,129,0.08)', bottom:-60, left:'40%', animationDelay:'-8s' }} />

        {/* Subtle grid overlay */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize:'60px 60px',
        }} />

        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>

          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(37,99,235,0.15)', border:'1px solid rgba(59,130,246,0.25)',
            borderRadius:99, padding:'6px 16px', marginBottom:28,
            opacity: heroLoaded ? 1 : 0,
            animation: heroLoaded ? 'fadeIn 0.5s ease 0.1s both' : 'none',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'inline-block', boxShadow:'0 0 8px #4ade80' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.8)', letterSpacing:'0.06em' }}>
              PLATFORMA NIERUCHOMOŚCI #1 W POLSCE
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize:'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight:900, lineHeight:1.1,
            letterSpacing:'-0.035em', color:'#fff',
            marginBottom:22,
            opacity: heroLoaded ? 1 : 0,
            animation: heroLoaded ? 'fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.15s both' : 'none',
          }}>
            Znajdź swoje<br />
            <span style={{
              background:'linear-gradient(135deg,#60a5fa 0%,#a78bfa 60%,#34d399 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text',
            }}>wymarzone miejsce</span>
          </h1>

          <p style={{
            fontSize:'clamp(1rem,2vw,1.15rem)', color:'rgba(255,255,255,0.58)',
            maxWidth:560, lineHeight:1.7, marginBottom:40,
            opacity: heroLoaded ? 1 : 0,
            animation: heroLoaded ? 'fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.25s both' : 'none',
          }}>
            Tysiące ogłoszeń mieszkań, domów i działek w całej Polsce.
            Szybko, bezpiecznie i bezpłatnie.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} style={{
            background:'rgba(255,255,255,0.06)',
            backdropFilter:'blur(20px)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:20, padding:'20px 20px',
            opacity: heroLoaded ? 1 : 0,
            animation: heroLoaded ? 'fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.35s both' : 'none',
          }}>
            <div className="hero-search-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:10, alignItems:'center' }}>
              <div style={{ position:'relative' }}>
                <MapPin size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', pointerEvents:'none' }} />
                <input
                  className="search-input"
                  style={{ paddingLeft:38 }}
                  placeholder="Miasto lub region…"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
              <select className="search-select" value={txType} onChange={e => setTxType(e.target.value)}>
                <option value="">Oferta</option>
                <option value="SALE">Sprzedaż</option>
                <option value="RENT">Wynajem</option>
              </select>
              <select className="search-select" value={propType} onChange={e => setPropType(e.target.value)}>
                <option value="">Typ</option>
                <option value="APARTMENT">Mieszkanie</option>
                <option value="HOUSE">Dom</option>
                <option value="LAND">Działka</option>
                <option value="COMMERCIAL">Komercyjne</option>
              </select>
              <button type="submit" className="search-btn">
                <Search size={16} /> Szukaj
              </button>
            </div>
          </form>

          {/* Stats */}
          {stats.total > 0 && (
            <div className="stats-row" style={{
              display:'flex', alignItems:'center', justifyContent:'center',
              gap:0, marginTop:44,
              opacity: heroLoaded ? 1 : 0,
              animation: heroLoaded ? 'fadeIn 0.7s ease 0.7s both' : 'none',
            }}>
              {[
                { val: countTotal,  label: 'Ogłoszeń',   suffix: '+' },
                { val: countCities, label: 'Miast',       suffix: '+' },
                { val: countAgents, label: 'Agentów',     suffix: '+' },
              ].map(({ val, label, suffix }) => (
                <div key={label} className="stat-item">
                  <div style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', lineHeight:1 }}>
                    {val.toLocaleString('pl-PL')}{suffix}
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:5, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ KATEGORIE ══════════ */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'80px 24px 40px' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <p className="section-label">Szukaj wg kategorii</p>
          <h2 className="section-title">Co Cię interesuje?</h2>
        </div>
        <div className="categories-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {CATEGORIES.map(({ label, icon: Icon, type, color, bg }) => (
            <Link key={type} href={`/properties?propertyType=${type}`} className="category-card">
              <div style={{ width:56, height:56, borderRadius:16, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={26} style={{ color }} />
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{label}</span>
              <span style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
                Przeglądaj <ChevronRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════ NAJNOWSZE OFERTY ══════════ */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'20px 24px 80px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:12 }}>
          <div>
            <p className="section-label">Wieże oferty</p>
            <h2 className="section-title">Najnowsze ogłoszenia</h2>
          </div>
          <Link href="/properties" style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'10px 20px', borderRadius:12,
            background:'var(--bg-surface)', border:'1px solid var(--border-card)',
            color:'var(--text-secondary)', textDecoration:'none',
            fontSize:13, fontWeight:600,
            transition:'border-color 0.2s, color 0.2s',
            boxShadow:'var(--shadow-card)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--accent-bright)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)';  e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Zobacz wszystkie <ArrowRight size={14} />
          </Link>
        </div>

        {loadingLatest ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {Array.from({ length:6 }).map((_, i) => (
              <div key={i} style={{ borderRadius:16, border:'1px solid var(--border-card)', background:'var(--bg-surface)', overflow:'hidden' }}>
                <div className="skeleton" style={{ height:200 }} />
                <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
                  <div className="skeleton" style={{ height:15, borderRadius:6, width:'75%' }} />
                  <div className="skeleton" style={{ height:13, borderRadius:6, width:'50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : latest.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:20 }}>
            {latest.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'60px 24px', borderRadius:18, border:'1px solid var(--border-card)', background:'var(--bg-surface)' }}>
            <Building2 size={48} style={{ color:'var(--text-faint)', margin:'0 auto 16px', display:'block' }} />
            <p style={{ color:'var(--text-muted)', fontSize:15 }}>Brak ogłoszeń</p>
          </div>
        )}
      </section>

      {/* ══════════ DLACZEGO MY ══════════ */}
      <section style={{ background:'var(--bg-surface)', borderTop:'1px solid var(--border-card)', borderBottom:'1px solid var(--border-card)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 24px' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p className="section-label">Dlaczego InduoHouse</p>
            <h2 className="section-title">Wszystko czego potrzebujesz</h2>
            <p style={{ color:'var(--text-muted)', fontSize:15, marginTop:12, maxWidth:480, margin:'14px auto 0' }}>
              Stworzyłiśmy platformę, która łączy kupujących, wynajmujących i agentów w jednym miejscu.
            </p>
          </div>
          <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="feature-card">
                <div style={{ width:52, height:52, borderRadius:14, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)', marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ OPINIE ══════════ */}
      <section style={{ maxWidth:1200, margin:'0 auto', padding:'80px 24px' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <p className="section-label">Opinie użytkowników</p>
          <h2 className="section-title">Co mówią nasi użytkownicy</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {TESTIMONIALS.map(({ name, role, text, stars }) => (
            <div key={name} className="testimonial-card">
              <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={15} style={{ color:'#f59e0b' }} fill="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75, marginBottom:16, fontStyle:'italic' }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff' }}>
                  {name[0]}
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', margin:0 }}>{name}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', margin:0 }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section style={{ padding:'0 24px 80px' }}>
        <div style={{
          maxWidth:1200, margin:'0 auto',
          borderRadius:24,
          background:'linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#7c3aed 100%)',
          padding:'60px 48px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:32,
          position:'relative', overflow:'hidden',
        }}>
          {/* decorative blobs */}
          <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.05)', top:-100, right:100, pointerEvents:'none' }} />
          <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', bottom:-80, right:-40, pointerEvents:'none' }} />

          <div style={{ position:'relative' }}>
            <h2 style={{ fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:900, color:'#fff', margin:'0 0 10px', letterSpacing:'-0.025em' }}>
              Masz nieruchomość do sprzedania?
            </h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:15, margin:0, maxWidth:480 }}>
              Dodaj ogłoszenie w 2 minuty i dotrzyj do tysięcy potencjalnych kupujących.
            </p>
          </div>
          <div style={{ display:'flex', gap:12, flexShrink:0, position:'relative' }}>
            <Link href="/register" style={{
              padding:'13px 28px', borderRadius:12,
              background:'#fff', color:'#1e3a8a',
              textDecoration:'none', fontSize:14, fontWeight:800,
              display:'flex', alignItems:'center', gap:8,
              boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
              transition:'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Dodaj ogłoszenie <ArrowRight size={15} />
            </Link>
            <Link href="/properties" style={{
              padding:'13px 24px', borderRadius:12,
              background:'rgba(255,255,255,0.12)',
              border:'1px solid rgba(255,255,255,0.2)',
              color:'#fff', textDecoration:'none',
              fontSize:14, fontWeight:600,
              backdropFilter:'blur(8px)',
              transition:'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            >
              Przeglądaj oferty
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
