import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useParams } from "react-router";

const UpdateAppliedPenaltyFromDeepRentLineBreadcrumb = () => {
  const { rentId, rentLineId, id } = useParams();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/rents/all">Rents</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/rents/view/${rentId}`}>
            Rent {rentId}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/rents/${rentId}/rent-lines/view/${rentLineId}`}
          >
            Rent line {rentLineId}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Update penalty {id}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default UpdateAppliedPenaltyFromDeepRentLineBreadcrumb;
