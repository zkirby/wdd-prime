/* RENDER CODE */
/* No need to look below */

// Don't edit this code
$(document).ready(function() {

	
	const farmers = Farmer.get_farmers();

	let event = new Event();
	let event_storage = sessionStorage.getItem("event");
	if (event_storage) {
		event = Event.make_event(event_storage, farmers);
	}

	const market_owner = farmers.get(sessionStorage.getItem("current_market_user"));

	let current_items = market_owner.market_items.reduce((o, value) => (Object.assign(o, {[value.id]:value})), {});

	// Create a new Item and add it to the current_items 
	$("#wddp-ma-input-submit").click(function() {
		let [name, price, nutrients] = scrap_info();

		let new_item = new Item(name, price, nutrients);
		update_item_prices(current_items, event);

		current_items[new_item.id] = new_item;
		render_all(current_items);
		console.log("EVENT", event);
	})

	// Remove an item from the screen/market
	// Need to do a weird click handler bc our items are added to 
	// the screen after the initial render.
	$("#wddp-ma-items-container").on("click", ".delete-item",function() {
		let id = $(this).parent(".card-item").attr("data-id");
		delete current_items[id];
		render_all(current_items);
	})

	$(".wddp-logo").click(function() {
		market_owner.market_items = Object.values(current_items);
		Farmer.store_farmers(farmers);
		Event.store_event(event);
		window.location = "global_market.html";
	})

	$(".wddp-account").click(function() {
		market_owner.market_items = Object.values(current_items);
		Farmer.store_farmers(farmers);
		Event.store_event(event);
		window.location = "account.html";
	})
	
	render_all(current_items);
})

/* HELPER FUNCTIONS */
/* No need to look below */

// Convert all items to div's and set them 
// to the html of the item-container
function render_all(items) {
	let current_items = Object.values(items).reverse();
	let html_elements = current_items.map((x)=>(x.render()));
	$("#wddp-ma-items-container").html(html_elements.join(""));
}

// Update the price 
function update_item_prices(items, event) {
	for (let item of Object.values(items)) {
		item.price = item.price;
		event.publish(item.id, item);
	}
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
