
import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Spinner } from "@nextui-org/react";
import Logo from "../../Photo/logo.png";
import { ShoppingBasket } from "lucide-react";
const HeaderClient =()=>{
    return (
        <Navbar
            isBordered
            maxWidth="full"
            className="bg-white w-screen"
        >
            <NavbarContent justify="start">
                <NavbarBrand>
                    <Link href="/PaginaPrincipalClient">
                        <Image src={Logo} width={60}></Image>
                        <h1 className="font-bold text-inherit">ShopFruityFolio</h1>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="center">
                <NavbarBrand>
                    <h1 className="font-bold text-inherit text-xl text-blue-500">Compra fácilmente en la tienda que prefieras.</h1>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end" className="flex">
                <NavbarItem>
                    <Link href="/Carritoclient" showAnchorIcon isBlock anchorIcon={<ShoppingBasket></ShoppingBasket>}>
                        <h1>Tu carrito</h1>
                    </Link>
                    <Button as={Link} color="warning" href="/LoginPrincipal" variant="flat" className="mx-5">
                        Log Out
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default HeaderClient;