'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/store';
import { useRouter } from 'next/router';
import { login } from '@/store/adminSlice';
import {
  IconEye, IconEyeOff, IconMail, IconLock, IconArrowRight,
  IconMicrophone2, IconShieldCheck, IconHeadphones, IconMusic,
  IconWaveSine, IconVinyl, IconSpeakerphone, IconBroadcast,
  IconPlayerPlay, IconVolume,
} from '@tabler/icons-react';
import { projectName } from '@/utils/config';

interface RootState {
  admin: { isAuth: boolean; admin: Object };
}

const BG_ICONS = [
  { Icon: IconMicrophone2,  top: '8%',  left: '4%',   size: 38, rot: -15 },
  { Icon: IconHeadphones,   top: '12%', left: '88%',  size: 44, rot: 12  },
  { Icon: IconMusic,        top: '30%', left: '92%',  size: 32, rot: -8  },
  { Icon: IconVinyl,        top: '55%', left: '6%',   size: 48, rot: 20  },
  { Icon: IconWaveSine,     top: '70%', left: '85%',  size: 36, rot: -5  },
  { Icon: IconSpeakerphone, top: '20%', left: '78%',  size: 30, rot: 10  },
  { Icon: IconBroadcast,    top: '75%', left: '14%',  size: 34, rot: -12 },
  { Icon: IconPlayerPlay,   top: '42%', left: '3%',   size: 28, rot: 8   },
  { Icon: IconVolume,       top: '85%', left: '75%',  size: 32, rot: -6  },
  { Icon: IconMusic,        top: '5%',  left: '50%',  size: 26, rot: 15  },
  { Icon: IconMicrophone2,  top: '88%', left: '42%',  size: 30, rot: -10 },
  { Icon: IconHeadphones,   top: '48%', left: '95%',  size: 26, rot: 5   },
  { Icon: IconVinyl,        top: '22%', left: '18%',  size: 36, rot: -20 },
  { Icon: IconBroadcast,    top: '60%', left: '55%',  size: 28, rot: 14  },
];

// full-width waveform heights
const WAVE = [
  18,28,42,55,38,62,80,55,70,90,60,75,45,85,65,50,78,40,68,88,
  52,72,35,60,82,48,66,30,58,76,44,64,25,54,74,42,62,86,50,70,
  36,56,78,46,68,92,58,72,38,60,84,54,70,32,62,80,48,66,28,56,
  74,44,64,88,52,68,34,58,76,46,66,90,56,70,40,62,82,50,68,30,
];

export default function Login() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  useSelector((state: RootState) => state.admin);

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error,        setError]        = useState({ email: '', password: '' });
  const [focused,      setFocused]      = useState({ email: false, password: false });

  const handleSubmit = () => {
    const err: any = {};
    if (!email)    err.email    = 'Email is required';
    if (!password) err.password = 'Password is required';
    if (Object.keys(err).length) return setError(err);
    setLoginLoading(true);
    dispatch(login({ email, password }))
      .unwrap().catch(() => {}).finally(() => setLoginLoading(false));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  useEffect(() => {
    if (sessionStorage.getItem('token')) router.replace('/dashboard');
  }, []);

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 52%,#24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',-apple-system,sans-serif",
      position: 'relative', overflow: 'hidden',
      padding: '24px 16px', boxSizing: 'border-box',
    }}>

      {/* ── Ambient blobs ── */}
      <div style={{ position:'absolute', top:-140, left:-140, width:420, height:420, borderRadius:'50%', background:'rgba(99,102,241,0.18)', filter:'blur(90px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-120, right:-120, width:400, height:400, borderRadius:'50%', background:'rgba(139,92,246,0.2)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'45%', left:'8%', width:260, height:260, borderRadius:'50%', background:'rgba(6,182,212,0.09)', filter:'blur(70px)', pointerEvents:'none' }} />

      {/* ── Scattered BG icons ── */}
      {BG_ICONS.map(({ Icon, top, left, size, rot }, i) => (
        <div key={i} style={{
          position: 'absolute', top, left,
          opacity: 0.045,
          transform: `rotate(${rot}deg)`,
          pointerEvents: 'none',
          color: '#fff',
        }}>
          <Icon size={size} />
        </div>
      ))}

      {/* ── Full-width waveform ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 110,
        display: 'flex', alignItems: 'flex-end',
        gap: 3,
        opacity: 0.07,
        pointerEvents: 'none',
        padding: '0 0',
      }}>
        {WAVE.map((h, i) => (
          <div key={i} style={{
            flex: 1,
            height: h,
            background: 'linear-gradient(to top, #a5b4fc, #818cf8)',
            borderRadius: '3px 3px 0 0',
            minWidth: 0,
          }} />
        ))}
      </div>

      {/* ── Card ── */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(255,255,255,0.09)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '44px 40px',
        boxSizing: 'border-box',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo + Brand */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32 }}>
          <div style={{
            width:68, height:68, borderRadius:18,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display:'flex', alignItems:'center', justifyContent:'center',
            marginBottom:14,
            boxShadow:'0 8px 28px rgba(99,102,241,0.5)',
          }}>
            <img src="/images/logo.png" alt="logo" style={{ width:42, height:42, objectFit:'contain' }} />
          </div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 5px', letterSpacing:'-0.4px', textAlign:'center' }}>
            {projectName}
          </h1>
        </div>

        {/* Welcome */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.3px' }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:0, lineHeight:1.65 }}>
            Sign in to manage your studio bookings,<br />earnings and analytics.
          </p>
        </div>

        {/* Email */}
        <div style={{ marginBottom:15 }}>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)', marginBottom:7, letterSpacing:'0.3px' }}>
            Email Address
          </label>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: focused.email ? '#a5b4fc' : 'rgba(255,255,255,0.28)', transition:'color 0.2s', pointerEvents:'none' }}>
              <IconMail size={16} />
            </div>
            <input
              type="email"
              placeholder="admin@podstudio.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError({ ...error, email: e.target.value ? '' : 'Email is required' }); }}
              onFocus={() => setFocused({ ...focused, email: true })}
              onBlur={()  => setFocused({ ...focused, email: false })}
              onKeyDown={handleKeyDown}
              autoComplete="username"
              style={{
                width:'100%', padding:'12px 14px 12px 40px', fontSize:14,
                borderRadius:11, outline:'none', boxSizing:'border-box', transition:'all 0.2s',
                border: error.email ? '1.5px solid #f87171' : focused.email ? '1.5px solid #818cf8' : '1.5px solid rgba(255,255,255,0.13)',
                background: 'rgba(255,255,255,0.08)',
                color:'#fff',
              }}
            />
          </div>
          {error.email && <p style={{ margin:'5px 0 0', fontSize:11.5, color:'#f87171' }}>⚠ {error.email}</p>}
        </div>

        {/* Password */}
        <div style={{ marginBottom:26 }}>
          <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)', marginBottom:7, letterSpacing:'0.3px' }}>
            Password
          </label>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color: focused.password ? '#a5b4fc' : 'rgba(255,255,255,0.28)', transition:'color 0.2s', pointerEvents:'none' }}>
              <IconLock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError({ ...error, password: e.target.value ? '' : 'Password is required' }); }}
              onFocus={() => setFocused({ ...focused, password: true })}
              onBlur={()  => setFocused({ ...focused, password: false })}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              style={{
                width:'100%', padding:'12px 42px 12px 40px', fontSize:14,
                borderRadius:11, outline:'none', boxSizing:'border-box', transition:'all 0.2s',
                border: error.password ? '1.5px solid #f87171' : focused.password ? '1.5px solid #818cf8' : '1.5px solid rgba(255,255,255,0.13)',
                background: 'rgba(255,255,255,0.08)',
                color:'#fff',
              }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.38)', padding:0, display:'flex' }}>
              {showPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
            </button>
          </div>
          {error.password && <p style={{ margin:'5px 0 0', fontSize:11.5, color:'#f87171' }}>⚠ {error.password}</p>}
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loginLoading} style={{
          width:'100%', padding:'13px', borderRadius:12, border:'none',
          cursor: loginLoading ? 'not-allowed' : 'pointer',
          background: loginLoading ? 'rgba(99,102,241,0.45)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          color:'#fff', fontSize:15, fontWeight:700, letterSpacing:'0.2px',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          boxShadow: loginLoading ? 'none' : '0 6px 22px rgba(99,102,241,0.55)',
          transition:'all 0.2s',
        }}>
          {loginLoading ? (
            <>
              <span style={{ width:15, height:15, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
              Signing in...
            </>
          ) : (
            <>Sign In <IconArrowRight size={16} /></>
          )}
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'22px 0 18px' }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.09)' }} />
          <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.28)', fontWeight:600, letterSpacing:'0.8px' }}>SECURE ACCESS</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.09)' }} />
        </div>

        {/* Trust badges */}
        <div style={{ display:'flex', justifyContent:'center', gap:22 }}>
          {[
            { icon:<IconShieldCheck size={13}/>, text:'SSL Encrypted' },
            { icon:<IconMicrophone2 size={13}/>, text:'Studio Verified' },
          ].map((b,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:5, color:'rgba(255,255,255,0.3)', fontSize:11.5, fontWeight:500 }}>
              {b.icon}{b.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position:'absolute', bottom:14, left:0, right:0,
        textAlign:'center', zIndex:2, pointerEvents:'none',
      }}>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.18)', fontWeight:400 }}>
          © {new Date().getFullYear()} {projectName} · Built by{' '}
        </span>
        <a href="http://wavidev.com/" target="_blank" rel="noopener noreferrer"
          style={{ fontSize:11, color:'rgba(165,180,252,0.45)', fontWeight:600, textDecoration:'none', pointerEvents:'all' }}>
          WAVI
        </a>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.22) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 100px #2a2550 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
          border-color: rgba(255,255,255,0.13) !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
