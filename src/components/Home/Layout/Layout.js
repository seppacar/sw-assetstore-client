import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './Layout.css'

const Layout = ({ children }) => {
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

export default Layout