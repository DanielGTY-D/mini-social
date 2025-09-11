import { useMutation, useQueryClient } from '@tanstack/react-query';
import usePost from '../../hooks/usePost';
import type { Post } from '../../models/Post.model';
import styles from './cardPost.module.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { useState } from 'react';
import type { User } from '../../../user/profile/models/user.model';

interface CardPostProps {
    post: Post
}

const CardPost = ({ post }: CardPostProps) => {

    const { likePost, unlikePost } = usePost()
    const [isAlreadyLiked, setIsAlreadyLiked] = useState(false);
    const queryClient = useQueryClient()
    const isLogged = localStorage.getItem("AUTH_TOKEN");
    const user = isLogged ? queryClient.getQueryData<User>(["user"]) : "";


    //TODO: Esto se puede hacer con un optimistic
    const likeMutation = useMutation({
        mutationFn: (postId: string) => (isAlreadyLiked ? unlikePost(postId) : likePost(postId)),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    const handleLikes = (postId: string) => {
        if (!isLogged) {
            toast.error("Tienes que Iniciar Sesion para empezar a seguir, dar like y mas")
            return;
        }

        if (user && post.likes.includes(user._id!)) {
            setIsAlreadyLiked(true);
        } else {
            setIsAlreadyLiked(false);
        }

        likeMutation.mutate(postId)
    }


    return (
        <div key={post._id} className={styles["feed-card"]}>
            <Link to={`/admin/profile/${post.author._id}`} className={styles["feed-header"]}>
                <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className={styles["avatar"]}
                />
                <div>
                    <span className={styles["username"]}>
                        {post.author.username}
                    </span>
                    <span className={styles["date"]}>
                        {new Date(post.createdAt).toLocaleString()}
                    </span>
                </div>
            </Link>
            {post.image && (
                <img src={post.image} alt="Post" className={styles["feed-image"]} />
            )}
            <p className={styles["content"]}>{post.content}</p>
            <div className={styles["feed-actions"]}>
                <button className={styles["like-btn"]} onClick={() => handleLikes(post._id)}>
                    ❤️ {post.likes.length}
                </button>
            </div>
        </div>
    )
}

export default CardPost;