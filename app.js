var builder = require('botbuilder');
var restify = require('restify');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
var intents = new builder.IntentDialog();
var name;
var fortune;
var mash = ['mansion', 'apartment', 'shack', 'house'];
var people = [];
var kids = [];
var transportation = [];

intents.onDefault([
    function (session) {
        session.beginDialog('/welcome');
    }
]);

bot.dialog('/welcome', [
    function (session) {
        session.send('Hi! I\'m MASHbot! To begin a new game, type \'mash\'. To review the instructions, type \'instructions\'. You can type \'stop\' at any time to end this conversation.');
        session.endDialog();
    }
]);

intents.matches(/^instructions/i, [
    function (session) {
        session.delay(1000);
        session.send('M A S H means \'mansion\', \'apartment\', \'shack\', and \'house\'. MASH is a fortune telling game.');
        session.delay(2500);
        session.send('I will ask you for three different names, numbers, and modes of transportation.');
        session.delay(2500);
        session.send('Then sit back as I reveal your future!');
        session.delay(2500);
        session.send('When you\'re ready, type \'mash\' to begin.');
        session.endDialog();
    }
])

intents.matches(/^mash/i, [
    function (session) {
        session.send('Great let\'s play!');
        session.delay(1000);
        session.beginDialog('/people');
    },
    function (session) {
        session.beginDialog('/kids');
    },
    function (session) {
        session.beginDialog('/transportation');
    },
    function (session) {
        session.beginDialog('/magic')
    }
]);

bot.dialog('/people', [
    function (session) {
        builder.Prompts.text(session, 'Name a person');
    },
    function (session, results) {
        people[0] = results.response;
        builder.Prompts.text(session, 'Name a different person');
    },
    function (session, results) {
        if (invalidResponse(people, results.response)) {
            session.send('You can\'t use the same response twice');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            people = []; //reset array
            session.replaceDialog('/people', { reprompt: true });
        } else {
            people[1] = results.response;
            builder.Prompts.text(session, 'Name a third and final person');
        }
    },
    function (session, results) {
        if (invalidResponse(people, results.response)) {
            session.send('You can\'t use the same response twice');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            people = [];
            session.replaceDialog('/people', { reprompt: true });
        } else {
            people[2] = results.response;
            session.send('Great! You entered %s, %s, and %s!', people[0], people[1], people[2]);
            session.delay(1000);
            session.endDialog();
        }
    }
]);

bot.dialog('/kids', [
    function (session) {
        builder.Prompts.number(session, 'Enter a positive, whole number');
    },
    function (session, results) {
        if (invalidNumber(results.response)) {
            session.send('You can\'t use that number.');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            kids = [];
            session.replaceDialog('/kids', { reprompt: true });
        } else if (invalidResponse(kids, results.response)) {
            session.send('You can\'t use the same response twice');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            kids = [];
            session.replaceDialog('/kids', { reprompt: true });
        } else {
            kids[0] = results.response;
            builder.Prompts.number(session, 'Enter another positive number');
        }
    },
    function (session, results) {
        if (invalidNumber(results.response)) {
            session.send('You can\'t use that number.');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            kids = [];
            session.replaceDialog('/kids', { reprompt: true });
        } else if (invalidResponse(kids, results.response)) {
            session.send('You can\'t use the same response twice');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            kids = [];
            session.replaceDialog('/kids', { reprompt: true });
        } else {
            kids[1] = results.response;
            builder.Prompts.number(session, 'Enter a third and final positive number');
        }
    },
    function (session, results) {
        if (invalidNumber(results.response)) {
            session.send('You can\'t use that number.');
            session.delay(1000);
            session.send('Let\'s try this category again');
            session.delay(1000);
            kids = [];
            session.replaceDialog('/kids', { reprompt: true });
        } else if (invalidResponse(kids, results.response)) {
            session.send('You can\'t use the same response twice.');
            session.delay(1000);
            session.send('Let\'s try this category again.');
            session.delay(1000);
            kids = [];
            session.replaceDialog('/kids', { reprompt: true });
        } else {
            kids[2] = results.response;
            session.send('Great! You entered %s, %s, and %s!', kids[0], kids[1], kids[2]);
            session.delay(1000);
            session.endDialog();
        }
    }
]);

bot.dialog('/transportation', [
    function (session) {
        builder.Prompts.text(session, 'Enter a mode of transportation');
    },
    function (session, results) {
        transportation[0] = results.response;
        builder.Prompts.text(session, 'Enter another mode of transportation');
    },
    function (session, results) {
        if (invalidResponse(transportation, results.response)) {
            session.send('You can\'t use the same response twice.');
            session.delay(1000);
            session.send('Let\'s try this category again.');
            session.delay(1000);
            transportation = [];
            session.replaceDialog('/transportation', { reprompt: true });
        } else {
            transportation[1] = results.response;
            builder.Prompts.text(session, 'Enter a third and final mode of transportation');
        }
    },
    function (session, results) {
        if (invalidResponse(transportation, results.response)) {
            session.send('You can\'t use the same response twice.');
            session.delay(1000);
            session.send('Let\'s try this category again.');
            session.delay(1000);
            transportation = [];
            session.replaceDialog('/transportation', { reprompt: true });
        } else {
            transportation[2] = results.response;
            session.send('Great! You entered %s, %s, and %s!', transportation[0], transportation[1], transportation[2]);
            session.delay(1000);
            session.endDialog();
        }
    }
]);

bot.dialog('/magic', [
    function (session) {
        session.send('Let\'s review your responses:');
        session.delay(2000);
        session.send('You\'re three people are ' + people[0] + ', ' + people[1] + ', and ' + people[2] + '.');
        session.delay(2000);
        session.send('You\'re three numbers are ' + kids[0] + ', ' + kids[1] + ', and ' + kids[2] + '.');
        session.delay(2000);
        session.send('You\'re three modes of transportation are ' + transportation[0] + ', ' + transportation[1] + ', and ' + transportation[2] + '.');
        session.delay(2100);
        session.sendTyping();
        session.delay(3500);
        fortune = computeFortune(mash, people, kids, transportation);
        session.send(fortune.toString());
        session.delay(2000);
        session.send('Thanks for playing!');
        session.endDialog();
    }
]);

function computeFortune(arr1, arr2, arr3, arr4) {
    var futureMash;
    var futurePerson;
    var futureKids;
    var futureTransportation;
    var futureMash = arr1[Math.floor(Math.random() * 4)];
    var futurePerson = arr2[Math.floor(Math.random() * 3)];
    var futureKids = arr3[Math.floor(Math.random() * 3)];
    var futureTransportation = arr4[Math.floor(Math.random() * 3)];
    return 'You will live in a ' + futureMash + ' and you will marry ' + futurePerson + '! You will have ' + futureKids + ' kids and you will get around town by ' + futureTransportation + '!';
}

function invalidResponse(arr, input) {
    for (var i = 0; i < arr.length; i++) {
        if (input == arr[i]) {
            return true;
        } else {
            return false;
        }
    }
}

function invalidNumber(input) {
    if (input < 0) {
        return true;
    } else if (!Number.isInteger(input)) {
        return true;
    } else {
        return false;
    }
}

bot.dialog('/', intents);