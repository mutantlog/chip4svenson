var fs = require('fs');

var Twit  = require('twit'); // Twitter module

var T = new Twit(require('./config.js'));
  
var debug = false;

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function tweetChip4Svenson(tweetText,svenPic,chipPic) {
	if (debug) {
		console.log(tweetText);
	}
	else {
		T.post('media/upload', {media_data: svenPic}, function (err, data, response) {
		var svenIdStr = data.media_id_string;
		var svenText = "A photo of Mr. Svenson, the janitor from Archie";
		var sven_meta_params = { media_id: svenIdStr, altText: { text: svenText } };

		T.post('media/upload', {media_data: chipPic}, function(err, data, response) {
			var chipIdStr = data.media_id_string;
			var chipText = "A photo of Chip Zdarsky, the ideal person to portray Mr Svenson on the CW's Riverdale";
			var chip_meta_params = { media_id: chipIdStr, altText: { text: chipText } };
				if (!err) {
					var params = { status : tweetText, media_ids : [svenIdStr, chipIdStr] };
					T.post('statuses/update', params, function (err, data, response) {
						if (err) {
							console.log('There was an error with Twitter:', error);
						}
					});
				}
			});
		});
	}			
}

var svenPics = getFiles('svenson_pics');
var chipPics = getFiles('chip_pics');
var strings = [
"Just look at the resemblance. Chip Zdarsky is the only choice for Svenson on #Riverdale #Chip4Svenson",
"OMG you can't have Mr. Svenson not be played by Mr. Zdarsky! #Riverdale #Chip4Svenson",
"THAT GUY (YOU KNOW, CHIP ZDARSKY) SHOULD PLAY MR SVENSON! #Riverdale #Chip4Svenson",
"Only one man would sweep a high school hallway to be Mr. Svenson: Chip Zdarsky #Riverdale #Chip4Svenson",
"Zdarsky 4 Svenson! #Riverdale #Chip4Svenson",
"By Yiminy! Chip Zdarsky has spent his whole life preparing to play Mr. Svenson! #Riverdale #Chip4Svenson",
"Dilton Doiley says \"Chip Zdarsky is the only logical choice for Mr. Svenson!\" #Riverdale #Chip4Svenson",
"Moose may be dumb, but not so dumb he doesn't know Chip Zdarsky should be Mr. Svenson #Riverdale #Chip4Svenson",
"Jughead Jones would swear off burgers for a week if Chip Zdarsky could play Mr. Svenson #Riverdale #Chip4Svenson",
"Look, Chip wants to be Mr. Svenson, do these pics prove his point? Who knows? #Riverdale #Chip4Svenson",
"Sure, one's Swedish, the other's Canadian, but can you tell which one's which? #Riverdale #Chip4Svenson",
"He'll be really good and he won't look directly into camera he swears #Riverdale #Chip4Svenson",
"If Chip Zdarsky were to play Mr. Svenson on #Riverdale it would be A Very Nice Time! #Chip4Svenson",
"He'll bring his own broom from home! #Riverdale #Chip4Svenson"
];
var svenFile = svenPics[Math.floor(Math.random() * svenPics.length)];
var chipFile = chipPics[Math.floor(Math.random() * chipPics.length)];
var tweet = strings[Math.floor(Math.random() * strings.length)];

var svenPic = fs.readFileSync (svenFile, {encoding: 'base64'});
var chipPic = fs.readFileSync (chipFile, {encoding: 'base64'});

tweetChip4Svenson(tweet ,svenPic, chipPic);