import { useEffect, useState } from 'react';
import useProfile from '../../hooks/useProfile';
import styles from './headerProfile.module.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import UpdateUserModal from '../updateUserModal/UpdateUserModal';
import { toast } from 'react-toastify';
import type { User } from '../../models/user.model';

const HeaderProfile = () => {
    const queryClient = useQueryClient();
    const { id } = useParams()
    const navigate = useNavigate();
    const { getUser, getUserByID, getFollowing, unfollowUser, followUser } = useProfile();
    const [openModal, setOpenModal] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const isLogged = localStorage.getItem("AUTH_TOKEN");

    const userLogged = isLogged && queryClient.getQueryData<User>(["user"]) || {} as User;


    const handleOpenModal = () => {
        setOpenModal(!openModal)
    }

    const handleFollow = () => {
        const isFollowing = followingQuery.data!.some(follower => follower._id === id);
        setIsFollowing(isFollowing)

        if (id) {
            mutation.mutate()
        }
    }

    const followingQuery = useQuery({
        queryKey: ["following"],
        queryFn: getFollowing,
        refetchOnWindowFocus: false,
    })

    const { data } = useQuery({
        queryKey: id ? ['user', id] : ["user"],
        queryFn: () => (id ? getUserByID(id) : getUser()),
        refetchOnWindowFocus: false,
    })

    const mutation = useMutation({
        mutationFn: () => (isFollowing ? unfollowUser(id ? id : "") : followUser(id ? id : "")),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["user", id] })
            queryClient.invalidateQueries({ queryKey: ["following"] })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })


    useEffect(() => {
        if (!isLogged) {
            navigate("/home");
        }
    }, [isLogged])

    return (
        <>
            <div className={styles['header-container']}>
                <div className={styles['banner']}>
                    <img className={styles['banner-img']} src={data?.avatar} alt="banner" />
                </div>

                <div className={styles.info}>
                    {
                        data && (
                            <>
                                <h2 className={styles.username}>{data.username}</h2>

                                <p className={styles['bio']}>{data.bio}</p>

                                <div className={styles['social-info']}>
                                    <Link to={`/admin/social-graph/${id ? id : ""}`}>
                                        <p className={styles.followers}><span>Followers: </span>{data.followers.length}</p>
                                    </Link>
                                    <Link to={`/admin/social-graph/${id ? id : ""}`}>
                                        <p className={styles.following}><span>Following: </span>{data.following.length}</p>
                                    </Link>
                                </div>
                            </>
                        )
                    }

                    <div className={styles['opts-container']}>
                        {
                            id !== undefined && userLogged._id !== id ? (
                                <button className={styles['follow-btn']} onClick={handleFollow}>{isFollowing ? "UnFollow" : "Follow"}</button>
                            ) : (<></>)
                        }
                    </div>

                    { id === undefined || id === userLogged._id && <button className={styles['update-profile']} onClick={handleOpenModal}>{openModal ? "Cerrar Ventana" : "Actualizar perfil"}</button>}

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