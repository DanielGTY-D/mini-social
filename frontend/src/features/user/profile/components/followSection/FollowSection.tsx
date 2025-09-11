import {useNavigate, useParams } from 'react-router';
import styles from './followSection.module.css'
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useProfile from '../../hooks/useProfile';


const FollowSection = () => {
    const { id } = useParams();
    const socialHeader = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState("followers");
    const { getFollowers, getFollowing, getFollowersByID, getFollowingByID } = useProfile()
    const isLogged = localStorage.getItem("AUTH_TOKEN")

    const followersQuery = useQuery({
        queryKey: id ? ['followers', id] : ['followers'],
        queryFn: () => id ? getFollowersByID(id) : getFollowers()
    })

    const follwingQuery = useQuery({
        queryKey: id ? ["following", id] : ["following"],
        queryFn: () => id ? getFollowingByID(id) : getFollowing()
    })

    // console.log(followersQuery.data, follwingQuery.data)

    useEffect(() => {
        if (!isLogged) {
            navigate("/home");
        }
    }, [isLogged])
    return (
        <div className={styles['follow-section']}>
            <h1 className={styles["follow-section__title"]}>Mira quienes te siguen y a quienes sigues...</h1>


            <div className={styles["social-container"]}>
                <div className={`${styles["social-header"]} ${!isActive.includes("followers") ? styles.active : ""}`} ref={socialHeader}>
                    <p className={`${styles['social-link']}`} onClick={ () => setIsActive("followers")}>Followers</p> 
                    <p className={`${styles['social-link']}`} onClick={() => setIsActive("following")}>Following</p>
                </div>
            </div>

            <div className={styles["social-list"]}>
                {
                    isActive.includes("followers") ? (
                        <div>
                            {
                                followersQuery.data && (
                                    <ul>
                                        {followersQuery.data.map( follower => (
                                            <li key={follower._id}>
                                                {
                                                    follower.username
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }
                        </div>
                    ) : (
                        <div>
                            {
                                follwingQuery.data && (
                                    <ul>
                                        {follwingQuery.data.map( following => (
                                            <li key={following._id}>
                                                {
                                                    following.username
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default FollowSection;