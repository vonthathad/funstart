init:
	npm install ; cd public ; mkdir uploaded ; cd uploaded ; mkdir results ; mkdir sources ; cd .. ; npm install
.PHONY: init

dev:
	npm start
.PHONY: dev

build:
	cd public ; ng build --prod ; cp -R src/sources uploaded/ ; cp src/game.bridge.js dist/
.PHONY: build

push:
	git add . ; git commit -m "up new code to server" ; git push origin master
.PHONY: push

pull:
	git pull origin master
.PHONY: pull
