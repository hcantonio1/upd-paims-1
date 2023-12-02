import * as React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";

// DEFINE TABLES FOR QUERIES

function PurchaseOrderTable(props) {
  const { purchaseOrders } = props;

  return (
    <table>
      <caption>Purchase Orders</caption>
      <thead>
        <tr>
          <th>Purchase Order ID</th>
          <th>Property ID</th>
          <th>Supplier ID</th>
          <th>Purchase Date</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        {purchaseOrders.map((order) => (
          <tr key={order.node.PurchaseOrderID}>
            <td>{order.node.PurchaseOrderID}</td>
            <td>{order.node.PropertyID}</td>
            <td>{order.node.SupplierID}</td>
            <td>{order.node.PurchaseDate}</td>
            <td>{order.node.TotalCost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ItemCategoryTable(props) {
  const { itemCategories } = props;

  return (
    <table>
      <caption>Item Category</caption>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {itemCategories.map((item) => (
          <tr key={item.node.CategoryID}>
            <td>{item.node.CategoryID}</td>
            <td>{item.node.CategoryName}</td>
            <td>{item.node.Category_Desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

//

// DEFINE PAGE COMPONENTS

const InventoryPage = ({ data }) => {
  const itemCategories = data.allMysqlItemCategory.edges;
  const purchaseOrders = data.allMysqlPurchaseOrder.edges;

  return (
    <Layout pageTitle="INVENTORY">
      <main>
        <Link to="/inventoryPlayground">Playground</Link>

        <div>
          <h1>ItemCategory Information:</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {itemCategories.map(({ node }) => (
                <tr key={node.CategoryID}>
                  <td>{node.CategoryID}</td>
                  <td>{node.CategoryName}</td>
                  <td>{node.Category_Desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h1>Purchase Order Information:</h1>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Property ID</th>
                <th>Supplier ID</th>
                <th>Purchase Date</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map(({ node }) => (
                <tr key={node.PropertyID}>
                  <td>{node.PurchaseOrderID}</td>
                  <td>{node.PropertyID}</td>
                  <td>{node.SupplierID}</td>
                  <td>{node.PurchaseDate}</td>
                  <td>{node.TotalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <PurchaseOrderTable purchaseOrders={purchaseOrders} />
        </div>
        <div>
          <ItemCategoryTable itemCategories={itemCategories} />
        </div>
      </main>
    </Layout>
  );
};

export const data = graphql`
  query InventoryQuery {
    allMysqlItemCategory(
      sort: { CategoryID: ASC }
      filter: { CategoryName: {} }
    ) {
      edges {
        node {
          CategoryID
          CategoryName
          Category_Desc
        }
      }
    }
    allMysqlPurchaseOrder(sort: { PropertyID: DESC }) {
      edges {
        node {
          PurchaseOrderID
          PropertyID
          SupplierID
          PurchaseDate(formatString: "MMMM DD, YYYY")
          TotalCost
        }
      }
    }
  }
`;

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Inventory Page</title>;

// Step 3: Export your component
export default InventoryPage;
