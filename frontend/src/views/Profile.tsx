import HeaderProfile from "../features/user/profile/components/headerProfile/headerProfile";
import PostList from "../features/user/profile/components/postList/PostList";


const Profile = () => {
    return (
        <div className="main-container">
            <HeaderProfile />
            <PostList />
        </div>
    )
}

export default Profile;