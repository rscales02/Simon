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

//make game faster with each loop
var round = 0;
var aTime = 500;

//allow for exiting of game structure when game is off
var isRunning = true;
var isStrict = false;


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
            $('#counter').val('0' + 0);
            aTime = 500;
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
    var combination = combo || [];
    var next = callNext();
    var i = 0; //increment
    var click = false; //var to check game time out
    var dTime = time || 5000;
    var repeatDelay = null;

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
            repeatDelay = setInterval(function() {
                console.log('no click');
                if (isStrict) {
                    $('#counter').val('! !');
                    loseAudio.play();
                    clearInterval(repeatDelay);
                    $('.game').off();
                    return;
                } else {
                    loseTimer(combination);
                }
            }, dTime);
        }
        //user input
        $('.game').click(function() {
            var userClick = $(this).attr('id');
            click = true;

            clickSound(userClick);

            clearInterval(repeatDelay);

            repeatDelay = setInterval(function() {
                if (isStrict) {
                    $('#counter').val('! !');
                    loseAudio.play();
                    clearInterval(repeatDelay);
                    $('.game').off();
                    return;
                } else {
                    console.log('click');
                    loseTimer(combination);
                    i = 0;
                }
            }, dTime);

            if (userClick == combination[i]) {
                i++;
                if (i == combination.length) {
                    $('.game').off();
                    clearInterval(repeatDelay);
                    //score adjust at end of round
                    
                    //increase game speed at end of round
                    aTime = aTime > 200 ? aTime - 5 : aTime;
                    //recursivly call new round
                    dTime = dTime + 500;
                    round++;
                    gameStart(combination, dTime);
                }
            } else {
                if (isStrict) {
                    $('#counter').val('! !');
                    loseAudio.play();
                    clearInterval(repeatDelay);
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
    var dTime = aTime + 50; //delay interval, based on changing game speed

    var delay = setInterval(function() {

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
    }, dTime);
}

//button indication of simon's pattern
function activate(button) {

    switch (button) {
        case 0:
            $('#0').addClass('greenactive');
            audio0.play();
            setTimeout(function() {
                $('#0').removeClass('greenactive');
            }, aTime);

            break;
        case 1:
            $('#1').addClass('redactive');
            audio1.play();
            setTimeout(function() {
                $('#1').removeClass('redactive');
            }, aTime);

            break;
        case 2:
            $('#2').addClass('blueactive');
            audio2.play();
            setTimeout(function() {
                $('#2').removeClass('blueactive');
            }, aTime);
            break;
        case 3:
            $('#3').addClass('yellowactive');
            audio3.play();
            setTimeout(function() {
                $('#3').removeClass('yellowactive');
            }, aTime);
            break;
    }
}

function loseTimer(combination) {
    $('#counter').val('! !');
    loseAudio.play();
    i = 0;
    patternInditcator(combination);
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










/*
 it might be good to prevent clicking on the buttons when you are playing the sequence? 
 It looks like you only have "strict" mode implemented? 
 It looks pretty good, though - the color changes are a little "weak". 
 And I'm finding the response to the clicks to not always be clean - sometimes I click twice and it only looks like I clicked once. 
 And I think that I just had it shoot me after I got the correct sequence in and didn't press another button? 
 I just got it into some kind of mode where I push the start button and it shoots almost right away. 
 Even shooting again after I moved away from the board?
 */