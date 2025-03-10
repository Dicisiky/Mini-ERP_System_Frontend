import { TabsTrigger } from "../ui/tabs";

interface TabTriggerProps {
  value: string;
  label: string;
  title?: string;
}
const TabTrigger = ({ value, label, title }: TabTriggerProps) => {
  return (
    <TabsTrigger
      title={title}
      value={value}
      className="w-full text-secondary-foreground md:w-fit data-[state=active]:bg-secondary data-[state=active]:text-black hover:bg-gray-100 data-[state=active]:hover:bg-secondary/95"
    >
      {label}
    </TabsTrigger>
  );
};

export default TabTrigger;
