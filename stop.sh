#!/bin/bash

NODE="/usr/bin/node"
HOMEPATH="/home/bot"
SCREEN1="messages"
SCREEN2="radio"
SCREEN3="roles"

# Changedir
cd $HOMEPATH

/usr/bin/screen -S $SCREEN1 -X quit
/usr/bin/screen -S $SCREEN2 -X quit
/usr/bin/screen -S $SCREEN3 -X quit
