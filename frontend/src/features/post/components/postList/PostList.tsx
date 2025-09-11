import { useInfiniteQuery } from '@tanstack/react-query';
import styles from './postList.module.css'
import usePost from '../../hooks/usePost';
import type { PostArrayWithCursor } from '../../models/Post.model';
import { useEffect, useRef } from 'react';
import CardPost from '../cardPost/CardPost';

const PostList = () => {
    const { getAllPost } = usePost()
    const observerRef = useRef<HTMLDivElement | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam }) => getAllPost(pageParam),
        getNextPageParam: (lastPage: PostArrayWithCursor) => lastPage.nextCursor ?? undefined,
        initialPageParam: undefined
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

    return (
        <div className={styles["feed-container"]}>
            {data?.pages.map((page) =>
                page.posts && page.posts.map((post) => (
                    <CardPost post={post} key={post._id} />
                ))
            )}
            {/* Loader/trigger */}
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