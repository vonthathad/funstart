init:
	npm install ; cd public ; mkdir uploaded ; cd uploaded ; mkdir results ; mkdir sources ; cd .. ; npm install
.PHONY: init

dev:
	npm start
.PHONY: dev

build:
	cd public ; ng build --prod ; cp -R src/sources uploaded/ ; cp src/game.bridge.js dist/
.PHONY: build

git:
	git add . ; git commit -m "up new code to server" ; git push origin master
.PHONY: git
