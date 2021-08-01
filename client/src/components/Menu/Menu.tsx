import React, { FC } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Menu: FC = () => {
  return <div className="menu">
    <div>
        <Link className="link" to="/">All</Link>
        <Link className="link" to="/btc">Btc</Link>
    </div>
  </div>;
};

export default Menu;
