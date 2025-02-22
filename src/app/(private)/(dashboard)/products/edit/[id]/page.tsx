'use client';

import ProductForm from "@/components/ProductForm";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "./_hooks/useProduct";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const { productQuery, updateProductMutation } = useProduct(id as string);

  if (!id) return null;

  return (
    <div>
      <div className="my-4 flex flex-col gap-3 mx-2">
        <h1 className="text-2xl font-semibold">Editar Producto</h1>
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
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ProductForm
        routeTo="/products/list"
        title="Editar Producto"
        handleSubmit={async (values) => updateProductMutation.mutate(values)}
        loading={false}
        product={productQuery.data}
        label="Actualizar"
      />
    </div>
  )
};

export default EditProductPage;