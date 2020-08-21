function DCoin(doer=()=>{}) {
	const fs = require('fs');

	let bank = JSON.parse(fs.readFileSync('lib/dcoin.dat.json').toString())

	let users = []
	for (let user in bank) {
		users.push(bank[user]['username'])
	}

	function sendmoney(from,to,amt,auth) {
		let f = '';
		switch (from) {
			case bank['ran']['userame']:
			f = "proranjiv7"
			break;
			case bank['hri']['userame']:
			f = "HRIDAY"
			break;
			case bank['ris']['userame']:
			f = "RK"
			break;
			default:
			return -1
			break;
		}
		if (users.indexOf(from) != -1 && users.indexOf(to) != -1) {
			if (bank[from]["amt"] > amt && bank[from]['amt'] != 0) {
				return -1
			}
			if (auth != bank[from]['auth']) {
				return -2;
			}
			bank[to]["amt"] += amt
			bank[from]["amt"] -= amt
			return 0;
		}
		return 2
	}
	doer()
	fs.writeFileSync('dcoin.dat.json',JSON.stringify(bank))
}

module.DCoin = DCoin