import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { create, InstanceProps } from "react-modal-promise"
import { useDropzone } from "react-dropzone";
import { CheckCircle, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ImportProducts = (props: InstanceProps<{excelFile: File, imagesFiles: File[]}, unknown>) => {
  const { isOpen, onReject, onResolve } = props;
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'text/csv': ['.csv'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setExcelFile(acceptedFiles[0]);
      }
    },
    disabled: !!excelFile
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.webp'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImagesFiles(acceptedFiles);
      }
    },
    disabled: !!imagesFiles.length
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Importar productos
          </AlertDialogTitle>
        </AlertDialogHeader>

        <h3 className="text-base text-gray-500">
          Selecciona un archivo CSV o Excel para importar los productos.
        </h3>
        <div className="flex flex-col gap-2">
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 rounded-md">
            <input {...getInputProps()} />
            {
              !excelFile ?
                <p className="text-center text-gray-500">
                  Arrastra y suelta el archivo aquí, o haz clic para seleccionar uno
                </p> :
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
            }
          </div>
          {
            excelFile && (
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  {excelFile ? `${excelFile.name}` : 'No se ha seleccionado ningún archivo'}
                </p>
                <Button variant={"destructive"} size={"icon"} onClick={() => setExcelFile(null)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            )
          }
        </div>

        <Separator className="my-4" />

        <h3 className="text-base text-gray-500">
          Selecciona todos las imagenes de los productos que quieras importar.
        </h3>
        <div className="flex flex-col gap-2">
          <div {...getRootProps2()} className="border-2 border-dashed border-gray-300 p-4 rounded-md">
            <input {...getInputProps2()} />
            {
              !imagesFiles.length ?
                <p className="text-center text-gray-500">
                  Arrastra y suelta el archivo aquí, o haz clic para seleccionar uno
                </p> :
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
            }
          </div>
          {
            !!imagesFiles.length && (
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  {imagesFiles.length > 1 ? `${imagesFiles.length} archivos seleccionados` : `${imagesFiles[0].name}`}
                </p>
                <Button variant={"destructive"} size={"icon"} onClick={() => setImagesFiles([])}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            )
          }
        </div>


        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onReject()}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!excelFile || !imagesFiles.length}
            onClick={() => onResolve({
              excelFile: excelFile!,
              imagesFiles: imagesFiles!
            })}
          >
            Importar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const ImportProductsModal = create(ImportProducts);