$(document).ready(function() {

	let farmers = new Map();

	// Check if the local storage has the 
	if (localStorage.getItem("all_farmers")) {
		farmers = Farmer.get_farmers();
	}

	// Generate a Few Accounts
	generate_accounts(farmers);

	$("#wddp-login-submit").click(function() {
		let [user_name, password] = get_login();

		if (farmers.has(user_name)) {
			let farmer_potential = farmers.get(user_name);
			if (farmer_potential.check_pass(password)) {
				account_clear(farmer_potential, farmers);
			} else {
				raise_bad_account_error("Password Incorret");
			}
		} else {

			if (farmers.size <= 10) {
				let new_farmer = new Farmer(user_name, password);
				farmers.set(user_name, new_farmer);
				account_clear(new_farmer, farmers);
			} else {
				raise_bad_account_error("Max Accounts created");
			}
		}
	})
})

function get_login() {
	let username = $("#wddp-login-username > input");
	let password = $("#wddp-login-password > input");

	let to_return = [username.val(), password.val()];

	username.val("");
	password.val("");

	return to_return
}

function raise_bad_account_error(error_message) {
	$("#wddp-login-error").text(error_message);
	$("#wddp-login-error").show().fadeOut(2000);
}

function account_clear(current_account, farmers){
	Farmer.store_farmers(farmers);
	sessionStorage.setItem("current_market_user", current_account.username);
	window.location = "global_market.html";
}

function generate_accounts(farmers) {
	let market_items = {
		"Zach": [new Item("Wheat Bread", 20, ["wheat", "bread"]),
				 new Item("White Bread", 31, ["wheat", "bread"]),
				 new Item("Whole Bread", 12, ["wheat", "bread"])],
		"Emily":[new Item("Bananas", 5, ["bananas"]),
				 new Item("Small Bananas", 12, ["small", "bananas"]),
				 new Item("Happy Bananas", 40, ["weed", "love"])]
	}

	let bought_items = {
		"Zach": [new Item("Banana", 12, ["wheat", "bread"])]
	}

	let accounts = [
					[ "Zach", 
					  new Farmer("Zach", "apples", 100, "Zach", "zachary.jpg", market_items["Zach"], bought_items["Zach"])], 
	 			    [ "Emily", 
	 			      new Farmer("Emily", "ban", 100, "Emily", "emily.jpg", market_items["Emily"])], 
				    [ "Ryan", 
				      new Farmer("Ryan", "corn")]
				   ];

  	for (let account of accounts) {
  		if (!farmers.has(account[0])) {
  			farmers.set(account[0], account[1]);
  		}
  	}
}












