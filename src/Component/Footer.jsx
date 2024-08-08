import { React, useState, useEffect } from "react";
import { IoMdHome } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdLibraryAdd } from "react-icons/md";
import { auth } from "../firebase/firebase";
import "../CSS/Footer.css";
import { Link } from "react-router-dom";
function Footer() {
  let [user, Setuser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      Setuser(user);
    });
  }, []);
  return (
    <div className="footer">
      <Link to="/">
        <IoMdHome />
        <p>Home</p>
      </Link>
      <a href="#">
        <SiYoutubeshorts />
        <p>Shorts</p>
      </a>
      {user ? (
        <a href="#">
          <MdOutlineSubscriptions />
          <p>Subscriptions</p>
        </a>
      ) : null}
      <Link to="/Library">
        <MdLibraryAdd />
        <p>Library</p>
      </Link>
    </div>
  );
}

export default Footer;
