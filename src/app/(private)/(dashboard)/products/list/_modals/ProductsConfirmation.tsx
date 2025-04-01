import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { create, InstanceProps } from "react-modal-promise"

interface Props extends InstanceProps<unknown, unknown> {
  failedProducts: string[];
}

const ProductsConfirmation = (props: Props) => {
  const { isOpen, onReject, onResolve } = props;
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Importar productos
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Tabs>
          <TabsList>
            <TabsTrigger value="success">
              Satisfactorios
            </TabsTrigger>
            <TabsTrigger value="failed">
              Fallidos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="success">
            <div className="space-y-2">
              <p>
                Se importaron correctamente los siguientes productos:
              </p>
              <ul className="list-disc pl-5">
                {props.failedProducts.map((product) => (
                  <li key={product} className="text-green-600">
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="failed">
            <div className="space-y-2">
              <p>
                Se encontraron errores al importar los siguientes productos:
              </p>
              <ul className="list-disc pl-5">
                {props.failedProducts.map((product) => (
                  <li key={product} className="text-red-600">
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onReject()}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onResolve()}
          >
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

}

export const ProductsConfirmationModal = create(ProductsConfirmation)