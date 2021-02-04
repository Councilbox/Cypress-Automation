const urlParser = obj => {
	let query = "";
		let name;
		let value;
		let fullSubName;
		let subName;
		let subValue;
		let innerObj;
		let i;

	for (name in obj) {
		if (name) {
			value = obj[name];

			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + "[" + i + "]";
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += urlParser(innerObj) + "&";
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					if (subName) {
						subValue = value[subName];
						fullSubName = name + "[" + subName + "]";
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += urlParser(innerObj) + "&";
					}
				}
			} else if (value !== undefined && value !== null) {
				query +=
					encodeURIComponent(name) +
					"=" +
					encodeURIComponent(value) +
					"&";
			}
		}
	}
	return query.length ? query.substr(0, query.length - 1) : query;
};

export default urlParser;
