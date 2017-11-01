// Once the page has loaded, execute this script
$(document).ready(function() {
  var checkoutIds = [];

  // Checks `checkoutCreate` response data and opens new tab with webUrl
  function completeCheckout(response) {
    var checkout = response.data.checkoutCreate.checkout;
    var checkoutId = checkout.id;

    checkoutIds.push(`"${checkoutId}"`);
    window.open(checkout.webUrl, "popup", "width=600,height=600");
  }

  // Generates an html element for the power up
  function createProductCard(title, imageSrc, variantId) {
    return $(`
      <div class="product-card">
        <div class="title">${title}</div>
        <div class="cost">-100pt</div>
        <img class="power-up" id="${variantId}" src="${imageSrc}" />
      <div>`);
  }

  // Populates product data from product query response
  function updateProducts(response) {
    var products = response.data.shop.products.edges;

    products.forEach(function(product) {
      var title = product.node.title;
      var variantId = product.node.variants.edges[0].node.id;
      var imageSrc = product.node.images.edges[0].node.src;
      var $productDiv = createProductCard(title, imageSrc, variantId);

      $productDiv.click(function(event) {
        game.togglePause(true);
        // Tests if player has enough points
        if (game.score >= 100) {
          buyPowerUp(variantId).done(completeCheckout);
        } else {
          $("#game-score").effect("shake");
        }
      });
      $productDiv.appendTo("#products");
    });
  }

  // Update purchases information on `game` element
  function updatePurchases(response) {
    var checkouts = response.data.nodes;
    checkouts.forEach(function(checkout) {
      if (checkout.completedAt) {
        // Remove completed checkout from list of checkout ids
        var index = checkoutIds.indexOf(checkout.id);
        checkoutIds.splice(index, 1);

        var powerUpHandle = checkout.lineItems.edges[0].node.variant.product.handle;

        game.addPowerup(powerUpHandle);
      }
    });
  }

  // Checks completed purchases on spacebar events
  $(document).keydown(function(e) {
    if (e.keyCode === 32) {
      //spacebar events
      if (checkoutIds.length > 0) {
        checkCompletedPurchases(checkoutIds).done(updatePurchases);
      }
    }
  });

  fetchProducts().done(updateProducts);
});
