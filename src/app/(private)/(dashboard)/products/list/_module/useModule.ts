import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { useApi } from "../../../../../../../lib/api";
import { useState } from "react";
import { useBusiness } from "@/contexts/BusinessContext";
import { Product } from "@/types/Product.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImportProductsModal } from "../_modals/ImportProducts";
import { ProductsConfirmationModal } from "../_modals/ProductsConfirmation";

export const useModule = () => {
  const api = useApi();
  const { activeBusiness } = useBusiness();  

  const [productsModified, setProductsModified] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');

  const productsQuery = useQuery<Product[]>({
    queryKey: ["products", activeBusiness.id],
    queryFn: async () => {
      const { data } = await api.get(`/products`);
      return data;
    },
  })

  const modifiedProductsMutation = useMutation({
    mutationKey: ["products", activeBusiness.id],
    mutationFn: async (body: Record<string, boolean>) => {
      const parsedBody = Object.entries(body).map(([id, is_available]) => ({ id, is_available }));
      const res = await api.put('/products', parsedBody);
      return res.data;
    },
    onSuccess: () => {
      productsQuery.refetch();
      toast.success('Productos actualizados correctamente');
    }
  })

  const importProductsMutation = useMutation({
    mutationKey: ["products", activeBusiness.id],
    mutationFn: async (body: FormData) => {
      const res = await api.post<{ failedProducts: string[] }>('/products/bulk', body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return res.data;
    },
  })

  const handleDeleteProduct = async (productId: number) => {
    try {
      await ConfirmationModal({
        title: '¿Estás seguro de que deseas eliminar este producto?',
        cancelText: 'Cancelar',
        confirmationText: 'Eliminar',
      })
      await api.delete(`/products/${productId}`);
    } catch (err) {
      console.log('cancel delete product', err, productId);
    }
  }

  const handleImportProducts = async () => {
    try {
      const resp = await ImportProductsModal();
      if (!resp) return;
      const { excelFile, imagesFiles } = resp as { excelFile: File, imagesFiles: File[] };
      const formData = new FormData();
      formData.append('file', excelFile);
      imagesFiles.forEach((file) => {
        formData.append('products', file);
      });
      const { failedProducts } = await importProductsMutation.mutateAsync(formData);
      await ProductsConfirmationModal({
        failedProducts,
      });
    } catch {
      console.log('Cancel import products');
    }
  }

  return {
    localData: {
      productsModified,
      query,
      products: productsQuery.data || [],
    },
    flags: {
      isLoading: productsQuery.isLoading,
      isError: productsQuery.isError,
      isImporting: importProductsMutation.isPending,
    },
    methods: {
      setProductsModified,
      setQuery,
      handleDeleteProduct,
      handleImportProducts,
      modifyProducts: modifiedProductsMutation.mutateAsync,
    }
  }
}