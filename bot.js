var fs = require('fs'); // File system library

var Twit  = require('twit'); // Twitter module

var T = new Twit(require('./config.js')); // Important to include the Twitter keys!
  
var debug = false;

function getFiles (dir, files_){ // Given a directory, add to an array of all the files. I must have copied this function from somewhere
    files_ = files_ || []; // Populate an empty array if necessary
    var files = fs.readdirSync(dir); // Get a list of all the files
    for (var i in files){ // Go through that list of files
        var name = dir + '/' + files[i]; // Concatenate the directory and file name
        if (fs.statSync(name).isDirectory()){ // If it's a directory, recurse down the tree
            getFiles(name, files_);
        } else { // Otherwise, add the file to the array
            files_.push(name);
        }
    }
    return files_; // And return the list of files
}

function tweetChip4Svenson(tweetText,svenPic,chipPic) { // Main Tweeting function once the files are known
	if (debug) { // Let's me play with the code without Tweeting
		console.log(tweetText);
	}
	else {
		T.post('media/upload', {media_data: svenPic}, function (err, data, response) { // First upload a pic of Svenson
			if (!err) {
				var svenIdStr = data.media_id_string; // Get the identifier for the pic
				var svenText = "A photo of Mr. Svenson, the janitor from Archie"; // Write alt text for the picture
				var sven_meta_params = { media_id: svenIdStr, alt_text: { text: svenText } }; // Create an identifier for the pic and alt text
				T.post('media/metadata/create', sven_meta_params, function(err, data, response) { // Post the metadata to Twitter
					if (!err) {
						T.post('media/upload', {media_data: chipPic}, function(err, data, response) { // Now we'll repeat for a photo of Chip
							if (!err) {
								var chipIdStr = data.media_id_string;
								var chipText = "A photo of Chip Zdarsky, the ideal person to portray Mr Svenson on the CW's Riverdale";
								var chip_meta_params = { media_id: chipIdStr, alt_text: { text: chipText } };
								T.post('media/metadata/create', chip_meta_params, function(err, data, response) {
									if (!err) {
										var params = { status : tweetText, media_ids : [svenIdStr, chipIdStr] }; // Ok, both images are ready with Metadata
										T.post('statuses/update', params, function (err, data, response) { // Let's tweet!
											if (err) {
												console.log('There was an error with Twitter:', err);
											}
										});
									}
									else {
										console.log('There was an error with Twitter:', err);
									}
								});
							}
							else {
								console.log('There was an error with Twitter:', err);
							}
						});
					}
					else {
						console.log('There was an error with Twitter:', err);
					}
				});
			}
			else {
				console.log('There was an error with Twitter:', err);
			}
		});
	}			
}

var svenPics = getFiles('svenson_pics'); // Create an array of all the pics of Svenson
var chipPics = getFiles('chip_pics'); // And an array of all the pics of Chip 
var strings = [ // And an array of a bunch of Tweets for the bot to post
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
var svenFile = svenPics[Math.floor(Math.random() * svenPics.length)]; // And we'll pick one of Svenson at random
var chipFile = chipPics[Math.floor(Math.random() * chipPics.length)]; // One of Chip at random
var tweet = strings[Math.floor(Math.random() * strings.length)]; // And a tweet at random

var svenPic = fs.readFileSync (svenFile, {encoding: 'base64'}); // Let's read in the pic of Svenson in the format twit needs
var chipPic = fs.readFileSync (chipFile, {encoding: 'base64'}); // And read in the pic of Chip

tweetChip4Svenson(tweet ,svenPic, chipPic); // And now let's go tweet!