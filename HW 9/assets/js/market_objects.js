class Farmer {
	constructor(username, password, total_money=100, name="", image="default.png", market_items=[], purchased_items=[], price_limit=4.5) {
		this.username = username;
		this.password = password;

		this._total_money = total_money;
		this._name = name;
		this._image = image;
		this._price_limit = price_limit;
		this._market_items = market_items;
		this._purchased_items = purchased_items;
	}

	get total_money() {
		return "$" + this._total_money;
	}

	get market_items() {
		return this._market_items;
	}

	get purchased_items() {
		return this._purchased_items;
	}

	get price_limit() {
		return this._price_limit;
	}

	set price_limit(price) {
		this._price_limit = price;
	}

	set market_items(items) {
		this._market_items = items;
	}

	get market_id() {
		return this._market_id + "";
	}

	get name() {
		if (this._name !== "") {
			return this._name;
		}
		return this.username;
	}

	set name(new_name) {
		this._name = new_name;
	}

	set image(img){
		this._image = img;
	}

	get image() {
		return "./assets/images/" + this._image;
	}

	// Returns a list of all farmers 
	static get_farmers() {
		let farmers_storage = JSON.parse(localStorage.getItem("all_farmers"));

		return new Map(farmers_storage.map((farmer)=>(Farmer.farmer_from_storage(farmer, true))))
	}

	// Stores the farmers in localStorage
	static store_farmers(farmers) {
		let storagble_farmers = [...farmers].map((x)=>(x[1].storage()));
		localStorage.setItem("all_farmers", JSON.stringify(storagble_farmers));
	}

	// Build a farmer from a .storage() call
	static farmer_from_storage(contents, tuple=false) {
		let [password, username, total_money, name, image, market_items, purchased_items, price_limit] = contents;
		market_items = market_items.map((item)=> (new Item(...item)));
		purchased_items = purchased_items.map((item)=> (new Item(...item)));

		let new_farmer = new Farmer(username, password, total_money, name, image, market_items, purchased_items, price_limit);

		return tuple ? [username, new_farmer] : new_farmer;
	}

	buy_item(item) {
		if (this._total_money - item.price >= 0) {
			this._total_money -= item.price;
			this._purchased_items.push(item);
			return true;
		} 
		return false;
		
	}

	sell_item(item) {
		this._total_money += item.price;
		for (let i = 0; i < this._market_items.length; i++) {
			if (this._market_items[i].id === item.id) {
				this._market_items.splice(i, 1);
			}
		}
	}

	check_buy(item) {
		if(item.price <= this.price_limit) {
			console.log("ITEM", item.name)
			this.buy_item(item);
			return true;
		}	
		return false;
	}

	check_pass(pass) {
		return this.password === pass;
	}

	storage() {
		return [this.password, 
				this.username,
				this._total_money,
				this._name, 
				this._image, 
				this._market_items.map((x)=>(x.storage())),
				this._purchased_items.map((x)=>x.storage()),
				this._price_limit];
	}

	render() {
		return "<div class='farmer-card' data-id='" + this.username+ "'>" + 
					"<img src='" + this.image + "'/>" + 
					"<div class='farmer-header'>" + this.name + "</div>" + 
					"<div class='farmer-visit-farm'></div>" + 
				"</div>";
	}
}

class Item {
	constructor(name, price, nutrients, id=Math.random(), subscribers) {
		this.name = name;
		this._nutrients = nutrients;
		this._price = price;	      
		
		this.id = id + ""; // Unique produce ID. Why can't we use a Symbol for this? 
		this.in_shopping_cart = false; 
	}

	set nutrients(value) {
		if (typeof value === "string") {
			this._nutrients.push(value)
		} else if (Array.isArray(value)) {
			this._nutrients.push(...value)
		}
	}

	get nutrients() {
		return this.name + " has nutrients: " + this._nutrients.join(", ")
	}

	set price(value) {
		this._price = Math.round(value * .95 * 100) / 100;
	}

	get price() {
		return this._price;
	}

	[Symbol.toPrimitive](hint) {
		if (hint == 'number' || hint == 'default') {
			return this.price;
		}
		return null;
	}

	storage() {
		return [this.name, this._price, this._nutrients, this.id];
	}

	render(usermode="") {

		let active_class = "not-in-cart";

		if (this.in_shopping_cart) {
			active_class = "in-cart";
		}

		if (usermode === "store") {
			return (
				"<div class=\"card-item " + active_class + "\" data-id=" + this.id + ">" + 
				 	"<div class='card-name'>" + this.name + "</div>" + 
				 	"<div class='card-price'>" + this.price + "</div>" + 
				 	"<div class='card-watch'></div>" + 
				 	"<div class='add-to-cart'></div>" + 
				"</div>"
			)
		} else if (usermode === "purchased") {
			return (
				"<div class=\"card-item " + active_class + "\" data-id=" + this.id + ">" + 
				 	"<div class='card-name'>" + this.name + "</div>" + 
				 	"<div class='card-price'>" + this.price + "</div>" + 
				"</div>"
			)
		}
		return (
			"<div class=\"card-item " + active_class + "\" data-id=" + this.id + ">" + 
			 	"<div class='card-name'>" + this.name + "</div>" + 
			 	"<div class='card-price'>" + this.price + "</div>" + 
			 	"<div class='delete-item'>&times;</div>" + 
			"</div>"
		)
	}
}

class Event {
	constructor(topics={}, store={}) {
		this.topics = topics;
		this.store = store;
	}

	subscribe(topic, fn) {
		if (this.topics[topic]){
			this.topics[topic].push(fn);
		} else {
			this.topics[topic] = [fn];
		}
	}

	publish(topic, data) {
		if(this.topics[topic]){
			this.topics[topic].map((fn)=>(fn(data)));
		}
	}

	register(topic, info) {
		if(this.store[topic]){
			this.store[topic].push(info);
		} else {
			this.store[topic] = [info];
		}
	}

	static make_event(event_storage, farmers) {
		let store = JSON.parse(event_storage);
		let topics = {}

		for (let topic of Object.keys(store)) {
			let current_topic = store[topic];
			topics[topic] = current_topic.map((info)=>{
				let buyer = farmers.get(info["buyer"]);
				let seller = farmers.get(info["seller"]);
				let item = new Item(...info["item"]);

				return (x)=>{
					if(buyer.check_buy(x)){
						seller.sell_item(x);
					}
				};
			})
		}
		return new Event(topics, store);
	}

	static store_event(event) {
		sessionStorage.setItem("event", JSON.stringify(event.store));
	}
}




