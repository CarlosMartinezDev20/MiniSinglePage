import { useState } from 'react'

export default function PasswordField({
    id, label, register, error,
    placeholder = '••••••••',
    autoComplete = 'current-password'
}) {
    const [show, setShow] = useState(false)
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <div className="input-wrap">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    className={`input ${error ? 'invalid' : ''}`}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    {...register}
                />
                <button
                    type="button"
                    className="btn-eye"
                    aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={show}
                    onClick={() => setShow(s => !s)}
                >
                    {show ? (
                        /* eye-off */
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.09A11.9 11.9 0 0112 5c5.52 0 9.5 5 9.5 7-0 0-1.27 2.09-3.57 3.83M6.06 6.06C4 7.53 2.5 9.65 2.5 12c0 0 2.98 7 9.5 7a11.7 11.7 0 004.12-.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        /* eye */
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M2.5 12s3-7 9.5-7 9.5 7 9.5 7-3 7-9.5 7S2.5 12 2.5 12z" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    )}
                </button>
            </div>
            {error && <p className="field-error">{error}</p>}
        </div>
    )
}
