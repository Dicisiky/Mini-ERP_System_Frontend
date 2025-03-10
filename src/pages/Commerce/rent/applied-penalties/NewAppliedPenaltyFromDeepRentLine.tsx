import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import NewAppliedPenaltyFromDeepRentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/NewAppliedPenaltyFromDeepRentLineBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const NewAppliedPenaltyFromDeepRentLine = () => {
  return (
    <PageSection>
      <NewAppliedPenaltyFromDeepRentLineBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default NewAppliedPenaltyFromDeepRentLine;
