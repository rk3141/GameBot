function update_code() {
	const fs = require('fs');

	const exe = require('child_process').execSync;

	const unirest = require('unirest');
	let commit;
	unirest.get("https://api.github.com/repos/rishit-khandelwal/GameBot/commits/HEAD")
		.headers({"Accept": "application/vnd.github.v3+json", "User-Agent": "GameBot"})
		.then(
			(resp) =>
			{
				commit = resp['body']['commit']['message']
			}
		)

	let time = Date.now();
	

	if (commit != fs.readFileSync('.vc').toString() || (commit != fs.readFileSync('.vc').toString() && Number(fs.readFileSync('time.vc').toString()) >= time+86400)) {
		fs.writeFileSync('time.vc',time)
		exe("cd .. && git clone https://github.com/rishit-khandelwal/strops && echo Delete THIS Folder as the repo is updated").toString()
		fs.renameSync('GameBot','GameBot - '+fs.readFileSync('..\\GameBot\\.vc').toString())
	}
}