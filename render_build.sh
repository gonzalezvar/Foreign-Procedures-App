#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install

pipenv run upgrade

python src/get_offices.py
python src/scraping.py