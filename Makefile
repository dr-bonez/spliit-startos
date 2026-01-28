PKG_ID := spliit
ARCH := $(shell uname -m)

ifeq ($(ARCH),aarch64)
ARCH := aarch64
else ifeq ($(ARCH),arm64)
ARCH := aarch64
else ifeq ($(ARCH),x86_64)
ARCH := x86_64
else
$(error Unsupported architecture: $(ARCH))
endif

.PHONY: all aarch64 x86_64 clean verify

all: $(PKG_ID).s9pk
	@echo ""
	@echo "============================================"
	@echo "  Package: $(PKG_ID).s9pk"
	@echo "  Arch:    $(ARCH)"
	@echo "============================================"
	@echo ""

aarch64 x86_64:
	@$(MAKE) all ARCH=$@

$(PKG_ID).s9pk: javascript/index.js verify
	start-cli s9pk pack --arch $(ARCH)

javascript/index.js: $(shell find startos -name '*.ts')
	npm run build

verify:
	npm run check

clean:
	rm -rf javascript ncc-cache *.s9pk node_modules
