// Don't edit this code
$(document).ready(function() {

	const farmers = Farmer.get_farmers();
	const event =  Event.make_event(farmers);
	const market_owner = farmers.get(sessionStorage.getItem("current_market_owner"));
	const market_user = farmers.get(sessionStorage.getItem("current_market_user"));

	let current_items = market_owner.market_items.reduce((o, value) => (Object.assign(o, {[value.id]:value})), {});;
	let shopping_cart = {};
	$("#wddp-mu > h2").text("Welcome to " + market_owner.name + "'s market!");

	// Add an item to the cart
	$("#wddp-mu-items").on("click", ".add-to-cart",function() {
		let id = $(this).parent(".card-item").attr("data-id");
		item = current_items[id];

		if (item.in_shopping_cart) { 
			item.in_shopping_cart = false;
			delete shopping_cart[id]
		} else {
			item.in_shopping_cart = true;
			shopping_cart[id] = item;
		}

		compute_subtotal(shopping_cart)
		render_all(current_items, market_user);
	})

	// Watch a card from market_user's perspective
	$("#wddp-mu-items").on("click", ".card-watch",function() {
		let id = $(this).parent(".card-item").attr("data-id");
		item = current_items[id];

		$("#wddp-mu-watched").show().fadeOut(1000);

		event.subscribe(id, (x)=>{
			if (market_user.check_buy(x)) {
				market_owner.sell_item(x);
			}
		});
		event.register(id, {
							"buyer": market_user.username, 
							"seller": market_owner.username, 
							"item": item.storage()
						   });
	})

	// Purchase the shopping cart
	$(".wddp-mu-buy-item").click(function() {

		for (let item of Object.values(shopping_cart)) {
			if(market_user.buy_item(item)) {
				market_owner.sell_item(item);
			}	
		}

		current_items = market_owner.market_items.reduce((o, value) => (Object.assign(o, {[value.id]:value})), {});;
		shopping_cart = {};

		compute_subtotal(shopping_cart)
		render_all(current_items, market_user);
	})

	$(".wddp-logo").click(function() {
		Farmer.store_farmers(farmers);
		Event.store_event(event);
		window.location = "global_market.html";
	})

	$(".wddp-account").click(function() {
		Farmer.store_farmers(farmers);
		Event.store_event(event);
		window.location = "account.html";
	})
	
	render_all(current_items, market_user);
})

// Convert all items to div's and set them 
// to the html of the item-container
function render_all(items, user) {
	$("#wddp-mu-cash").text("You have " + user.total_money + " left in your account");
	items = Object.values(items);
	$("#wddp-mu-items").html(items.map((x)=>(x.render("store"))).join(""));
}

// Render the subtotal to the screen 
function compute_subtotal(items) {
	$(".wddp-shopping-cart").text("Shopping cart total: $" + Object.values(items).reduce((x, y) => (x + y), 0));
}




