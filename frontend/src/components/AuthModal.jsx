import React, { useState } from 'react';
import { Brain, UserCheck, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { sound } from '../utils/sound';

export default function AuthModal({ isOpen, onClose, onGuestLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playClick();
    const user = {
      name: name || (email ? email.split('@')[0] : 'Kullanıcı'),
      email: email || 'user@lunosity.com',
      avatar: '👨‍🎓',
      isGuest: false,
    };
    localStorage.setItem('lunosity_user', JSON.stringify(user));
    onClose();
  };

  const handleGuest = () => {
    sound.playClick();
    onGuestLogin();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white border-[3px] border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-black bg-neo-pink hover:bg-black hover:text-white transition-all shadow-brutal-sm"
        >
          <X size={18} />
        </button>

        {/* LOGO & TITLE */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neo-yellow border-2 border-black flex items-center justify-center text-black font-black text-2xl shadow-brutal mb-3">
            <Brain size={30} />
          </div>
          <h2 className="text-2xl font-black text-black">
            {mode === 'login' ? 'Tekrar Hoş Geldin!' : 'Aramıza Katıl'}
          </h2>
          <p className="text-xs text-slate-700 font-bold mt-1">
            Zihnini güçlendir, performansını toplulukla kıyasla!
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-black uppercase mb-1 block">Ad Soyad</label>
              <input
                type="text"
                required
                placeholder="Örn: Ahmet Yılmaz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neo-bg border-2 border-black rounded-xl p-3 text-sm font-bold shadow-brutal-sm focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-black uppercase mb-1 block">E-Posta Adresi</label>
            <input
              type="email"
              required
              placeholder="eposta@adresi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neo-bg border-2 border-black rounded-xl p-3 text-sm font-bold shadow-brutal-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase mb-1 block">Şifre</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neo-bg border-2 border-black rounded-xl p-3 text-sm font-bold shadow-brutal-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-neo-yellow border-2 border-black rounded-xl font-black text-base shadow-brutal hover:bg-black hover:text-neo-yellow transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <UserCheck size={18} />
            <span>{mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}</span>
          </button>
        </form>

        {/* TOGGLE LOGIN/REGISTER */}
        <div className="text-center mt-4 text-xs font-bold text-slate-700">
          {mode === 'login' ? (
            <span>
              Hesabın yok mu?{' '}
              <button
                onClick={() => setMode('register')}
                className="underline font-black text-black hover:text-neo-blue"
              >
                Kayıt Ol
              </button>
            </span>
          ) : (
            <span>
              Zaten hesabın var mı?{' '}
              <button
                onClick={() => setMode('login')}
                className="underline font-black text-black hover:text-neo-blue"
              >
                Giriş Yap
              </button>
            </span>
          )}
        </div>

        {/* GUEST ACCESS OPTION (Referans Görsel 1 & Topluluk İsteği) */}
        <div className="pt-4 mt-4 border-t-2 border-black text-center">
          <div className="sticker-tag bg-neo-green mb-3">
            <ShieldCheck size={12} className="inline mr-1" /> KİLSİZ & %100 ÜCRETSİZ ACCESS
          </div>
          <button
            onClick={handleGuest}
            className="w-full py-3 bg-neo-blue border-2 border-black rounded-xl font-black text-sm shadow-brutal hover:bg-black hover:text-neo-blue transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Misafir Oturumu İle Devam Et</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
