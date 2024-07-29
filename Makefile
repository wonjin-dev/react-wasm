all: public/matrix.wasm public/add.wasm

public/matrix.wasm: src/matrix.mjs
public/add.wasm: src/add.mjs

src/matrix.mjs: src/matrix.c
	emcc --no-entry src/matrix.c -o src/matrix.mjs  \
	  --pre-js locateFile.js  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='matrixModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_matrixMultiply", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		-s ASSERTIONS \
	  -O3
	mv src/matrix.wasm public/matrix.wasm

src/add.mjs: src/add.c
	emcc --no-entry src/add.c -o src/add.mjs  \
	  --pre-js locateFile.js  \
	  -s ENVIRONMENT='web'  \
	  -s EXPORT_NAME='addModule'  \
	  -s USE_ES6_IMPORT_META=0  \
	  -s EXPORTED_FUNCTIONS='["_add", "_malloc", "_free"]'  \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		-s ASSERTIONS \
	  -O3
	mv src/add.wasm public/add.wasm

.PHONY: clean
clean:
	rm public/matrix.wasm src/matrix.mjs
	rm public/add.wasm src/add.mjs

.PHONY: re
re: clean all