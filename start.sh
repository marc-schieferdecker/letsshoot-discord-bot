#!/bin/bash

SCREEN="/usr/bin/screen"
NODE="/usr/bin/node"
HOMEPATH="/home/bot"
SCREEN1="messages"
SCREEN2="radio"
SCREEN3="roles"
SCREEN4="trash"

# Changedir
cd $HOMEPATH

# Stop running bot modules
./stop.sh

# Start all bot modules
$SCREEN -dmS $SCREEN1 $NODE $HOMEPATH/bot.messages.app.js
$SCREEN -dmS $SCREEN2 $NODE $HOMEPATH/bot.radio.app.js
$SCREEN -dmS $SCREEN3 $NODE $HOMEPATH/bot.roles.app.js
$SCREEN -dmS $SCREEN4 $NODE $HOMEPATH/bot.autotrash.app.js
