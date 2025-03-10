import { FetchRentResponse, RentState } from "@/entities/Rent";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { toast } from "react-toastify";

const apiClient = new ApiClient<FetchRentResponse>("/rents");

const useValidRents = () => {
  return useQuery({
    queryKey: ["rents-new"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();
        const filteredResponse = response.filter(
          (r) => r.state === RentState.NEW
        );
        const result = filteredResponse.map((r) => ({
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

export default useValidRents;
