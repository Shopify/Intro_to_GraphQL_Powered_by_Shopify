var storeFrontAPI = "https://name-of-your-store.myshopify.com/api/graphql";
var storeFrontAccessToken = "";

// Sets up the GraphQL request headers
function makeRequest(query) {
  var headers = {
    "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
    "Content-Type": "application/json"
  };

  return $.ajax({
    url: storeFrontAPI,
    type: "POST",
    data: JSON.stringify({ query: query }),
    headers: headers
  });
}

// Queries for product information
function fetchProducts() {
  var query = `

  `;

  return makeRequest(query);
}

// // Buys new power up by creating new checkout with item
// function buyPowerUp(variantId) {
//   var query = `
//     mutation {
//       checkoutCreate() {
//
//         }
//       }
//     `;
//
//   return makeRequest(query);
// }
//
// Checks completed purchases by querying checkouts with `completedAt` value
function checkCompletedPurchases(checkoutIds) {
  var query = `
      query {
        nodes(ids: [${checkoutIds}]) {
          ... on Checkout {
            id
            completedAt
            lineItems(first: 3) {
              edges {
                node {
                  variant {
                    id
                    product {
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

  return makeRequest(query);
}
