/* RENDER CODE */
/* No need to look below */

// Don't edit this code
$(document).ready(function() {


	let farmers = new Map();
	let current_farmer = null;

	if (localStorage.getItem("all_farmers")) {
		farmers = Farmer.get_farmers();
	}
	if (sessionStorage.getItem("current_market_user")) {
		let username = sessionStorage.getItem("current_market_user");
		if (farmers.has(username)){
			current_farmer = farmers.get(username);
		}
	}

	let farmer_object = [...farmers.values()];
	$(".wddp-gm-market").html(farmer_object.map((farmer)=>farmer.render()).join(""));
	$(".wddp-gm-name").text("Welcome to WDD Prime, " + current_farmer.name);

	$(".wddp-gm-market").on("click", ".farmer-visit-farm", function() {
		let username = $(this).parent(".farmer-card").attr("data-id");

		if (current_farmer.username === username) {
			window.location = "market_admin.html";
		} else {
			sessionStorage.setItem("current_market_owner", username);
			window.location = "market_user.html";
		}				
	})

	$(".wddp-logout").click(function() {
		sessionStorage.setItem("current_market_user", "");
		sessionStorage.setItem("current_market_owner", "");
		window.location = "login.html";
	})

	$(".wddp-account").click(function() {
		window.location = "account.html";
	})
});












