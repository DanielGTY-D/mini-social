import styles from './postList.module.css';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import usePost from '../../../../post/hooks/usePost';
import type { PostArrayWithCursor } from '../../../../post/models/Post.model';
import { useParams } from 'react-router';
import useProfile from '../../hooks/useProfile';

const PostList = () => {
    const { getAllPostByUser } = usePost()
    const { getUser } = useProfile()
    const {id} = useParams()
    const observerRef = useRef<HTMLDivElement | null>(null);
    const isLogged = localStorage.getItem("AUTH_TOKEN")

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: isLogged ? true : false
    })

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam }) => getAllPostByUser(id === undefined ? userQuery.data!._id! : id, pageParam),
        getNextPageParam: (lastPage: PostArrayWithCursor) => lastPage.nextCursor ?? undefined,
        initialPageParam: undefined,
        enabled: userQuery.isFetched
    });

    useEffect(() => {
        if (!observerRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [observerRef, hasNextPage, fetchNextPage]);

    useEffect(() => {
    })
    return (
        <div className={styles["feed-container"]}>
            {data?.pages.map((page) =>
                page.posts && page.posts.map((post) => (
                    <div key={post._id} className={styles["feed-card"]}>
                        <div className={styles["feed-header"]}>
                            <img src={post.author.avatar} alt={post.author.username} className={styles["avatar"]} />
                            <div>
                                <span className={styles["username"]}>{post.author.username}</span>
                                <span className={styles["date"]}>
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        {post.image && (
                            <img src={post.image} alt="Post" className={styles["feed-image"]} />
                        )}
                        <p className={styles["content"]}>{post.content}</p>
                        <div className={styles["feed-actions"]}>
                            <span className={styles["like-btn"]}>
                                ❤️ {post.likes.length}
                            </span>
                        </div>
                    </div>
                ))
            )}
            <div ref={observerRef} className={styles["loader"]}>
                {isFetchingNextPage
                    ? "Cargando más..."
                    : hasNextPage
                        ? "Scroll para más"
                        : "No hay más posts"}
            </div>
        </div>
    )
}

export default PostList;