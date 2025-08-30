import { useEffect, useState } from 'react';
import useProfile from '../../hooks/useProfile';
import styles from './headerProfile.module.css';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import UpdateUserModal from '../updateUserModal/UpdateUserModal';

const HeaderProfile = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const { getUser, getUserByID } = useProfile();
    const [openModal, setOpenModal] = useState(false);
    // const [profileID, setProfileID] = useState<string | undefined>();
    const isLogged = localStorage.getItem("AUTH_TOKEN");



    const handleOpenModal = () => {
        setOpenModal(!openModal)
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: id ? ['user', id] : ["user"],
        queryFn: () => (id ? getUserByID(id) : getUser()),
        refetchOnWindowFocus: false,
        enabled: true,
    })

    console.log(data)

    useEffect(() => {
        // setProfileID(id);

        if (!isLogged) {
            navigate("/home");
        }
        // handleProfileID(id)
    }, [isLogged])

    return (
        <>
            <div className={styles['header-container']}>
                <div className={styles['banner']}>
                    <img className={styles['banner-img']} src="https://images.unsplash.com/photo-1719253480609-579ad1622c65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="banner" />
                </div>

                <div className={styles.info}>
                    {
                        data && (
                            <>
                                <h2 className={styles.username}>{data.username}</h2>

                                <p className={styles['bio']}>{data.bio}</p>

                                <div className={styles['social-info']}>
                                    <p className={styles.followers}><span>Followers: </span>{data.followers.length}</p>
                                    <p className={styles.following}><span>Following: </span>{data.following.length}</p>
                                </div>
                            </>
                        )
                    }

                    <div className={styles['opts-container']}>
                        {
                            id !== undefined && (
                                <button className={styles['follow-btn']}>Follow</button>
                            )
                        }
                    </div>

                    {id === undefined && <button className={styles['update-profile']} onClick={handleOpenModal}>{openModal ? "Cerrar Ventana" : "Actualizar perfil"}</button>}

                    {
                        openModal && (
                            <UpdateUserModal isOpen={openModal} />
                        )
                    }
                </div>


            </div>
        </>
    )
}

export default HeaderProfile;