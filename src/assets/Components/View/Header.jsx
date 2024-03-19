import React from "react";
import iconoSalida from "../Icons/IconoRetroceder.png";
import iconoFrutifolio from "../Icons/IconoFrutiFolio.png"
import { Link } from "react-router-dom";

const Header = ({link, title, subtitle, logoAlt }) => {
  return (
    <header className="bg-[#333333] p-8 flex justify-between items-center">
      <Link to={link}>
        <button>
          <img src={iconoSalida} alt={logoAlt} className="w-16 h-16 mr-4" />
        </button>
      </Link>

      <div>
        <h1 className="text-white text-4xl font-bold mb-2 text-center">
          {title}
        </h1>
        <p className="text-white text-lg text-center">{subtitle}</p>
      </div>

      <div>
        <img src={iconoFrutifolio} alt={''} className="w-16 h-16 mr-4" />
      </div>
    </header>
  );
};

export default Header;
