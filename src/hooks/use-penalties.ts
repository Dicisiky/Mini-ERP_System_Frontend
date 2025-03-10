import Penalty from "@/entities/Penalty";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<Penalty>("/penalties");

const usePenalties = () => {
  return useQuery({
    queryKey: ["penalties"],
    queryFn: async () => {
      try {
        return await apiClient.getAll();
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default usePenalties;
