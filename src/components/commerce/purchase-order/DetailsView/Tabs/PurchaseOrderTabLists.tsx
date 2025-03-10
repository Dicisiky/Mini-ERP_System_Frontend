import { Tabs, TabsList } from "@/components/ui/tabs";
import TabTrigger from "@/components/partials/TabTrigger";
import { PurchaseOrderState } from "@/entities/PurchaseOrder";
import PurchaseOrderLinesTabContent from "@/components/commerce/purchase-order-line/DetailsView/Tabs/PurchaseOrderLinesTabContent";

interface PurchaseOrderLinesTabsListProps {
  purchaseOrderState: PurchaseOrderState;
}

const PurchaseOrderTabsList = ({
  purchaseOrderState,
}: PurchaseOrderLinesTabsListProps) => {
  return (
    <Tabs defaultValue="purchase-order-lines">
      <TabsList className="bg-white flex flex-col items-center min-h-fit md:flex-row justify-start gap-2">
        <TabTrigger
          title="Purchase order lines"
          value="purchase-order-lines"
          label="Purchase order lines"
        />
      </TabsList>
      <PurchaseOrderLinesTabContent purchaseOrderState={purchaseOrderState} />
    </Tabs>
  );
};

export default PurchaseOrderTabsList;
