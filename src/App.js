import { useState, useEffect } from 'react';
import createModule from './matrix.mjs';

const App = () => {
	const [addFunction, setAddFunction] = useState(null);
	const [matrixMultiplyFunction, setMatrixMultiplyFunction] = useState(null);

	useEffect(() => {
		createModule().then((Module) => {
			// ems컴파일러 컴파일된 C 함수를 호출하는 가장 쉬운 방법 cwrap
			setAddFunction(() => Module.cwrap('add', 'number', ['number', 'number']));
			setMatrixMultiplyFunction(() => wrapMatrixMultiply(Module));
		});
	}, []);

	if (!addFunction || !matrixMultiplyFunction) {
		return 'Loading...';
	}

	return (
		<main>
			2 + 3 = {addFunction(2, 3)}
			<br />
			<br />
			[[1.5, 2], [3, 4]] @ [[5, 6], [7, 8]] =
			{JSON.stringify(
				matrixMultiplyFunction(
					[
						[1.5, 2],
						[3, 4],
					],
					[
						[5, 6],
						[7, 8],
					]
				)
			)}
		</main>
	);
};

export default App;

const wrapMatrixMultiply = (Module) => {
	return function (firstMatrix, secondMatrix) {
		const length = firstMatrix.length;
		const flatFirst = new Float32Array(firstMatrix.flat());
		const flatSecond = new Float32Array(secondMatrix.flat());
		const buffer1 = Module._malloc(
			flatFirst.length * flatFirst.BYTES_PER_ELEMENT
		);
		const buffer2 = Module._malloc(
			flatSecond.length * flatSecond.BYTES_PER_ELEMENT
		);
		Module.HEAPF32.set(flatFirst, buffer1 >> 2);
		Module.HEAPF32.set(flatSecond, buffer2 >> 2);

		const resultBuffer = Module._malloc(
			flatFirst.length * flatFirst.BYTES_PER_ELEMENT
		);

		const resultPointer = Module.ccall(
			'matrixMultiply',
			'number',
			['number', 'number', 'number', 'number'],
			[buffer1, buffer2, resultBuffer, length]
		);

		const resultFlatArray = [];

		for (let i = 0; i < length ** 2; i++) {
			resultFlatArray.push(
				Module.HEAPF32[resultPointer / Float32Array.BYTES_PER_ELEMENT + i]
			);
		}

		const result = [];

		while (resultFlatArray.length) {
			result.push(resultFlatArray.splice(0, length));
		}

		Module._free(buffer1);
		Module._free(buffer2);
		Module._free(resultBuffer);

		return result;
	};
};
