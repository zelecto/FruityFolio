import React from "react";
import { Link } from "react-router-dom";
import Header from "../../Header";

//Iconos a usar
import iconoInventario from "../../../Icons/iconoInventario.png";
import iconoFactura from "../../../Icons/iconoFactura.png";
import iconoConsulta from "../../../Icons/IconoConsulta.png";
import iconoProducto from "../../../Icons/iconoProducto.png";
import IconoTienda from "../../../Icons/IconoTienda.png";
import IconoGrafica from "../../../Icons/IconoGrafica.png";
import { Button, Image } from "@nextui-org/react";




function Principal() {
  const usuario = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="bg-[#F5F5F5] w-screen min-h-screen flex flex-col">
      <Header
        link="/"
        logoRightSrc="ruta-a-la-imagen-derecha.jpg"
        logoAlt="FruityFolio logo"
        title="¡Bienvenido a FruityFolio!"
        subtitle={`${usuario.username} gestiona tu negocio de frutas con facilidad.`}
      />

      <div className="flex-grow flex items-center justify-center">
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-center items-center my-8">
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
          <Card
            title="Administra tu Tienda Virtual"
            description="Recibe y elimina los pedidos de tus clientes."
            buttonText="Gestionar Pedidos"
            to="/GestionarPedidos"
            img={IconoTienda}
          />

          <Card
            title="Reportes y Gráficas"
            description="Visualiza el rendimiento de tu tienda con gráficas detalladas."
            buttonText="Ver Reportes"
            to="/reportes"
            img={IconoGrafica}
          />
        </div>
      </div>
    </div>
  );

}

// Reutilizable Card component
function Card({ title, description, buttonText, to, img }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className={`bg-white p-6 mx-5 rounded-lg shadow-xl flex flex-col items-center justify-between h-[300px] w-[350px] transition-transform text-center ${hovered ? "transform scale-105" : ""
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <p className="text-gray-600 mb-2">{description}</p>
      <Image className="h-20" src={img} alt="No encontrada" />
      <Link
        to={to}
        className="my-2"
      >
        <Button color="primary">
          {buttonText}
        </Button>
        
      </Link>
    </div>
  );
}

export default Principal;
