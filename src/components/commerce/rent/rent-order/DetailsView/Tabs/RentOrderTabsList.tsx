import { Tabs, TabsList } from "@/components/ui/tabs";
import TabTrigger from "@/components/partials/TabTrigger";
import RentLinesTabContent from "../../../rent-order-lines/DetailsView/Tabs/RentLinesTabContent";
import AppliedPenaltiesTabContent from "../../../applied-penalties/DetailsView/Tabs/AppliedPenaltiesTabContent";
import { RentState } from "@/entities/Rent";

const RentOrderTabsList = ({ rentState }: { rentState: RentState }) => {
  return (
    <Tabs defaultValue="rent-lines">
      <TabsList className="bg-white flex flex-col items-center min-h-fit md:flex-row justify-start gap-2">
        <TabTrigger title="Rent lines" value="rent-lines" label="Rent lines" />
        <TabTrigger
          title="Applied penalties"
          value="applied-penalties"
          label="Applied penalties"
        />
      </TabsList>
      <RentLinesTabContent rentState={rentState} />
      <AppliedPenaltiesTabContent
        rentState={rentState}
        endpoint="/applied-penalties/rent"
      />
    </Tabs>
  );
};

export default RentOrderTabsList;
