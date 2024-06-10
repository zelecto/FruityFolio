import { MoveRight, CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { BuscarImagenDefault } from "../../Logic/Defaultimage";
import { useEffect, useState } from "react";
import { GetTiendasCiudad } from "../../Base/BdtiendaVirtual";
import { Spinner } from "@nextui-org/react";
import HeaderClient from "./HederClient";
import PropTypes from "prop-types";
export const ViewPaginaPrincipalClient = () => {
  const [tiendas, setTiendas] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("user"));
  const ListaColores = ["#C8F1CB", "#ADD87C", "#F3BF1B", "#BEB6F6", "#F1DA9B"];
  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await GetTiendasCiudad(usuario.ciudad);

        if (respuesta.datos) {
          setTiendas(respuesta.datos);
          console.log(respuesta);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  let index = 0;
  function manejoColores() {
    const color = ListaColores[index];
    index = (index + 1) % ListaColores.length;
    return color;
  }
  return (
    <div className="bg-[#F5F5F5] min-h-screen min-w-screen flex flex-col">
      <HeaderClient></HeaderClient>

      <div className="flex-grow flex justify-center items-center">
        {tiendas.length > 0 ? (
          <div className="w-2/3 min-h-[350px] grid grid-cols-1 md:grid-cols-2 gap-6 justify-center py-10">
            {tiendas.map((items) => {
              return (
                <CardTienda
                  key={items.id}
                  tienda={items.tienda}
                  imgTopProductos={items.topFrutasDisponibles}
                  colorFondo={manejoColores()}
                ></CardTienda>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full h-full justify-center items-center">
            <Spinner
              size="lg"
              label="Cargando..."
              color="primary"
              labelColor="primary"
            ></Spinner>
          </div>
        )}
      </div>
    </div>
  );
};

const CardTienda = ({ tienda, colorFondo, imgTopProductos = [] }) => {
  let listaImagenes = imgTopProductos.map((item) => item.imagen);

  const handleExplorarClick = () => {
    window.location.href = "/PedidosView";
    localStorage.setItem("tienda", JSON.stringify(tienda));
  };

  return (
    <div
      style={{ backgroundColor: colorFondo }}
      className="h-[350px] w-full rounded-lg flex justify-between font-serif shadow-xl"
    >
      <div className="p-5 flex flex-col justify-between h-full ">
        <div className="flex items-center">
          <div className="p-2 w-32 text-center font-bold rounded-lg bg-white">
            <h2>{tienda.ciudad}</h2>
          </div>
          <h2 className="px-5 font-bold text-lg">{tienda.direccion}</h2>
        </div>
        <h1 className="font-bold text-2xl">{tienda.nombre}</h1>
        <p className="w-[300px] text-gray-500 text-lg">
          {
            "descripcion" //TODO: CAMBIAR LA DESCRIPCION
          }
        </p>
        <button
          onClick={handleExplorarClick}
          className="w-80 flex font-semibold text-xl border-b-2 border-black items-center"
        >
          <p>Explora nuestras frutas</p>
          <div className="px-4">
            <MoveRight size={35} />
          </div>
        </button>
      </div>
      <div className="w-64 p-5 flex flex-col justify-center items-center">
        <h2 className="font-bold text-lg mb-5">Productos destacados</h2>
        {imgTopProductos.length > 0 && <Carrusel images={listaImagenes} />}
      </div>
    </div>
  );
};

CardTienda.propTypes = {
  tienda: PropTypes.shape({
    ciudad: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  colorFondo: PropTypes.string.isRequired,
  imgTopProductos: PropTypes.arrayOf(
    PropTypes.shape({
      imagen: PropTypes.string.isRequired,
    })
  ),
};



const Carrusel = ({ images = [] }) => {
  const [curr, setCurr] = useState(0);

  const next = () => {
    setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));
  };

  const prev = () => {
    setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  };

  return (
    <div className="relative w-full overflow-hidden ">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            className=" w-full  rounded-md flex-shrink-0 flex justify-center items-center"
            key={image.productoId}
          >
            <img
              src={BuscarImagenDefault(image)}
              alt={`Slide ${index}`}
              className="w-40 object-contain"
            />
          </div>
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute top-1/2 transform -translate-y-1/2  p-2 rounded-full shadow-md"
      >
        <CircleChevronLeft size={20}></CircleChevronLeft>
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 rounded-full shadow-md"
      >
        <CircleChevronRight size={20}></CircleChevronRight>
      </button>
    </div>
  );
};

Carrusel.propTypes = {
  images: PropTypes.array,
};
