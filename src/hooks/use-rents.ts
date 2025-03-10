import { FetchRentResponse } from "@/entities/Rent";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<FetchRentResponse>("/rents");

const useRents = () => {
  return useQuery({
    queryKey: ["rents"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();

        const result = response.map((r) => ({
          ...r,
          customerName: r.customer.name,
        }));

        return result;
      } catch (error: any) {
        toast.error("Rents could not be load.");
        console.log(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default useRents;
