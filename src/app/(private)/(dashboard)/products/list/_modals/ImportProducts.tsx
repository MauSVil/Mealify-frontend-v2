import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { create, InstanceProps } from "react-modal-promise"

const ImportProducts = (props: InstanceProps<unknown, unknown>) => {
  const { isOpen, onReject, onResolve } = props;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Importar productos
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onReject()}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onResolve()}
          >
            Importar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const ImportProductsModal = create(ImportProducts);