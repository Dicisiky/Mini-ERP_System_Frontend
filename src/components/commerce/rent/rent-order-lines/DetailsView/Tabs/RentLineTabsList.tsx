import { Tabs, TabsList } from "@/components/ui/tabs";
import TabTrigger from "@/components/partials/TabTrigger";
import AppliedPenaltiesTabContent from "../../../applied-penalties/DetailsView/Tabs/AppliedPenaltiesTabContent";
import { RentState } from "@/entities/Rent";

const RentLineTabsList = ({ rentState }: { rentState: RentState }) => {
  return (
    <Tabs defaultValue="applied-penalties">
      <TabsList className="bg-white flex flex-col items-center min-h-fit md:flex-row justify-start gap-2">
        <TabTrigger value="applied-penalties" label="Applied penalties" />
      </TabsList>
      <AppliedPenaltiesTabContent
        rentState={rentState}
        endpoint="/applied-penalties/rent-line"
      />
    </Tabs>
  );
};

export default RentLineTabsList;
