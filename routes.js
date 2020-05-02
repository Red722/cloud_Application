var db = require('./database'),
	photos = db.photos,
	users = db.users;


module.exports = function(app){


	app.get('/', function(req, res){

		
		photos.find({}, function(err, all_photos){

			
			users.find({ip: req.ip}, function(err, u){

				var voted_on = [];

				if(u.length == 1){
					voted_on = u[0].votes;
				}

				

				var not_voted_on = all_photos.filter(function(photo){
					return voted_on.indexOf(photo._id) == -1;
				});

				var image_to_show = null;

				if(not_voted_on.length > 0){
					
					image_to_show = not_voted_on[Math.floor(Math.random()*not_voted_on.length)];
				}

				res.render('home', { photo: image_to_show });

			});

		});

	});

	app.get('/standings', function(req, res){

		photos.find({}, function(err, all_photos){

			

			all_photos.sort(function(p1, p2){
				return (p2.likes - p2.dislikes) - (p1.likes - p1.dislikes);
			});

			
			res.render('standings', { standings: all_photos });

		});

	});

	
	app.post('*', function(req, res, next){

		
		var userIp=req.ip;

		users.insert({
			ip: userIp,
			votes: []
		}, function(){
			
			next();
		});
		
	});

	app.post('/notcute', vote);
	app.post('/cute', vote);

	function vote(req, res){

		

		var what = {
			'/notcute': {dislikes:1},
			'/cute': {likes:1}
		};

		

		photos.find({ name: req.body.photo }, function(err, found){

			if(found.length == 1){

				photos.update(found[0], {$inc : what[req.path]});

				users.update({ip: req.ip}, { $addToSet: { votes: found[0]._id}}, function(){
					res.redirect('../');
				});

			}
			else{
				res.redirect('../');
			}

		});
	}
};