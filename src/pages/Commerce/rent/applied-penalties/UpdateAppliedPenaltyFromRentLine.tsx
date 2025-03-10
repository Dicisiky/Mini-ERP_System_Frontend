import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import UpdateAppliedPenaltyFromRentLineBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/UpdateAppliedPenaltyFromRentLineBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const UpdateAppliedPenaltyFromRentLine = () => {
  return (
    <PageSection>
      <UpdateAppliedPenaltyFromRentLineBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default UpdateAppliedPenaltyFromRentLine;
