import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../repositories/firebase/config.js'
import PasswordField from '../../components/PasswordField.jsx'

const schema = yup.object({
  email: yup.string().email('Correo inválido').required('Ingresa tu correo'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Ingresa tu contraseña')
})

export default function LoginComponent() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: yupResolver(schema) })

  const onSubmit = async ({ email, password }) => {
    setAuthError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard', { replace: true })
    } catch (e) {
      console.error(e)
      setAuthError('Credenciales inválidas')
    }
  }

  return (
    <div className="app-bg screen-center">
      <div className="container">
        <div className="auth-card card soft">
          <h2 className="title">Iniciar sesión</h2>

          {authError && <div className="alert error">{authError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email" type="email"
                className={`input ${errors.email ? 'invalid' : ''}`}
                placeholder="correo@dominio.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>

            <PasswordField
              id="password"
              label="Contraseña"
              register={register('password')}
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <button className="btn primary w-100 lg" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="small center" style={{ marginTop: 12 }}>
            <span className="muted">¿No tienes cuenta?</span>{' '}
            <Link to="/register">Crear cuenta</Link>
          </p>

          <p className="muted small center">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
