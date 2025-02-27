import { ethers } from "ethers";
import styles from "./header.module.css";

const Header = ({ account, connectHandler }) => {

  return (
    <nav className={styles.nav}>
      <div className={styles.nav_brand}>
        <h1>To Do List</h1>
      </div>

      {account ? (
        <button type="button" className={styles.nav_connect}>
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className={styles.nav_connect}
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
};

export default Header;
