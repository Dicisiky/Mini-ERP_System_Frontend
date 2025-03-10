import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navlink from "./Navlink";
import logo from "../../assets/logo-icon.svg";
import sidebarItems from "@/assets/sidebar-items";

const AppSidebar = () => {
  return (
    <Sidebar>
      {/* Logo and Name */}
      <SidebarHeader>
        <img src={logo} alt="FortisBuild logo" className="w-8" />
        <p>FortisBuild</p>
      </SidebarHeader>
      <SidebarContent aria-describedby="Sidebar items">
        <Accordion type="single" collapsible>
          {sidebarItems.map((group, index) => (
            <AccordionItem key={group.groupTitle} value={`group-${index + 1}`}>
              <AccordionTrigger>
                <group.icon className="!rotate-0" /> {group.groupTitle}
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible>
                  {group.items.map((item, subIndex) => (
                    <AccordionItem
                      key={item.title}
                      value={`item-${index + 1}-${subIndex + 1}`}
                    >
                      {item.link && (
                        <Navlink
                          key={item.link.text}
                          text={item.link.text}
                          path={item.link.path}
                          icon={item.link.icon}
                        />
                      )}
                      {item.links && (
                        <>
                          <AccordionTrigger>
                            <item.icon className="!rotate-0" /> {item.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            {item.links.map((link) => (
                              <Navlink
                                key={link.text}
                                text={link.text}
                                path={link.path}
                                icon={link.icon}
                              />
                            ))}
                          </AccordionContent>
                        </>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
