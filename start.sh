#!/bin/bash

SCREEN="/usr/bin/screen"
NODE="/usr/bin/node"
HOMEPATH="/home/bot"
SCREEN1="messages"
SCREEN2="radio"
SCREEN3="roles"

# Changedir
cd $HOMEPATH

$SCREEN -S $SCREEN1 -X quit
$SCREEN -dmS $SCREEN1 $NODE $HOMEPATH/bot.messages.app.js

$SCREEN -S $SCREEN2 -X quit
$SCREEN -dmS $SCREEN2 $NODE $HOMEPATH/bot.radio.app.js

$SCREEN -S $SCREEN3 -X quit
$SCREEN -dmS $SCREEN3 $NODE $HOMEPATH/bot.roles.app.js
