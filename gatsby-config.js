/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: "UPD PAIMS",
    siteUrl: `https://www.yourdomain.tld`,
  },
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-mysql`,
      options: {
        connectionDetails: {
          host: "localhost",
          user: "root",
          password: "password",
          database: "paims",
        },
        queries: [
          {
            statement: "SELECT * FROM property",
            idFieldName: "PropertyID",
            name: "property",
          },
          {
            statement: "SELECT * FROM item_category",
            idFieldName: "CategoryID",
            name: "item_category",
          },
          {
            statement: "SELECT * FROM item_document",
            idFieldName: "DocumentNumber",
            name: "item_document",
          },
          {
            statement: "SELECT * FROM item_location",
            idFieldName: "LocationID",
            name: "item_location",
          },
          {
            statement: "SELECT * FROM purchase_order",
            idFieldName: "PropertyID",
            name: "purchase_order",
          },
          {
            statement: "SELECT * FROM status",
            idFieldName: "StatusID",
            name: "status",
          },
          {
            statement: "SELECT * FROM supplier",
            idFieldName: "SupplierID",
            name: "supplier",
          },
          {
            statement: "SELECT * FROM user",
            idFieldName: "UserID",
            name: "user",
          },
        ],
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `blog`,
        path: `${__dirname}/blog`,
      },
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
  ],
};
