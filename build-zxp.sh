#!/bin/bash

die() { echo "$@" 1>&2 ; exit 1; }

SIGNCMD="/Users/cnewton/Documents/Workspace/Adobe-CEP-SDK/ZXPSignCmd"
SRCDIR="/Users/cnewton/Documents/Workspace/Git_repositories/pngquantiser-cep/pngQuantiser"
SIGFILE="/Users/cnewton/Documents/Workspace/Adobe-CEP-SDK/myCert.p12"
ZXPFILE="/Users/cnewton/Documents/Workspace/Git_repositories/pngquantiser-cep/build/pngquantiser.zxp"
PW="pngquantiser"

if [ ! -f $SIGNCMD ]; then die "sign command not found"; fi
if [ ! -d $SRCDIR ];  then die "source folder not found"; fi
if [ ! -f $SIGFILE ]; then die "cert not found"; fi

# remove the ZXP file if it exists
if [ -f $ZXPFILE ] ; then rm $ZXPFILE ; fi

# package and sign
$SIGNCMD -sign "$SRCDIR" $ZXPFILE $SIGFILE $PW -tsa https://timestamp.geotrust.com/tsa
