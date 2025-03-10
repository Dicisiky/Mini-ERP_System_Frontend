import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import NewAppliedPenaltyFromRentBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/NewAppliedPenaltyFromRentBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const NewAppliedPenaltyFromRent = () => {
  return (
    <PageSection>
      <NewAppliedPenaltyFromRentBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default NewAppliedPenaltyFromRent;
