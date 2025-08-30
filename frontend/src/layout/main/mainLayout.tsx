import { ToastContainer } from 'react-toastify'
import styles from './mainLayout.module.css'
import { Link, Outlet } from 'react-router'

const MainLayout = () => {
    const isLogged = localStorage.getItem("AUTH_TOKEN")

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
                            <Link to="/user/profile">Perfil</Link>
                        </div>
                    ) : (

                        <div>
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
                            <Link to={""}>Mi Perfil</Link>
                        </li>
                        <li className={styles.link}>
                            <Link to={""}>Mensajes</Link>
                        </li>
                        <li className={styles.link}>
                            <Link to={""}>Notificaciones</Link>
                        </li>
                        <li className={styles.link}>
                            <Link to={""}>Notificaciones</Link>
                        </li>
                    </ul>
                </aside>

                <Outlet />
            </div>
        </>
    )
}

export default MainLayout;