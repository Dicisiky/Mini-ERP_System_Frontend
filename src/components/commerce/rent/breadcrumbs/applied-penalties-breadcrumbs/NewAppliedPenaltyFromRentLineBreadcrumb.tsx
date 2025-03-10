import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useParams } from "react-router";

const NewAppliedPenaltyFromRentLineBreadcrumb = () => {
  const { rentLineId } = useParams();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/rent-lines/all">Rent lines</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/rent-lines/view/${rentLineId}`}>
            Rent line {rentLineId}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Apply penalty</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NewAppliedPenaltyFromRentLineBreadcrumb;
