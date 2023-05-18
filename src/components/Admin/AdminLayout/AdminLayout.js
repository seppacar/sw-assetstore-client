import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
    return (
        <div className="Layout">
            <header>
                <Header />
            </header>
            {children}
            <footer>
                <Footer />
            </footer>
        </div>
    )
}

export default AdminLayout