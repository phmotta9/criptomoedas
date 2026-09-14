import styles from "./header.module.css";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className={styles.header}>
            <Link to="/">
                <img src={logo} alt="Logo" />
            </Link>
            
        </header>
    )
}   

export default Header;
