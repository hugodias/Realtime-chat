module.exports = {
	getCurrentTime: function() {
		var x = new Date();
		return x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds();
	}
}