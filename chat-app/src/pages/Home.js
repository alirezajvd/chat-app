import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
const Home = () =>{


    return(
        <div>
            hello {sessionStorage.getItem('userData')};
            <Sidebar />
            <Chat />
        </div>
    )
}
export default Home;