all: public/matrix.wasm
public/matrix.wasm: src/matrix.mjs
src/matrix.mjs: src/matrix.c
	emcc --no-entry src/matrix.c -o src/matrix.mjs  \
	  --pre-js locateFile.js  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='createModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_add", "_matrixMultiply", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		-s ASSERTIONS \
	  -O3
	mv src/matrix.wasm public/matrix.wasm

.PHONY: clean
clean:
	rm public/matrix.wasm src/matrix.mjs

.PHONY: re
re: clean all