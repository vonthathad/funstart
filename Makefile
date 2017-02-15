init:
	npm install ; cd public ; mkdir uploaded ; cd uploaded ; mkdir results ; mkdir sources ; cd .. ; npm install
.PHONY: init

dev:
	npm start
.PHONY: dev

build:
	cd public ; ng build --prod --aot ; mv dist/index.html dist/main.html
.PHONY: build

push:
	git add . ; git commit -m "up new code to server" ; git push origin master
.PHONY: push

pullserver:
	git pull origin master ; pm2 restart 7
.PHONY: pullserver
