import { FetchAppliedPenalty } from "@/entities/AppliedPenalty";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";

// ############# declare new instance of api client, it expects a response of type  FetchAppliedPenalty[] (List of applied penalties) #############
const apiClient = new ApiClient<FetchAppliedPenalty>("/applied-penalties");
const useAppliedPenalties = () => {
  return useQuery({
    // ############# key to access cached data #############
    queryKey: ["applied-penalties"],
    queryFn: async () => {
      // ############# GET request to fetch applied penalties list #############
      const response = await apiClient.getAll();
      // ############# transform data (for better handling and column access in table) #############
      const result = response.map((ap) => {
        return {
          // ############# ...app = current value of an Applied Penalty #############
          ...ap,
          // ############# additional fields: #############
          rentId: ap.rentLine.rent.rentId,
          rentLineId: ap.rentLine.rentLineId,
          articleName: ap.rentLine.article.name,
          penaltyAmount: ap.penalty.price,
          penaltyDescription: ap.penalty.penaltyTypeDescription,
          customerName: ap.rentLine.rent.customer.name,
        };
      });

      return result;
    },
    // ############# cache data for 24h #############
    staleTime: ms("24h"),
  });
};

export default useAppliedPenalties;
