import { LoaderCircle } from "lucide-react";

const Loading = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center gap-2 p-6">
      <LoaderCircle className="text-primary animate-spin duration-300" />

      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default Loading;
