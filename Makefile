.PHONY: install lint test

install:
	@bun install

build:
	@bun build --compile --outfile=bin/gendiff index.js

lint:
	@bun run lint

lint-fix:
	@bun run lint:fix

test:
	@bun run test
