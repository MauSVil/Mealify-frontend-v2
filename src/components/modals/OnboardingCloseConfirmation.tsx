import { create, InstanceProps } from "react-modal-promise";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

const OnboardingCloseConfirmation = (props: InstanceProps<unknown, unknown>) => {
  const { isOpen, onReject, onResolve } = props;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estas seguro que quieres salir del onboarding?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Si sales del onboarding, puede que la plataforma no funcione correctamente.
            No podras volver a entrar al onboarding.
          </AlertDescription>
        </Alert>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onReject()}>
            No, continuar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onResolve()}
            >
            Sí, salir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const OnboardingCloseConfirmationModal = create(OnboardingCloseConfirmation);