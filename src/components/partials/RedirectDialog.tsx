import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface RedirectDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  message: string;
  backPath: string;
  viewPath?: string;
  addPath?: string;
}
const RedirectDialog = ({
  open,
  message,
  setOpen,
  backPath,
  viewPath,
  addPath,
}: RedirectDialogProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    setOpen(false);
    navigate(backPath);
  };

  const handleView = () => {
    setOpen(false);
    viewPath && navigate(viewPath);
  };
  const handleAdd = () => {
    setOpen(false);
    addPath && navigate(addPath);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[40%] md:top-[30%] xl:top-[20%] py-10 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-normal">{message}</DialogTitle>
          <DialogDescription className="text-sm">
            What do you want to continue with?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row justify-between gap-2">
          <Button className="flex-1" variant="outline" onClick={handleBack}>
            Back
          </Button>

          {viewPath && (
            <Button
              className="flex-1"
              variant={addPath ? "outline" : "default"}
              onClick={handleView}
            >
              View
            </Button>
          )}

          {addPath && (
            <Button className="flex-1" onClick={handleAdd}>
              Add another
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RedirectDialog;
