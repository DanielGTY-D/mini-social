import { ToastContainer } from 'react-toastify'
import styles from './mainLayout.module.css'
import { Link, Outlet, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import useProfile from '../../features/user/profile/hooks/useProfile'
import { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const MainLayout = () => {
    const { getUser } = useProfile()
    const [isLogged, setIsLogged] = useState(false);
    const token = localStorage.getItem("AUTH_TOKEN")
    const navigate = useNavigate();

    const handleCloseSesion = () => {
        localStorage.removeItem("AUTH_TOKEN");
    }

    const handleChange = (value) => {
        navigate(`${value}`)
    }

    const { data } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        refetchOnWindowFocus: false,
        enabled: isLogged ? true : false,
    })

    useEffect(() => {
        if (token) { setIsLogged(true) } else { setIsLogged(false); }
    }, [token])

    return (
        <>
            <ToastContainer />
            <header className={styles.header}>
                <div className={styles['logo']}>
                    <img className={styles['logo-img']} src="https://images.unsplash.com/photo-1688494930098-e88c53c26e3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="logo" width={"130"} height={"100"} />
                </div>

                <div className={styles['search-bar']}>
                    <input className={styles['search-bar-input']} type="text" placeholder='Busca a tus amigos o publicaciones' />
                </div>


                {
                    isLogged ? (

                        <div className={styles.opt}>
                            <Link to="/admin/profile"><p>{data && data.username}</p></Link>



                            <button className={styles["close-sesion"]} onClick={handleCloseSesion}>Cerrar Sesion</button>
                        </div>
                    ) : (

                        <div className={styles.opt}>
                            <Link to="/auth/register">Registrarse</Link>
                            <Link to="/auth/login">Iniciar sesion</Link>
                        </div>
                    )
                }
            </header>

            <div className={styles['main-content']}>
                <aside className={styles.aside}>
                    <ul className={styles['links-list']}>
                        <li className={styles.link}>
                            <Link to={"/home"}>Inicio</Link>
                        </li>
                        <li className={styles.link}>
                            <Link to={"/admin/profile"}>Mi Perfil</Link>
                        </li>
                        <li className={styles.link}>
                            <Link to={""}>Mensajes</Link>
                        </li>
                        <li className={styles.link}>
                            <Link to={""}>Notificaciones</Link>
                        </li>
                    </ul>
                </aside>

                <Select onValueChange={handleChange}>
                    <SelectTrigger  className="w-[180px] absolute -top-15 right-[2rem] md:invisible">
                        <SelectValue placeholder="Home" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="/home" className='text-lg'>Inicio</SelectItem>
                        <SelectItem value="/admin/profile" className='text-lg'>Mi Perfil</SelectItem>
                        <SelectItem value="/" className='text-lg'>Mensajes</SelectItem>
                        <SelectItem value="/" className='text-lg'>Notificaciones</SelectItem>
                    </SelectContent>
                </Select>

                <Outlet />
            </div>
        </>
    )
}

export default MainLayout;