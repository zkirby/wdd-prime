/* ===== Question 1 START ===== */

function account_clear(current_account, farmers){
	Farmer.store_farmers(farmers);
	sessionStorage.setItem("current_market_user", current_account.username);
	window.open("global_market.html", "_self");
}

/* ===== Question 1 END ===== */

/* Don't edit below this line */
$(document).ready(function() {

	// Safely returns a map of all
	// locally stored farmers 
	let farmers = Farmer.get_farmers();
	

	// Generate a Few Pre-made Accounts, feel free to comment out.
	generate_accounts(farmers);

	// Checks the account information for a login attempt
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

// Get the values from the inputs
function get_login() {
	return $("input").toArray().map((x)=>{
		let t = x.value;
		x.value="";
		return t;
	});
}

// Animate a bad account error
function raise_bad_account_error(error_message) {
	$("#wddp-login-error").text(error_message);
	$("#wddp-login-error").show().fadeOut(2000);
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
				      new Farmer("Ryan", "corn", 100, "Ryan", "ryan.jpg")]
				   ];

  	for (let account of accounts) {
  		if (!farmers.has(account[0])) {
  			farmers.set(account[0], account[1]);
  		}
  	}
}












