'use client';

import { useProduct } from "./_hooks/useProduct";
import ProductForm from "@/components/ProductForm";

const ProductsAddPage = () => {
  const { addProductMutation } = useProduct();

  return (
    <div className="flex">
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