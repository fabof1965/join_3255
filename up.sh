#!/bin/sh
git pull --no-rebase origin main
git add .
git commit -m "$*"
git push origin main