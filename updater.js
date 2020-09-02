function update_code() {
	const fs = require('fs');

	const exe = require('child_process').execSync;

	const unirest = require('unirest');
	let commit = fs.readFileSync('.vc').toString();
	unirest.get("https://api.github.com/repos/rishit-khandelwal/GameBot/commits/HEAD")
		.headers({"Accept": "application/vnd.github.v3+json", "User-Agent": "GameBot"})
		.then(
			(resp) =>
			{
				commit = resp['body']['commit']['message']
				console.log(commit)
			}
		)

	let time = Date.now();
	

	if (commit != fs.readFileSync('.vc').toString() || (commit != fs.readFileSync('.vc').toString() && Number(fs.readFileSync('time.vc').toString()) >= time+86400)) {
		fs.writeFileSync('time.vc',time)
		console.log("Running updater!")
		console.log(exe("cd .. && git clone https://github.com/rishit-khandelwal/GameBot && echo Delete THIS Folder as the repo is updated").toString())
		fs.renameSync('../GameBot','../GameBot - '+commit)
		console.log("Updated!")
		return 1
	}
	console.log("empty!")
	return -1;
}

exports.update_code = update_code