'use client';

import ProductForm from "@/components/ProductForm";
import { useParams } from "next/navigation";
import { useProduct } from "./_hooks/useProduct";

const EditProductPage = () => {
  const params = useParams();
  const id = params.id;

  const { productQuery, updateProductMutation } = useProduct(id as string);

  if (!id) return null;

  return (
    <div>
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