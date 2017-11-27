$(document).ready(function() {
    //initial function to turn game on
    $('#onBtn').click(function() {
        var on = $('#onBtn').val();
        if (on == 0) {
            $('#counter').val('0' + 0);
            readyStatus();
            on += 1;
            $('#onBtn').val(on);
        } else {
            offStatus();
            on -= 1;
            $('#onBtn').val(on);
            isRunning = false;
        }
    });
});

//audio to load for buttons and end-of-game
const audio0 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
const audio1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
const audio2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
const audio3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
const loseAudio = new Audio('https://actions.google.com/sounds/v1/weapons/big_explosion_cut_off.ogg');
const winAudio = new Audio('https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-four/cartoon_success_fanfair.mp3');
const repeatDelay = createTimer();

//make game faster with each loop
var round = 0;

//allow for exiting of game structure when game is off
var isRunning = true;
var isStrict = false;

var combination;
var i = 0; //increment

function readyStatus() {

    if (isRunning) {
        $('#counter').removeClass('invisible');

        $('#strict').click(function() {
            $('#strict-light').toggleClass('light');
            $('#strict-light').toggleClass('lightactive');

            strictify();
        });

        $('#start').click(function(event) {
            /* Act on the event */
            repeatDelay.reset();
            $('#counter').val('0' + 0);
            gameStart();
            isRunning = false;
        });
    } else {
        return;
    }
}

function strictify() {
    isStrict = isStrict == false ? true : false;
    console.log(isStrict);
    return;
}

function gameStart(combo, time) {
    combination = combo || [];
    var next = callNext();
    i = 0;
    var click = false; //var to check game time out
    var dTime = time || 5000;
    

    if (round == 20) {
        winAudio.play();
        return;
    } else {
        combination.push(next);

        counterUp(combination);
        console.log(combination);

        //interval to space out pattern activation
        patternInditcator(combination);
        
        //end-of-game timeout due to inactivity
        if (!click) {
        	repeatDelay.reset();
            repeatDelay.start();
        }
        //user input
        $('.game').click(function() {
        	repeatDelay.reset();
        	repeatDelay.start();

            var userClick = $(this).attr('id');
            click = true;

            clickSound(userClick);

            if (userClick == combination[i]) {
                i++;
                if (i == combination.length) {
                    $('.game').off();
                    repeatDelay.reset();

                    //recursivly call new round
                    dTime = dTime + 500;
                    round++;
                    gameStart(combination, dTime);
                }
            } else {
                if (isStrict) {
                	repeatDelay.reset();
                    $('#counter').val('! !');
                    loseAudio.play();
                    $('.game').off();
                    return;
                } else {
                    //delay to account for already playing sounds
                    setTimeout(function() {
                        $('#counter').val('! !');
                        loseAudio.play();
                        //revert back to ready status
                        i = 0;
                        patternInditcator(combination);
                    }, 500);
                }
            }
        });
    }
}


function callNext() {
    var nextNumber = Math.floor(Math.random() * 4);
    return nextNumber;
}

function patternInditcator(combination) {
    var j = 0; //increment


    var delay = setInterval(function() {
    	repeatDelay.reset();
        if (j < combination.length) {

            //interval to space out multiples of the same button
            if (combination[j] === combination[j - 1]) {
                let jCopy = j;
                setTimeout(function() {

                    activate(combination[jCopy]);
                }, 200);

            } else {
                activate(combination[j]);
            }
        } else {
            clearInterval(delay);
        }
        j++;
        repeatDelay.start();
    }, 550);

}

//button indication of simon's pattern
function activate(button) {

    switch (button) {
        case 0:
            $('#0').addClass('greenactive');
            audio0.play();
            setTimeout(function() {
                $('#0').removeClass('greenactive');
            }, 500);

            break;
        case 1:
            $('#1').addClass('redactive');
            audio1.play();
            setTimeout(function() {
                $('#1').removeClass('redactive');
            }, 500);

            break;
        case 2:
            $('#2').addClass('blueactive');
            audio2.play();
            setTimeout(function() {
                $('#2').removeClass('blueactive');
            }, 500);
            break;
        case 3:
            $('#3').addClass('yellowactive');
            audio3.play();
            setTimeout(function() {
                $('#3').removeClass('yellowactive');
            }, 500);
            break;
    }
}

function clickSound(button) {
    if (button == 0) {
        audio0.play();
    } else if (button == 1) {
        audio1.play();
    } else if (button == 2) {
        audio2.play();
    } else {
        audio3.play();
    }
}

function counterUp(combo) {
	var score = combo.length;
    score = score < 10 ? '0' + score : score;
    $('#counter').val(score);
}

function offStatus() {
    $('#counter').addClass('invisible');
}

function createTimer(){
	var interval = null;
	var countdown = 5;

	var runOut = function(){
		if (countdown == 0){
			$('#counter').val('! !');
			loseAudio.play();
			countdown = 5;
			i = 0;

			if (isStrict){
				timer.reset();
				$('.game').off();
			} else {
				patternInditcator(combination);
			}

		} else {
			--countdown;
		}
	};

	var timer = {
		start: function(){
			if (!interval){
				runOut();
				interval = setInterval(runOut, 1000);
			}
		},
		pause: function(){
			if (interval){
				clearInterval(interval);
				interval = null;
			}
		},
		reset: function(){
			countdown = 5;
			this.pause();
		}
	};
	return timer;
}








/*
 it might be good to prevent clicking on the buttons when you are playing the sequence? 
 It looks like you only have "strict" mode implemented? 
 It looks pretty good, though - the color changes are a little "weak". 
 And I'm finding the response to the clicks to not always be clean - sometimes I click twice and it only looks like I clicked once. 
 And I think that I just had it shoot me after I got the correct sequence in and didn't press another button? 
 I just got it into some kind of mode where I push the start button and it shoots almost right away. 
 Even shooting again after I moved away from the board?
 */