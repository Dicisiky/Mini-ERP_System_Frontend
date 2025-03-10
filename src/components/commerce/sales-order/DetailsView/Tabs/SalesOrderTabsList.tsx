import { Tabs, TabsList } from "@/components/ui/tabs";
import TabTrigger from "@/components/partials/TabTrigger";
// import SalesOrderLinesTabContent from "../../../sales-order-lines/DetailsView/Tabs/SalesOrderLinesTabContent";
import { SalesOrderState } from "@/entities/SalesOrder";
import SalesOrderLinesTabContent from "@/components/commerce/sales-order-line/DetailsView/Tabs/SalesOrderLinesTabContent";
interface SalesOrderLinesTabsListProps {
  salesOrderState: SalesOrderState;
}
const SalesOrderTabsList = ({
  salesOrderState,
}: SalesOrderLinesTabsListProps) => {
  return (
    <Tabs defaultValue="sales-order-lines">
      <TabsList className="bg-white flex flex-col items-center min-h-fit md:flex-row justify-start gap-2">
        <TabTrigger
          title="Sales order lines"
          value="sales-order-lines"
          label="Sales order lines"
        />
      </TabsList>
      <SalesOrderLinesTabContent salesOrderState={salesOrderState} />
    </Tabs>
  );
};

export default SalesOrderTabsList;
