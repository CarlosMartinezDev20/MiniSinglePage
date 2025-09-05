import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../../repositories/firebase/config'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../repositories/firebase/config'
import LogoutButton from '../../components/LogoutButton.jsx'

const schema = yup.object({
    name: yup.string().required('Nombre requerido'),
    price: yup.number().typeError('Precio numérico').positive('Debe ser > 0').required('Precio requerido'),
    stock: yup.number().typeError('Stock numérico').integer('Entero').min(0, '>= 0').required('Stock requerido')
})

export const Products = () => {
    const [products, setProducts] = useState([])
    const [saving, setSaving] = useState(false)
    const [email, setEmail] = useState('')

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm({ resolver: yupResolver(schema), defaultValues: { name: '', price: '', stock: '' } })

    const getProducts = async () => {
        const snap = await getDocs(collection(db, 'products'))
        const rows = []
        snap.forEach(doc => rows.push({ id: doc.id, ...doc.data() }))
        setProducts(rows)
    }

    const addProduct = async ({ name, price, stock }) => {
        await addDoc(collection(db, 'products'), {
            name: String(name).trim(),
            price: Number(price),
            stock: Number(stock)
        })
    }

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            await addProduct(data)
            reset()
            await getProducts()
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        getProducts()
        const off = onAuthStateChanged(auth, u => setEmail(u?.email || ''))
        return () => off()
    }, [])

    return (
        <div className="app-bg">
            <div className="container py">
                <div className="topbar">
                    <span className="muted small">{email}</span>
                    <LogoutButton />
                </div>

                <h2 className="page-title">Gestión de productos</h2>

                <div className="grid grid-2 grid-centered">
                    <div className="card soft">
                        <h3 className="title">Agregar producto</h3>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input className={`input ${errors.name ? 'invalid' : ''}`} {...register('name')} />
                                {errors.name && <p className="field-error">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-2-sm">
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input className={`input ${errors.price ? 'invalid' : ''}`} {...register('price')} />
                                    {errors.price && <p className="field-error">{errors.price.message}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input className={`input ${errors.stock ? 'invalid' : ''}`} {...register('stock')} />
                                    {errors.stock && <p className="field-error">{errors.stock.message}</p>}
                                </div>
                            </div>

                            <button className="btn success w-100" disabled={saving}>
                                {saving ? 'Guardando…' : 'Guardar'}
                            </button>
                        </form>
                    </div>

                    <div className="card soft">
                        <div className="row-between">
                            <h3 className="title">Listado</h3>
                            <button className="btn outline sm" onClick={getProducts}>Recargar</button>
                        </div>

                        <div className="table-wrap">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr><td colSpan="3" className="muted center py-2">Sin datos</td></tr>
                                    ) : products.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>${Number(p.price).toFixed(2)}</td>
                                            <td>{p.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
