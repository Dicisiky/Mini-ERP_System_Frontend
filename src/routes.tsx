import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./pages/overview/Home";
import Layout from "./pages/Layout";
import Relations from "./pages/master-data/relations/Relations";
import NewRelation from "./pages/master-data/relations/NewRelation";
import SalesOrders from "./pages/Commerce/sales-order/SalesOrders";
import NewSalesOrder from "./pages/Commerce/sales-order/NewSalesOrder";
import PurchaseOrders from "./pages/Commerce/purchase-order/PurchaseOrders";
import NewPurchaseOrder from "./pages/Commerce/purchase-order/NewPurchaseOrder";
import Articles from "./pages/master-data/articles/Articles";
import NewArticle from "./pages/master-data/articles/NewArticle";
import Categories from "./pages/master-data/article-categories/Categories";
import NewCategory from "./pages/master-data/article-categories/NewCategory";
import VatRates from "./pages/master-data/vat-rates/VatRates";
import NewVatRate from "./pages/master-data/vat-rates/NewVatRate";
import UpdateVatRate from "./pages/master-data/vat-rates/UpdateVatRate";
import UpdateCategory from "./pages/master-data/article-categories/UpdateCategory";
import UpdateArticle from "./pages/master-data/articles/UpdateArticle";
import UpdateRelation from "./pages/master-data/relations/UpdateRelation";
import Penalties from "./pages/master-data/penalties/Penalties";
import NewPenalty from "./pages/master-data/penalties/NewPenalty";
import UpdatePenalty from "./pages/master-data/penalties/UpdatePenalty";
import Projects from "./pages/Commerce/project/Projects";
import NewProject from "./pages/Commerce/project/NewProject";
import UpdateProject from "./pages/Commerce/project/UpdateProject";
import Error from "./pages/Error";
import Stock from "./pages/overview/Stock";
import UpdateSalesOrder from "./pages/Commerce/sales-order/UpdateSalesOrder";
import SalesOrdersLines from "./pages/Commerce/sales-order-line/SalesOrdersLines";
import NewSalesOrderLine from "./pages/Commerce/sales-order-line/NewSalesOrderLine";
import UpdateSalesOrderLine from "./pages/Commerce/sales-order-line/UpdateSalesOrderLine";
import Rents from "./pages/Commerce/rent/rent-order/Rents";
import NewRent from "./pages/Commerce/rent/rent-order/NewRent";
import UpdateRent from "./pages/Commerce/rent/rent-order/UpdateRent";
import RentLines from "./pages/Commerce/rent/rent-order-lines/RentLines";
import NewRentLine from "./pages/Commerce/rent/rent-order-lines/NewRentLine";
import UpdateRentLine from "./pages/Commerce/rent/rent-order-lines/UpdateRentLine";
import AppliedPenalties from "./pages/Commerce/rent/applied-penalties/AppliedPenalties";
import NewAppliedPenalty from "./pages/Commerce/rent/applied-penalties/NewAppliedPenalty";
import UpdateAppliedPenalty from "./pages/Commerce/rent/applied-penalties/UpdateAppliedPenalty";
import ViewRentOrder from "./pages/Commerce/rent/rent-order/ViewRentOrder";
import ViewRentLine from "./pages/Commerce/rent/rent-order-lines/ViewRentLine";
import ViewAppliedPenalty from "./pages/Commerce/rent/applied-penalties/ViewAppliedPenalty";
import ViewRentLineFromHeader from "./pages/Commerce/rent/rent-order-lines/ViewRentLineFromHeader";
import UpdateAppliedPenaltyFromDeepRentLine from "./pages/Commerce/rent/applied-penalties/UpdateAppliedPenaltyFromDeepRentLine";
import UpdateRentLineFromRent from "./pages/Commerce/rent/rent-order-lines/UpdateRentLineFromHeader";
import UpdateAppliedPenaltyFromRentLine from "./pages/Commerce/rent/applied-penalties/UpdateAppliedPenaltyFromRentLine";
import UpdateAppliedPenaltyFromRent from "./pages/Commerce/rent/applied-penalties/UpdateAppliedPenaltyFromRent";
import NewAppliedPenaltyFromRent from "./pages/Commerce/rent/applied-penalties/NewAppliedPenaltyFromRent";
import NewRentLineFromRent from "./pages/Commerce/rent/rent-order-lines/NewRentLineFromRent";
import NewAppliedPenaltyFromRentLine from "./pages/Commerce/rent/applied-penalties/NewAppliedPenaltyFromRentLine";
import NewAppliedPenaltyFromDeepRentLine from "./pages/Commerce/rent/applied-penalties/NewAppliedPenaltyFromDeepRentLine";
import ViewSalesOrder from "./pages/Commerce/sales-order/ViewSalesOrder";
import ViewSalesOrderLineFromHeader from "./pages/Commerce/sales-order-line/ViewSalesOrderLineFromHeader";
import UpdateSalesOrderLineFromHeader from "./pages/Commerce/sales-order-line/UpdateSalesOrderLineFromHeader";
import NewSalesOrderLineFromHeader from "./pages/Commerce/sales-order-line/NewSalesOrderLineFromHeader";
import ViewSalesOrderLine from "./pages/Commerce/sales-order-line/ViewSalesOrderLine";
import UpdatePurchaseOrder from "./pages/Commerce/purchase-order/UpdatePurchaseOrder";
import ViewPurchaseOrder from "./pages/Commerce/purchase-order/ViewPurchaseOrder";
import ViewPurchaseOrderLineFromHeader from "./pages/Commerce/purchase-order-line/ViewPurchaseOrderLineFromHeader";
import UpdatePurchaseOrderLineFromHeader from "./pages/Commerce/purchase-order-line/UpdatePurchaseOrderLineFromHeader";
import NewPurchaseOrderLineFromHeader from "./pages/Commerce/purchase-order-line/NewPurchaseOrderLineFromHeader";
import PurchaseOrdersLines from "./pages/Commerce/purchase-order-line/PurchaseOrdersLines";
import NewPurchaseOrderLine from "./pages/Commerce/purchase-order-line/NewPurchaseOrderLine";
import UpdatePurchaseOrderLine from "./pages/Commerce/purchase-order-line/UpdatePurchaseOrderLine";

const router = createBrowserRouter([
  {
    path: "/",
    element: Layout(),
    errorElement: Error(),
    children: [
      {
        index: true,
        element: <Navigate to="/articles/all" replace />,
      },
      // article routes
      { path: "/articles/all", element: Articles() },
      { path: "/articles/new", element: NewArticle() },
      { path: "/articles/update/:id", element: UpdateArticle() },

      //category routes
      { path: "/categories/all", element: Categories() },
      { path: "/categories/new", element: NewCategory() },
      { path: "/categories/update/:id", element: UpdateCategory() },

      // vat rate routes
      { path: "/vat-rates/all", element: VatRates() },
      { path: "/vat-rates/new", element: NewVatRate() },
      { path: "/vat-rates/update/:id", element: UpdateVatRate() },

      //relation routes
      { path: "/relations/all", element: Relations() },
      { path: "/relations/new", element: NewRelation() },
      { path: "/relations/update/:id", element: UpdateRelation() },

      // ###### sales order routes ######
      { path: "/sales-orders/all", element: SalesOrders() },
      { path: "/sales-orders/new", element: NewSalesOrder() },
      { path: "/sales-orders/update/:id", element: UpdateSalesOrder() },
      { path: "/sales-orders/view/:id", element: ViewSalesOrder() },

      // ###### routes to add/update/view sales order lines from sales order header
      {
        path: "/sales-orders/:salesOrderId/sales-order-lines/view/:id",
        element: ViewSalesOrderLineFromHeader(),
      },
      {
        path: "/sales-orders/:salesOrderId/sales-order-lines/update/:id",
        element: UpdateSalesOrderLineFromHeader(),
      },
      {
        path: "/sales-orders/:salesOrderId/sales-order-lines/new",
        element: NewSalesOrderLineFromHeader(),
      },

      // ###### sales order line routes ######
      { path: "/sales-order-lines/all", element: SalesOrdersLines() },
      { path: "/sales-order-lines/new", element: NewSalesOrderLine() },
      {
        path: "/sales-order-lines/update/:id",
        element: UpdateSalesOrderLine(),
      },
      {
        path: "/sales-order-lines/view/:id",
        element: ViewSalesOrderLine(),
      },

      // ###### sales order routes ######
      { path: "/purchase-orders/all", element: PurchaseOrders() },
      { path: "/purchase-orders/new", element: NewPurchaseOrder() },
      { path: "/purchase-orders/update/:id", element: UpdatePurchaseOrder() },
      { path: "/purchase-orders/view/:id", element: ViewPurchaseOrder() },

      // ###### routes to add/update/view purchase order lines from purchse order header
      {
        path: "/purchase-orders/:purchaseOrderId/purchase-order-lines/view/:id",
        element: ViewPurchaseOrderLineFromHeader(),
      },
      {
        path: "/purchase-orders/:purchaseOrderId/purchase-order-lines/update/:id",
        element: UpdatePurchaseOrderLineFromHeader(),
      },
      {
        path: "/purchase-orders/:purchaseOrderId/purchase-order-lines/new",
        element: NewPurchaseOrderLineFromHeader(),
      },

      // ###### routes to add/update/view purchase order lines from purchase order header
      {
        path: "/purchase-orders/:purchaseOrderId/purchase-order-lines/view/:id",
        element: ViewPurchaseOrderLineFromHeader(),
      },
      {
        path: "/purchase-orders/:purchaseOrderId/purchase-order-lines/update/:id",
        element: UpdatePurchaseOrderLineFromHeader(),
      },
      {
        path: "/purchase-orders/:purchaseOrderId/purchase-order-lines/new",
        element: NewPurchaseOrderLineFromHeader(),
      },

      // ###### purchase order line routes ######
      { path: "/purchase-order-lines/all", element: PurchaseOrdersLines() },
      { path: "/purchase-order-lines/new", element: NewPurchaseOrderLine() },
      {
        path: "/purchase-order-lines/update/:id",
        element: UpdatePurchaseOrderLine(),
      },
      {
        path: "/sales-order-lines/view/:id",
        element: ViewSalesOrderLine(),
      },

      // penalty routes
      { path: "/penalties/all", element: Penalties() },
      { path: "/penalties/new", element: NewPenalty() },
      { path: "/penalties/update/:id", element: UpdatePenalty() },

      // project routes
      { path: "/projects/all", element: Projects() },
      { path: "/projects/new", element: NewProject() },
      { path: "/projects/update/:id", element: UpdateProject() },

      // stock routes
      { path: "/stock", element: Stock() },

      // ########### rent order routes ###########
      { path: "/rents/all", element: Rents() },
      { path: "/rents/view/:id", element: ViewRentOrder() },
      { path: "/rents/new", element: NewRent() },
      {
        path: "/rents/update/:id",
        element: UpdateRent(),
      },

      // ########### View a rent line from a Rent header ###########
      {
        path: "/rents/:rentId/rent-lines/view/:id",
        element: ViewRentLineFromHeader(),
      },
      // ########### Update a rent line from a Rent header ###########

      {
        path: "/rents/:rentId/rent-lines/update/:id",
        element: UpdateRentLineFromRent(),
      },

      // ########### Add a rent line from a Rent header ###########
      { path: "/rents/:rentId/rent-lines/new", element: NewRentLineFromRent() },

      // ########### additional routes for view/add/update penalties in a rent header ###########
      {
        path: "/rents/:rentId/applied-penalties/update/:id",
        element: UpdateAppliedPenaltyFromRent(),
      },

      // ########## Add a new penalty from Rent header ####################
      {
        path: "/rents/:rentId/applied-penalties/new",
        element: NewAppliedPenaltyFromRent(),
      },

      // ########### rent order lines routes ###########
      { path: "/rent-lines/all", element: RentLines() },
      {
        path: "/rent-lines/view/:id",
        element: ViewRentLine(),
      },
      { path: "/rent-lines/new", element: NewRentLine() },
      {
        path: "/rent-lines/update/:id",
        element: UpdateRentLine(),
      },
      // ########## Update a penalty from Rent line detail ####################
      {
        path: "/rent-lines/:rentLineId/applied-penalties/update/:id",
        element: UpdateAppliedPenaltyFromRentLine(),
      },

      // ########## Add a new penalty from deep Rent line detail ####################
      {
        path: "/rents/:rentId/rent-lines/:rentLineId/applied-penalties/new",
        element: NewAppliedPenaltyFromDeepRentLine(),
      },

      // ########## Add a new penalty from Rent line detail ####################
      {
        path: "/rent-lines/:rentLineId/applied-penalties/new",
        element: NewAppliedPenaltyFromRentLine(),
      },

      // ########## Update a penalty from Rent line detail ####################
      {
        path: "/rents/:rentId/rent-lines/:rentLineId/applied-penalties/update/:id",
        element: UpdateAppliedPenaltyFromDeepRentLine(),
      },

      // ########### applied penalties routes ###########
      { path: "/applied-penalties/all", element: AppliedPenalties() },
      { path: "/applied-penalties/view/:id", element: ViewAppliedPenalty() },
      { path: "/applied-penalties/new", element: NewAppliedPenalty() },
      {
        path: "/applied-penalties/update/:id",
        element: UpdateAppliedPenalty(),
      },
    ],
  },
  { path: "/error", element: Error() },
]);

export default router;
