import CreatePost from "../features/post/components/createPost/CreatePost";
import PostList from "../features/post/components/postList/PostList";


const Home = () => {
    return (
        <main className="main-container">
            <CreatePost />
            <PostList />
        </main>
    )
}

export default Home;