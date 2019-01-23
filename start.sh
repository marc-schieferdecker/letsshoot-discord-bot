#!/bin/bash

NODE="/usr/bin/node"
HOMEPATH="/home/bot"
SCREEN1="messages"
SCREEN2="radio"
SCREEN3="roles"

# Changedir
cd $HOMEPATH

/usr/bin/screen -S $SCREEN1 -X quit
/usr/bin/screen -dmS $SCREEN1 $NODE $HOMEPATH/bot.messages.app.js

/usr/bin/screen -S $SCREEN2 -X quit
/usr/bin/screen -dmS $SCREEN2 $NODE $HOMEPATH/bot.radio.app.js

/usr/bin/screen -S $SCREEN3 -X quit
/usr/bin/screen -dmS $SCREEN3 $NODE $HOMEPATH/bot.roles.app.js
