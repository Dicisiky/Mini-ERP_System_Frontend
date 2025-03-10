import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import PageSection from "@/components/partials/PageSection";
import RelationsForm from "@/components/master-data/relations/RelationsForm";

const NewRelation = () => {
  return (
    <PageSection>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/relations/all">Relations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Update</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <RelationsForm />
    </PageSection>
  );
};

export default NewRelation;
