import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import styles from './authLayout.module.css';


const AuthLayout = () => {
    return (
        <>
            <ToastContainer />
            <div className={styles.background}>

                <div className={styles.container}>
                    <div>
                        <h1 className={styles.title}>Bienvenido a <span>DEV's</span> Network</h1>
                        <p className={styles['sub-title']}>Donde podras conectar con mas DEV's como tu</p>
                    </div>

                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default AuthLayout;