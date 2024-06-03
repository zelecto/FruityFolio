import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./assets/Components/View/Inicio";
import { ReportView } from "./assets/Components/View/Reports/reportes";
import CrearFacturaForm from "./assets/Components/View/admin/factura/Facturadora";
import CrearProductoForm from "./assets/Components/View/admin/producto/CrearProducto";
import TiendaPage from "./assets/Components/View/admin/tienda/GestionPedido";
import GestorVentasView from "./assets/Components/View/admin/tienda/GestorVentas";
import LoginScreen from "./assets/Components/View/admin/user/LoginPrincipal";
import Principal from "./assets/Components/View/admin/user/PaginaPrincipal";
import ConsultaCatalogo from "./assets/Components/View/admin/producto/Catalogo";
import PedidosView from "./assets/Components/View/Client/PedidosView";
import { ViewPaginaPrincipalClient } from "./assets/Components/View/Client/paginaPrincipalCliente";
import { CarritoViewClient } from "./assets/Components/View/Client/CarritoClient";
import { ValidationSchemaExample } from "./assets/Components/View/pruebaFormulario";
import { Toaster } from "react-hot-toast";



function App() {
  return (
    <>
      <Toaster></Toaster>
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
        <Route path="/Pruebas"
          element={<ValidationSchemaExample></ValidationSchemaExample>}
        />


      </Routes>
    </>
  );
}

export default App;
