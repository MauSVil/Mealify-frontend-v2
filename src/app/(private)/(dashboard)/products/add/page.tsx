'use client';

import { useProduct } from "./_hooks/useProduct";
import ProductForm from "@/components/ProductForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";

const ProductsAddPage = () => {
  const { addProductMutation } = useProduct();
  const router = useRouter();

  return (
    <div>
      <div className="my-4 flex flex-col gap-3 mx-2">
        <h1 className="text-2xl font-semibold">Agregar Producto</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => router.push('/home')}
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => router.push('/products/list')}
              >
                Productos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agregar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ProductForm
        routeTo="/products/list"
        handleSubmit={addProductMutation.mutateAsync}
        loading={addProductMutation.isPending}
        title="Agregar Producto"
        label="Crear"
      />
    </div>
  )
}

export default ProductsAddPage;