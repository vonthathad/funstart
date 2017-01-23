init:
	npm install ; cd public ; mkdir uploaded ; cd uploaded ; mkdir results ; mkdir sources ; cd .. ; npm install
.PHONY: init

dev:
	npm start
.PHONY: dev

build:
	cd public ; ng build --prod ; cp -R src/sources uploaded/ ; cp src/game.js dist/
.PHONY: build


