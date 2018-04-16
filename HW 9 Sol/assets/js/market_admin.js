/* ==== Question 2.2 START ==== */

function update_item_prices(items, event) {
	for (let item of Object.values(items)) {
		item.price = item.price;
		event.publish(item.id, item);
	}
}

/* ==== Question 2.2 END ==== */

// Don't edit this code
$(document).ready(function() {

	const farmers = Farmer.get_farmers();
	const event = Event.make_event(farmers);
	const market_owner = farmers.get(sessionStorage.getItem("current_market_user"));

	let current_items = market_owner.market_items.reduce((o, value) => (Object.assign(o, {[value.id]:value})), {});

	// Create a new Item and add it to the current_items 
	$("#wddp-ma-input-submit").click(function() {
		let [name, price, nutrients] = scrap_info();

		let new_item = new Item(name, price, nutrients);
		update_item_prices(current_items, event);
		
		market_owner.market_items = market_owner.market_items.concat([new_item]);

		current_items = market_owner.market_items.reduce((o, value) => (Object.assign(o, {[value.id]:value})), {});
		render_all(current_items);
	})

	// Remove an item from the screen/market
	$("#wddp-ma-items-container").on("click", ".delete-item",function() {
		let id = $(this).parent(".card-item").attr("data-id");
		delete current_items[id];
		render_all(current_items);
	})

	$(".wddp-logo").click(function() {
		market_owner.market_items = Object.values(current_items);
		Farmer.store_farmers(farmers);
		Event.store_event(event);
		window.open("global_market.html", "_self");
	})

	$(".wddp-account").click(function() {
		market_owner.market_items = Object.values(current_items);
		Farmer.store_farmers(farmers);
		Event.store_event(event);
		window.open("account.html", "_self");
	})
	
	render_all(current_items);
})

// Convert all items to div's and set them 
// to the html of the item-container
function render_all(items) {
	let current_items = Object.values(items).reverse();
	let html_elements = current_items.map((x)=>(x.render()));
	$("#wddp-ma-items-container").html(html_elements.join(""));
}

// Get the name, price, and nutrients
function scrap_info() {
	let name = $("#wddp-ma-input-name > input");
	let price = $("#wddp-ma-input-price > input");
	let nutrients = $("#wddp-ma-input-nutrients > input");

	let to_return = [name.val(), parseInt(price.val()), nutrients.val().split(",")];

	name.val("");
	price.val(0);
	nutrients.val("");

	return to_return
}
