# This is a sample Makefile on consolidating CSS and JS into packages.
# Usage:
#
#     make           - Builds the needed files.
#     make watch     - Keep building files as they are made. (Run this on development)
#     make clean     - Cleans up generated files.
#
# In development, just do this to start a server:
#
#     make start
#     make start port=8000

all: \
	assets/all.css \
	index.html

assets/all.css: \
	assets/reset.css \
	assets/page.css
	$(COMBINE)

index.html: index.start.html content.html
	cat $^ > $@
	rm content.html

# ----------------------------------------------------------------------------

COMBINE = rm -f $@; cat $^ > $@; chmod a-w $@

# Stylus compiler
assets/%.css: styles/%.styl
	@node -e "require('stylus');require('nib');" 2>/dev/null || (echo " ! Error: You need Stylus + Nib to compile .styl files. Try: 'npm install -g stylus nib'" && exit 1)
	@rm -f $@
	stylus -u nib < $< > $@
	@chmod a-w $@

%.html: %.textile
	@rm -f $@
	ruby -rRedCloth -e "puts RedCloth.new(STDIN.read).to_html" < $< > $@
	@chmod a-w $@

# Simple file watcher
watch:
	@echo "=== Watching asset files for changes."
	while true; do make all | grep -v "Nothing to be done"; sleep 0.5; done

clean:
	rm -f assets/*

port ?= 8000
start:
	@# Yes, the `make watch` will die upon doing ^C.
	@which python >/dev/null || (echo " ! Error: You need Python to use 'make start'." && exit 1)
	make watch &
	python -m SimpleHTTPServer $(port)

.PHONY: all clean watch start
