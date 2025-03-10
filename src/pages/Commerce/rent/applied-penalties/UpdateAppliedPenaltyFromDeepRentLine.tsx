import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import UpdateAppliedPenaltyFromDeepRentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/UpdateAppliedPenaltyFromDeepRentlineBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const UpdateAppliedPenaltyFromDeepRentLine = () => {
  return (
    <PageSection>
      <UpdateAppliedPenaltyFromDeepRentLineBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default UpdateAppliedPenaltyFromDeepRentLine;
