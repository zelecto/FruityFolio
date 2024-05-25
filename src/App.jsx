import "./App.css";
import Login from "./assets/Components/View/Inicio";
import Principal from "./assets/Components/View/PaginaPrincipal";
import { Routes, Route } from "react-router-dom";
import  CrearProductoForm  from "./assets/Components/View/CrearProducto";
import CrearFacturaForm from "./assets/Components/View/Facturadora";
import ConsultaCatalogo from "./assets/Components/View/Catalogo";
import GestorVentasView from "./assets/Components/View/GestorVentas";
import ViewClient from "./assets/Components/View/Cliente";
import TiendaPage from "./assets/Components/View/GestionPedido";
import { LoginScreen } from "./assets/Components/View/LoginPrincipal";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<LoginScreen></LoginScreen>} />
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
        <Route path="/GestionarPedidos"
          element={<TiendaPage></TiendaPage>}
        />
        <Route path="/Login"
          element={<LoginScreen></LoginScreen>}
        />
      </Routes>
    </>
  );
}

export default App;
