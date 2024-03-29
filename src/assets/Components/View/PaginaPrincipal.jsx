import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

//Iconos a usar
import iconoInventario from "../Icons/iconoInventario.png";
import iconoFactura from "../Icons/iconoFactura.png";
import iconoConsulta from "../Icons/IconoConsulta.png";
import iconoProducto from "../Icons/iconoProducto.png";



function Principal() {
  return (
    <div className="bg-[#F5F5F5] h-screen">
      <Header
        link="/"
        logoRightSrc="ruta-a-la-imagen-derecha.jpg"
        logoAlt="FruityFolio logo"
        title="¡Bienvenido a FruityFolio!"
        subtitle="Gestiona tu negocio de frutas con facilidad."
      />

      <div className="mx-auto my-2">
        <main className="flex justify-center items-center my-[100px]">
          <Card
            title="Crea y Guarda tu Producto para Vender"
            description="¡Construye tu catálogo y aumenta tus ventas hoy!"
            buttonText="Ir al Inventario"
            to="/inventario"
            img={iconoProducto}
          />
          <Card
            title="Consultar tu catálogo"
            description="Explora tu catálogo con facilidad"
            buttonText="Ir al Inventario"
            to="/ConsultarCatalogo"
            img={iconoInventario}
          />
          <Card
            title="Hacer Ventas"
            description="Registra nuevas ventas."
            buttonText="Hacer Venta"
            to="/crearFactura"
            img={iconoFactura}
          />
          <Card
            title="Consultar Ventas"
            description="Consulta el historial de ventas."
            buttonText="Consultar Ventas"
            to="/ConsultarVentas"
            img={iconoConsulta}
          />
        </main>
      </div>
    </div>
  );
}

// Reutilizable Card component
function Card({ title, description, buttonText, to, img }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className={`bg-white p-6 mx-5 rounded-lg shadow-xl flex flex-col items-center justify-between h-[300px] w-[350px] transition-transform text-center ${
        hovered ? "transform scale-105" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <p className="text-gray-600 mb-2">{description}</p>
      <img className="h-20" src={img} alt="No encontrada" />
      <Link
        to={to}
        className="w-40 text-center mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default Principal;
