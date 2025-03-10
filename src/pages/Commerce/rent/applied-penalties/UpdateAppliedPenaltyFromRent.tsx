import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import UpdateAppliedPenaltyFromRentBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/UpdateAppliedPenaltyFromRentBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const UpdateAppliedPenaltyFromRent = () => {
  return (
    <PageSection>
      <UpdateAppliedPenaltyFromRentBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default UpdateAppliedPenaltyFromRent;
