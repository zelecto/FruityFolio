import "./App.css";
import Login from "./assets/Components/View/Inicio";
import Principal from "./assets/Components/View/PaginaPrincipal";
import { Routes, Route } from "react-router-dom";
import  CrearProductoForm  from "./assets/Components/View/CrearProducto";
import CrearFacturaForm from "./assets/Components/View/Facturadora";
import ConsultaCatalogo from "./assets/Components/View/Catalogo";
import GestorVentasView from "./assets/Components/View/GestorVentas";
import PedidosView from "./assets/Components/View/Client/PedidosView";
import TiendaPage from "./assets/Components/View/GestionPedido";
import { LoginScreen } from "./assets/Components/View/LoginPrincipal";
import { ViewPaginaPrincipalClient } from "./assets/Components/View/Client/paginaPrincipalCliente";
import { ReportView } from "./assets/Components/View/Reports/reportes";
import { CarritoViewClient } from "./assets/Components/View/Client/CarritoClient";


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
        <Route path="/PedidosView"
          element={<PedidosView></PedidosView>}
        />
        <Route path="/GestionarPedidos"
          element={<TiendaPage></TiendaPage>}
        />
        <Route path="/Login"
          element={<LoginScreen></LoginScreen>}
        />
        <Route path="/PaginaPrincipalClient"
          element={<ViewPaginaPrincipalClient></ViewPaginaPrincipalClient>}
        />
        <Route path="/Reportes"
          element={<ReportView></ReportView>}
        />
        <Route path="/CarritoClient"
          element={<CarritoViewClient></CarritoViewClient>}
        />


      </Routes>
    </>
  );
}

export default App;
