import "./App.css";
import Login from "./assets/Components/View/Inicio";
import Principal from "./assets/Components/View/PaginaPrincipal";
import { Routes, Route } from "react-router-dom";
import  CrearProductoForm  from "./assets/Components/View/CrearProducto";
import CrearFacturaForm from "./assets/Components/View/Facturadora";
import ConsultaCatalogo from "./assets/Components/View/Catalogo";
import GestorVentasView from "./assets/Components/View/GestorVentas";
import ViewClient from "./assets/Components/View/Cliente";
function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Login></Login>} />
        <Route path="paginaPrincipal" element={<Principal />} />
        <Route
          path="inventario"
          element={<CrearProductoForm></CrearProductoForm>}
        />
        <Route
          path="crearFactura"
          element={<CrearFacturaForm></CrearFacturaForm>}
        />
        <Route path="/ConsultarCatalogo"
        element={<ConsultaCatalogo></ConsultaCatalogo>}
        
        />
        <Route path="/ConsultarVentas"
        element={<GestorVentasView></GestorVentasView>}
        />
        <Route path="/ConsultarVentas"
        element={<GestorVentasView></GestorVentasView>}
        />
        <Route path="/cliente"
          element={<ViewClient></ViewClient>}
        />
      </Routes>
    </>
  );
}

export default App;
