import { FetchRentLineResponse } from "@/entities/RentLine";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ms from "ms";

const useRentLines = (rentId?: number) => {
  const apiClient = new ApiClient<FetchRentLineResponse>(
    !rentId ? "/rentlines" : `/rentlines/rent/${rentId}`
  );
  return useQuery({
    queryKey: rentId ? ["rent-order-lines", rentId] : ["rent-lines"],
    queryFn: async () => {
      try {
        const response = await apiClient.getAll();

        const result = response.map((r) => ({
          ...r,
          customerName: r.rent.customer.name,
          articleName: r.article.name,
          VatRate: r.article.vatid.percent,
          rentId: r.rent.rentId,
          rentState: r.rent.rentStateDescription,
        }));

        return result;
      } catch (error: any) {
        toast.error("Rent lines could not be load.");
        console.log(error.message);
      }
    },
    staleTime: ms("24h"),
  });
};

export default useRentLines;
