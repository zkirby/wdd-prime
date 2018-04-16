// Don't edit this code
$(document).ready(function() {


	let farmers = Farmer.get_farmers();;
	let current_farmer = null;

	// Get the current user if they exist
	if (sessionStorage.getItem("current_market_user")) {
		let username = sessionStorage.getItem("current_market_user");
		if (farmers.has(username)){
			current_farmer = farmers.get(username);
		}
	}


	// Page setup. Renders the farmers to the screen. 
	let farmer_object = [...farmers.values()];
	$(".wddp-gm-market").html(farmer_object.map((farmer)=>farmer.render()).join(""));
	$(".wddp-gm-name").text("Welcome to WDD Prime, " + current_farmer.name);

	// Listen for a farmer visit and move to the admin
	// panel or a visiting market depending on the action.
	$(".wddp-gm-market").on("click", ".farmer-visit-farm", function() {
		let username = $(this).parent(".farmer-card").attr("data-id");
		if (current_farmer.username === username) {
			window.open("market_admin.html", "_self");
		} else {
			sessionStorage.setItem("current_market_owner", username);
			window.open("market_user.html", "_self");
		}				
	})

	// Logout a user. 
	$(".wddp-logout").click(function() {
		sessionStorage.setItem("current_market_user", "");
		sessionStorage.setItem("current_market_owner", "");
		window.open("login.html", "_self");
	})
});














