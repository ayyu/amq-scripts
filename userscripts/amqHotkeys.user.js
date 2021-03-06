// ==UserScript==
// @name         AMQ Hotkey Functions
// @namespace    https://github.com/ayyu/amq-scripts
// @version      0.4
// @description  Streamlined version of nyamu's hotkey script that conflicts less with normal usage.
// @description  Customize hotkeys by editing the keyBinds object.
// @description  Escape: remove zombie tooltips
// @description  Tab: move cursor focus to answer box
// @description  Shift + Tab: move cursor focus to chat box
// @description  Ctrl + Enter: skip
// @description  Alt + 1: start game if all players are ready
// @description  Alt + 2: start vote for returning to lobby
// @description  Alt + 3: pause quiz
// @description  Alt + 4: toggle team chat
// @author       ayyu
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @downloadURL  https://raw.githubusercontent.com/ayyu/amq-scripts/master/userscripts/amqHotkeys.user.js

// ==/UserScript==

if (document.getElementById('startPage')) {
	return;
}

var keyBinds = {
	"clearTooltips": {
		"mod": [],
		"key": "Escape"
	},
	"startLobby": {
		"mod": ["alt"],
		"key": "1"
	},
	"returnLobby": {
		"mod": ["alt"],
		"key": "2"
	},
  "quizPause": {
		"mod": ["alt"],
		"key": "3"
	},
	"voteSkip": {
		"mod": ["ctrl"],
		"key": "Enter"
	},
	"focusAnswer": {
		"mod": [],
		"key": "Tab"
	},
	"focusChat": {
		"mod": ["shift"],
		"key": "Tab"
	},
	"toggleTeamChat": {
		"mod": ["alt"],
		"key": "4"
	}
};

function onKeyDown(event) {
	for (const command in keyBinds) {
	var currentCommand = keyBinds[command];
		if (event.key != currentCommand["key"]) {
			continue;
		}
	var matchesMods = true;
	for (const mod in currentCommand["mod"]) {
		modProp = currentCommand["mod"] + "Key";
		if (!(modProp in event) || !event[modProp]) {
			matchesMods = false;
			break;
		}
	}
	if (!matchesMods) {
		continue;
	}
	event.preventDefault();
	event.stopPropagation();
		keyBinds[command].callback();
	}
}

keyBinds.clearTooltips.callback = function() {
	$("[id^=tooltip]").remove(); $("[id^=popover]").remove();
}

keyBinds.startLobby.callback = function() {
	if (lobby.isHost &&
		lobby.numberOfPlayers > 0 &&
		lobby.numberOfPlayers == lobby.numberOfPlayersReady) {
		lobby.fireMainButtonEvent();
	}
}

keyBinds.returnLobby.callback = function() {
	if (lobby.isHost &&
		quiz.inQuiz &&
		hostModal.gameMode !== 'Ranked') {
		quiz.startReturnLobbyVote();
	}
}

keyBinds.quizPause.callback = function() {
	if (lobby.isHost &&
		quiz.inQuiz &&
		hostModal.gameMode !== 'Ranked') {
		quiz.pauseButton.$button.trigger('click');
	}
}

keyBinds.voteSkip.callback = function() {
	if (!quiz.isSpectator) {
		quiz.skipClicked()
	}
}

keyBinds.focusAnswer.callback = function() {
	if (!quiz.isSpectator) {
		$("#gcInput").blur();
		quiz.setInputInFocus(true);
		$("#qpAnswerInput").focus();
	}
}

keyBinds.focusChat.callback = function() {
	quiz.setInputInFocus(false);
	$("#gcInput").focus();
}

keyBinds.toggleTeamChat.callback = function() {
	$("#gcTeamChatSwitch").click();
	$("#gcInput").focus();
}

document.addEventListener('keydown', onKeyDown, false);

AMQ_addScriptData({
	name: "Hotkey Functions",
	author: "ayyu",
	description: `
		<p>Streamlined version of nyamu's hotkey script that conflicts less with normal usage.
		Customize hotkeys by editing the keyBinds object.</p>
		<ul>
			<li><kbd>Escape</kbd>: remove zombie tooltips</li>
			<li><kbd>Tab</kbd>: move cursor focus to answer box</li>
			<li><kbd>Shift</kbd> + <kbd>Tab</kbd>: move cursor focus to chat box</li>
			<li><kbd>Ctrl</kbd> + <kbd>Enter</kbd>: vote skip</li>
			<li><kbd>Ctrl</kbd> + <kbd>1</kbd>: start game if all players are ready</li>
			<li><kbd>Ctrl</kbd> + <kbd>2</kbd>: start vote for returning to lobby</li>
		</ul>
	`
});
