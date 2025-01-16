import { create, InstanceProps } from "react-modal-promise";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SignUpProps extends InstanceProps<unknown, unknown> {
  onValidate: (value: string) => void;
}

const SignUpConfirmation = (props: SignUpProps) => {
  const { isOpen, onReject, onResolve, onValidate } = props;
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmación de correo
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex gap-3 flex-col">
          <Label htmlFor="otp">Ingresa el código de confirmación</Label>
          <InputOTP maxLength={6} value={value} onChange={setValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                await onValidate(value);
                onResolve();
              } catch (err) {
                if (err instanceof Error) {
                  toast.error(err.message);
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading && <Loader2 className="mr-2 animate-spin" />}
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const SignUpConfirmationModal = create(SignUpConfirmation);