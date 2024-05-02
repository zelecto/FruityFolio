
export function ImagenDefecto() {
  const images = [
    {
      nombre: "Granadillas",
      src: Granadillas,
      alt: "Granadillas",
    },
    {
      nombre: "Guanabana",
      src: Guanabana,
      alt: "Guanabana",
    },
    {
      nombre: "Guineo",
      src: Guineo,
      alt: "Guineo",
    },
    {
      nombre: "Kiwi",
      src: Kiwi,
      alt: "Kiwi",
    },
    {
      nombre: "LimonAmarillo",
      src: LimonAmarillo,
      alt: "Limon Amarillo",
    },
    {
      nombre: "Lulo",
      src: Lulo,
      alt: "Lulo",
    },
    {
      nombre: "Mandarina",
      src: Mandarina,
      alt: "Mandarina",
    },
    {
      nombre: "Mango",
      src: Mango,
      alt: "Mango",
    },
    {
      nombre: "Manzana",
      src: Manzana,
      alt: "Manzana",
    },
    {
      nombre: "Maracuyas",
      src: Maracuyas,
      alt: "Maracuyas",
    },
    {
      nombre: "Mora",
      src: Mora,
      alt: "Mora",
    },
    {
      nombre: "Naranja",
      src: Naranja,
      alt: "Naranja",
    },
    {
      nombre: "Papaya",
      src: Papaya,
      alt: "Papaya",
    },
    {
      nombre: "Pera",
      src: Pera,
      alt: "Pera",
    },
    {
      nombre: "Pina",
      src: Pina,
      alt: "Pina",
    },
    {
      nombre: "Tomate",
      src: Tomate,
      alt: "Tomate",
    },
    {
      nombre: "Tomates de Arbol",
      src: TomatesDeArbol,
      alt: "Tomates de Arbol",
    },
    {
      nombre: "Uva",
      src: Uva,
      alt: "Uva",
    },
    {
      nombre: "Zapotes",
      src: Zapotes,
      alt: "Zapotes",
    },
    {
      nombre: "Borojo",
      src: Borojo,
      alt: "Borojo",
    },
    {
      nombre: "Cherry512",
      src: Cherry512,
      alt: "Cherry512",
    },
    {
      nombre: "Chirimoya",
      src: Chirimoya,
      alt: "Chirimoya",
    },
    {
      nombre: "Durazno",
      src: Durazno,
      alt: "Durazno",
    },
    {
      nombre: "Fresa",
      src: Fresa,
      alt: "Fresa",
    },
  ];
  return images;
}

export function BuscarImagenDefault(nombre) {
  const imagenes = ImagenDefecto();
  const imagenesFiltradas = imagenes.filter(
    (imagen) => imagen.nombre === nombre
  );
  let imagenSeleccionada =
    imagenesFiltradas.length > 0 ? imagenesFiltradas[0] : null;

  
  return imagenSeleccionada ? imagenSeleccionada.src : null;
}

export function BuscarImagenNombre(nombre) {
  const imagenes = ImagenDefecto();
  const imagenesFiltradas = imagenes.filter(
    (imagen) => imagen.nombre === nombre
  );
  let imagenSeleccionada =
    imagenesFiltradas.length > 0 ? imagenesFiltradas[0] : null;

  return imagenSeleccionada;
}







import Granadillas from "../Photo/Frutas/Granadillas.png";
import Guanabana from "../Photo/Frutas/Guanábana.png";
import Guineo from "../Photo/Frutas/Guineo.png";
import Kiwi from "../Photo/Frutas/Kiwi.png";
import LimonAmarillo from "../Photo/Frutas/LimonAmarillo.png";
import Lulo from "../Photo/Frutas/Lulo.png";
import Mandarina from "../Photo/Frutas/Mandarina.png";
import Mango from "../Photo/Frutas/Mango.png";
import Manzana from "../Photo/Frutas/Manzana.png";
import Maracuyas from "../Photo/Frutas/Maracuyás.png";
import Mora from "../Photo/Frutas/Mora.png";
import Naranja from "../Photo/Frutas/Naranja.png";
import Papaya from "../Photo/Frutas/Papaya.webp";
import Pera from "../Photo/Frutas/Pera.png";
import Pina from "../Photo/Frutas/Piña.png";
import Tomate from "../Photo/Frutas/Tomate.png";
import TomatesDeArbol from "../Photo/Frutas/Tomates de árbol.png";
import Uva from "../Photo/Frutas/Uva.png";
import Zapotes from "../Photo/Frutas/Zapotes.png";
import Borojo from "../Photo/Frutas/Borojo.png";
import Cherry512 from "../Photo/Frutas/cereza.png";
import Chirimoya from "../Photo/Frutas/Chirimoya.png";
import Durazno from "../Photo/Frutas/durazno.png";
import Fresa from "../Photo/Frutas/Fresa.png";
