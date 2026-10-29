import React, { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

type AppStatus = 'verifying' | 'online' | 'error';

const RETRY_MS = 5000; // reintento automático cuando no hay conexión
const MIN_CHECK_MS = 600; // evita parpadeos si la API responde muy rápido

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Frases de la tarjeta que asoma detrás del login (edítalas a tu gusto)
const SLOGANS = ['La cocina veloz.', 'Más rápido es mejor.', 'Pensado para la cocina.', 'A tiempo'];
const SLOGAN_MS = 4000;

const Login: React.FC = () => {
  const { login, isLoading, authError, validationErrors } = useAuth();

  const [usuarioOCorreo, setUsuarioOCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const [appStatus, setAppStatus] = useState<AppStatus>('verifying');
  const [isChecking, setIsChecking] = useState(false);

  const mounted = useRef(true);
  const userInputRef = useRef<HTMLInputElement>(null);
  const [sloganIdx, setSloganIdx] = useState(0);

  // Rota las frases; si el sistema pide menos movimiento, queda fija la primera
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSloganIdx((i) => (i + 1) % SLOGANS.length), SLOGAN_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const verifyAPI = useCallback(async () => {
    setIsChecking(true);
    const [isOnline] = await Promise.all([authService.checkHealth(), wait(MIN_CHECK_MS)]);
    if (!mounted.current) return;
    setAppStatus(isOnline ? 'online' : 'error');
    setIsChecking(false);
  }, []);

  // Primera verificación al abrir la pantalla
  useEffect(() => {
    verifyAPI();
  }, [verifyAPI]);

  // Si no hay conexión, reintenta solo (la cocina no debería depender de un botón)
  useEffect(() => {
    if (appStatus !== 'error' || isChecking) return;
    const id = setTimeout(verifyAPI, RETRY_MS);
    return () => clearTimeout(id);
  }, [appStatus, isChecking, verifyAPI]);

  // Cuando aparece el formulario, el cursor ya queda en el usuario
  useEffect(() => {
    if (appStatus === 'online') userInputRef.current?.focus();
  }, [appStatus]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!usuarioOCorreo.trim() || !password) {
      setLocalError('Escribe tu usuario y tu contraseña para continuar.');
      return;
    }

    await login({ usuarioOCorreo: usuarioOCorreo.trim(), password });
  };

  const userInvalid = !!validationErrors?.UsuarioOCorreo || (!!localError && !usuarioOCorreo.trim());
  const passInvalid = !!validationErrors?.Password || (!!localError && !password);

  const inputBase =
    'w-full bg-cream text-ink placeholder-ink/60 font-bold text-lg px-5 py-4 rounded-2xl ' +
    'outline-none border-2 transition-colors disabled:opacity-60 ' +
    'focus:border-ink focus-visible:ring-4 focus-visible:ring-ink/25';

  const errorMessage = localError || authError;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-night font-sans p-6 select-none">
      <div className="relative w-full max-w-md lg:max-w-lg mt-20">
        {/* TARJETA TRASERA: asoma por arriba con las frases */}
        <div
          aria-hidden="true"
          className="absolute inset-x-5 -top-[4.5rem] h-40 -rotate-2 origin-bottom-left rounded-[2.5rem] bg-cream"
        >
          <div className="relative h-[4.5rem] px-8 overflow-hidden">
            {SLOGANS.map((text, i) => (
              <p
                key={text}
                className={`absolute inset-x-8 top-4 text-xl sm:text-2xl font-black text-ink tracking-tight transition-all duration-500 motion-reduce:transition-none ${
                  i === sloganIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* TARJETA COLOR-BLOCKING */}
        <div className="relative z-10 bg-brand w-full rounded-[2.5rem] p-8 sm:p-10 shadow-2xl flex flex-col">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-ink tracking-tight leading-none mb-2">
            LeoKitchen
            <br />
            Fasti
          </h1>
          <p className="text-ink font-bold text-sm">Sistema KDS </p>
        </header>

        {appStatus === 'verifying' && (
          <div className="flex items-center gap-4 py-10" role="status" aria-live="polite">
            <div className="w-8 h-8 border-4 border-ink/30 border-t-ink rounded-full animate-spin motion-reduce:animate-none" />
            <span className="text-ink font-black text-lg">Conectando con el servidor…</span>
          </div>
        )}

        {appStatus === 'error' && (
          <div className="flex flex-col items-start py-6" role="alert">
            <h2 className="text-2xl text-ink font-black mb-2">Sin conexión con el servidor</h2>
            <p className="text-ink font-bold text-sm">
              Revisa que la API esté encendida y que estés en la misma red. Se reintenta solo cada{' '}
              {RETRY_MS / 1000} segundos.
            </p>
            <button
              type="button"
              onClick={verifyAPI}
              disabled={isChecking}
              className="mt-6 bg-ink text-brand font-black py-3 px-6 rounded-full active:scale-95 transition-transform disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-ink/40 outline-none"
            >
              {isChecking ? 'Reintentando…' : 'Reintentar ahora'}
            </button>
          </div>
        )}

        {appStatus === 'online' && (
          <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-5">
            {errorMessage && (
              <div
                role="alert"
                className="bg-ink text-cream p-4 rounded-2xl font-bold text-sm flex items-start gap-3"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="w-5 h-5 shrink-0 mt-px text-brand"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" d="M12 7.5v5.5M12 16.5h.01" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Usuario */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="usuario" className="text-ink font-black text-sm pl-2">
                ID de usuario
              </label>
              <input
                id="usuario"
                ref={userInputRef}
                type="text"
                value={usuarioOCorreo}
                onChange={(e) => setUsuarioOCorreo(e.target.value)}
                disabled={isLoading}
                aria-invalid={userInvalid}
                className={`${inputBase} ${userInvalid ? 'border-ink ring-4 ring-ink/25' : 'border-transparent'}`}
                placeholder="Ej. cocina_1"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-ink font-black text-sm pl-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  aria-invalid={passInvalid}
                  className={`${inputBase} pr-16 ${passInvalid ? 'border-ink ring-4 ring-ink/25' : 'border-transparent'}`}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-xl text-ink/60 hover:text-ink transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ink/25"
                >
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-ink text-brand hover:bg-night font-black text-xl py-5 rounded-[2rem] transition-all active:scale-95 disabled:opacity-60 disabled:active:scale-100 shadow-xl outline-none focus-visible:ring-4 focus-visible:ring-ink/40"
            >
              {isLoading ? 'Iniciando…' : 'Iniciar turno'}
            </button>
          </form>
        )}
        </div>
      </div>

      {/* Estado del servidor, siempre a la vista */}
      <p className="mt-6 text-cream/60 text-sm font-bold flex items-center gap-2" aria-live="polite">
        <span
          className={`w-2.5 h-2.5 rounded-full ${appStatus === 'online' ? 'bg-cream' : 'bg-brand'}`}
          aria-hidden="true"
        />
        {appStatus === 'online' ? 'Servidor conectado' : appStatus === 'error' ? 'Sin conexión' : 'Verificando…'}
      </p>
    </div>
  );
};

export default Login;