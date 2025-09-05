import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../repositories/firebase/config.js'
import PasswordField from '../../components/PasswordField.jsx'

const schema = yup.object({
    email: yup.string().email('Formato: nombre@dominio.com').required('Correo requerido'),
    password: yup.string().required('Contraseña requerida')
        .min(8, 'Mínimo 8 caracteres')
        .matches(/[A-Z]/, 'Al menos 1 mayúscula')
        .matches(/[a-z]/, 'Al menos 1 minúscula')
        .matches(/[0-9]/, 'Al menos 1 número')
        .matches(/[!@#$%&*?.,_:<>"|]/, 'Al menos 1 carácter especial'),
    confirm_password: yup.string()
        .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña')
})

export default function RegisterComponent() {
    const navigate = useNavigate()
    const [authError, setAuthError] = useState('')
    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm({ resolver: yupResolver(schema) })

    const onSubmit = async ({ email, password }) => {
        setAuthError('')
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            navigate('/dashboard', { replace: true })
        } catch (e) {
            console.error(e)
            setAuthError('No se pudo crear la cuenta')
        }
    }

    return (
        <div className="app-bg screen-center">
            <div className="container">
                <div className="auth-card card soft">
                    <h2 className="title">Crear cuenta</h2>

                    {authError && <div className="alert error">{authError}</div>}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email" type="email"
                                className={`input ${errors.email ? 'invalid' : ''}`}
                                placeholder="nombre@dominio.com"
                                autoComplete="email"
                                {...register('email')}
                            />
                            {errors.email && <p className="field-error">{errors.email.message}</p>}
                        </div>

                        <div className="grid grid-2-sm">
                            <PasswordField
                                id="password"
                                label="Contraseña"
                                register={register('password')}
                                error={errors.password?.message}
                                autoComplete="new-password"
                            />
                            <PasswordField
                                id="confirm_password"
                                label="Confirmar contraseña"
                                register={register('confirm_password')}
                                error={errors.confirm_password?.message}
                                autoComplete="new-password"
                            />
                        </div>

                        <button className="btn primary w-100 lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Creando…' : 'Registrarme'}
                        </button>
                    </form>

                    <p className="small center" style={{ marginTop: 12 }}>
                        <span className="muted">¿Ya tienes cuenta?</span>{' '}
                        <Link to="/login">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
