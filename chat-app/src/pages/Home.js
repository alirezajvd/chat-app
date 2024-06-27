import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
import "./styles/home.css"

const Home = () => {

    return (
        <div className="home-container">
            <Sidebar className="sidebar" />
            <Chat className="chat-container" />
        </div>
    )
}
export default Home;