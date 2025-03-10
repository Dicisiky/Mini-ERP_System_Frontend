import AppliedPenaltiesDataTable from "@/components/commerce/rent/applied-penalties/DataTables/AppliedPenaltiesDataTable";
import PageSection from "@/components/partials/PageSection";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const AppliedPenalties = () => {
  return (
    <PageSection>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Applied penalties</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AppliedPenaltiesDataTable />
    </PageSection>
  );
};

export default AppliedPenalties;
