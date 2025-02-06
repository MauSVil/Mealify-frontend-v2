import { create, InstanceProps } from "react-modal-promise";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

interface ConfirmationProps extends InstanceProps<unknown, unknown> {
  title: string;
  cancelText: string;
  confirmationText: string;
}

const Confirmation = (props: ConfirmationProps) => {
  const { isOpen, onReject, onResolve, title, cancelText, confirmationText } = props;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onReject()}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onResolve()}
          >
            {confirmationText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ConfirmationModal = create(Confirmation);
