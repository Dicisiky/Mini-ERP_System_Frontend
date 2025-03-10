import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import PageSection from "@/components/partials/PageSection";
import VatRatesDataTable from "@/components/master-data/vat-rates/VatRatesDataTable";

const VatRates = () => {
  return (
    <PageSection>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>VAT Rates</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <VatRatesDataTable />
    </PageSection>
  );
};

export default VatRates;
