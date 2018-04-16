// Don't edit this code
$(document).ready(function() {


	const farmers = Farmer.get_farmers();
	const market_owner = farmers.get(sessionStorage.getItem("current_market_user"));

	// Page setup. Convert the curren_items to an object for optimzation reasons.
	let current_items = market_owner.purchased_items.reduce((o, value) => (Object.assign(o, {[value.id]:value})), {});
	$(".wddp-acc-watch-header").text("Your current watch limit: $" + market_owner.price_limit);
	$(".wddp-acc-cash-header").text("Your current total cash: " + market_owner.total_money);
	
	// Update account info 
	$("#wddp-acc-input-submit").click(function() {
		let [name, price_limit] = scrap_info();
		if (name !== "") {
			market_owner.name = name;
		} 
		if (price_limit !== -1) {
			market_owner.price_limit = price_limit;
			$(".wddp-acc-watch-header").text("Your current watch limit: $" + market_owner.price_limit);
		}
	})

	$(".wddp-logo").click(function() {
		Farmer.store_farmers(farmers);
		window.open("global_market.html", "_self");
	})
	
	render_all(current_items);
})


// Convert all items to div's and set them 
// to the html of the item-container
function render_all(items) {
	let current_items = Object.values(items).reverse();
	let html_elements = current_items.map((x)=>(x.render("purchased")));
	$("#wddp-acc-items-container").html(html_elements.join(""));
}

// Get the name, price, and nutrients
function scrap_info() {
	let name = $("#wddp-acc-input-name > input");
	let price_limit = $("#wddp-acc-input-price > input");

	let to_return = [name.val(), parseInt(price_limit.val())];

	name.val("");
	price_limit.val(-1);

	return to_return
}
