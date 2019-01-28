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
$SCREEN -S $SCREEN2 -X quit
$SCREEN -S $SCREEN3 -X quit
