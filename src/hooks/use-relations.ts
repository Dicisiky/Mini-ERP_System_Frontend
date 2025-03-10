import Relation, { RelationTypes } from "@/entities/Relation";
import ApiClient from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import { useMemo } from "react";
import { toast } from "react-toastify";

const useRelations = () => {
  const apiClient = new ApiClient<Relation>("/relations");
  return useQuery({
    queryKey: ["relations"],
    queryFn: async () => {
      try {
        return await apiClient.getAll();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to fetch relations.");
      }
    },
    staleTime: ms("24h"),
  });
};

export const useCustomers = () => {
  const { data: relations, error, isLoading } = useRelations();
  const customers = useMemo(
    () =>
      relations?.filter(
        (relation) => relation.relationtype === RelationTypes.C
      ),
    [relations]
  );
  return { customers, error, isLoading };
};

export const useSuppliers = () => {
  const { data: relations, error, isLoading } = useRelations();
  const suppliers = useMemo(
    () =>
      relations?.filter(
        (relation) => relation.relationtype === RelationTypes.S
      ),
    [relations]
  );
  return { suppliers, error, isLoading };
};

export default useRelations;
