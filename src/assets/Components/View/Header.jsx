import React from "react";
import iconoSalida from "../Icons/IconoRetroceder.png";
import iconoFrutifolio from "../Icons/IconoFrutiFolio.png"

import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Tooltip } from "@nextui-org/react";
import Logo from "../Photo/logo.png";
import { Apple, Package, ReceiptText } from "lucide-react";
const Header = ({title}) => {
  return (
    <Navbar isBordered maxWidth="full" className="h-20 text-black">
      <NavbarContent justify="start">
          
          <NavbarBrand>
            <Link href="/PaginaPrincipal">
              <Image src={Logo} width={60}></Image>
              <p className="font-bold text-inherit">{title}</p>
            </Link>
          </NavbarBrand>
          
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarItem>
          <Link color="primary" href="/ConsultarCatalogo"
            showAnchorIcon
            isBlock
            anchorIcon={<Apple></Apple>}
          >
            Catalogo
          </Link>
        </NavbarItem>

        <NavbarItem isActive>
          <NavbarItem>
            <Link color="primary" href="/ConsultarCatalogo"
              showAnchorIcon
              isBlock
              anchorIcon={<ReceiptText></ReceiptText>}
            >
              Facturacion
            </Link>
          </NavbarItem>
        </NavbarItem>
        <NavbarItem>
          <Link color="primary" href="/ConsultarCatalogo"
            showAnchorIcon
            isBlock
            anchorIcon={<Package></Package>}
          >
            Pedido
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="warning" href="/LoginPrincipal" variant="flat">
            Log Out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>

  );
};

export default Header;
