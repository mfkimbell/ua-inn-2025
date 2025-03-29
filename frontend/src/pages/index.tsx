import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LandingPage from "@/components/pages/landing-page";
import useUser from "@/hooks/useUser";
import EmployeeView from "@/components/pages/employee-view";
import AdminView from "@/components/pages/admin-view";
import { Product } from "@/types/product.types";
import { ProductsService } from "@/lib/products-service";

export default function Home() {
  const { data: session } = useSession();
  const { user } = useUser();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (session) {
      const fetchProducts = async () => {
        const products = await ProductsService.getProducts();
        setProducts(products);
      };

      fetchProducts();
    }
  }, [session]);

  if (!session) {
    return <LandingPage />;
  }

  if (user?.role === "admin") {
    return <AdminView products={products} />;
  }

  return <EmployeeView />;
}
