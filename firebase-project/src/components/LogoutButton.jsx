import { signOut } from 'firebase/auth'
import { auth } from '../repositories/firebase/config'
import { useNavigate } from 'react-router'

export default function LogoutButton({ className = 'btn danger sm' }) {
    const navigate = useNavigate()
    const handle = async () => {
        await signOut(auth)
        navigate('/login', { replace: true })
    }
    return <button className={className} onClick={handle}>Cerrar sesión</button>
}
