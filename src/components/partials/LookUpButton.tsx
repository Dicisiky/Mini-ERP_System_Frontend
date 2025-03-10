import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

const LookUpButton = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      title="Lookup"
      onClick={() => setOpen(true)}
      type="button"
      variant="ghost"
      size="icon"
      className="inline-flex"
    >
      <SearchIcon />
    </Button>
  );
};

export default LookUpButton;
