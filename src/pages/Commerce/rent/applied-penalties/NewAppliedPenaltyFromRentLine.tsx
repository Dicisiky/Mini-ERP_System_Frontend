import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import NewAppliedPenaltyFromRentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/NewAppliedPenaltyFromRentLineBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const NewAppliedPenaltyFromRentLine = () => {
  return (
    <PageSection>
      <NewAppliedPenaltyFromRentLineBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default NewAppliedPenaltyFromRentLine;
