#!/bin/sh
git pull
git add .
git commit -m "$*"
git push