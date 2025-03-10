import AppliedPenaltiesForm from "@/components/commerce/rent/applied-penalties/Forms/AppliedPenaltiesForm";
import NewAppliedPenaltyBreadcrumb from "@/components/commerce/rent/breadcrumbs/applied-penalties-breadcrumbs/NewAppliedPenaltyBreadcrumb";
import PageSection from "@/components/partials/PageSection";

const NewAppliedPenalty = () => {
  return (
    <PageSection>
      <NewAppliedPenaltyBreadcrumb />
      <AppliedPenaltiesForm />
    </PageSection>
  );
};

export default NewAppliedPenalty;
