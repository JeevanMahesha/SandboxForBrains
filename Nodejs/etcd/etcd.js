const { Etcd3 } = require("etcd3");

let options = {
	auth: {
		username: "USERNAME",
		password: "PASSWORD",
	},
	hosts: ["IP:PORT"],
};
const etcdClient = new Etcd3(options);
const pocName = etcdClient.namespace("PATH_IF_NEEDED");

const watchTheKeyValueChange = async (key) => {
	return pocName.watch().key(key).create();
};

const getValueFromETCD = async (key) => {
	return pocName.get(key).string();
};

const putValuetoETCD = async (key, value) => {
	await pocName.put(key).value(value);
};

module.exports = {
	watchTheKeyValueChange,
	getValueFromETCD,
};
