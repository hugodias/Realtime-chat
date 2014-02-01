
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.room = function(req, res) {
	var id = req.params.id;	
	res.render('room', {
		title: 'Private Room'
	});
}