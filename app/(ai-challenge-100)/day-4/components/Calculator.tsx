'use client';

import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = 0;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          break;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    setEquation(prevValue === null ? display + ' ' + nextOperation : equation + ' ' + display + ' ' + nextOperation);
  };

  const handleEquals = () => {
    if (!operation || prevValue === null) return;

    const inputValue = parseFloat(display);
    let newValue = 0;

    switch (operation) {
      case '+':
        newValue = prevValue + inputValue;
        break;
      case '-':
        newValue = prevValue - inputValue;
        break;
      case '×':
        newValue = prevValue * inputValue;
        break;
      case '÷':
        newValue = prevValue / inputValue;
        break;
      default:
        break;
    }

    setDisplay(String(newValue));
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(true);
    setEquation(equation + ' ' + display + ' = ' + newValue);
  };

  return (
    <div className="max-w-xs mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-4">
        <div className="text-right text-gray-400 text-sm h-6 overflow-hidden">
          {equation}
        </div>
        <div className="text-right text-white text-3xl font-mono overflow-hidden">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={clearAll}
          className="col-span-2 bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg"
        >
          AC
        </button>
        <button
          onClick={() => performOperation('÷')}
          className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg"
        >
          ÷
        </button>
        <button
          onClick={() => performOperation('×')}
          className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg"
        >
          ×
        </button>
        <button
          onClick={() => inputDigit('7')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          9
        </button>
        <button
          onClick={() => performOperation('-')}
          className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg"
        >
          -
        </button>
        <button
          onClick={() => inputDigit('4')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          6
        </button>
        <button
          onClick={() => performOperation('+')}
          className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg"
        >
          +
        </button>
        <button
          onClick={() => inputDigit('1')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          3
        </button>
        <button
          onClick={handleEquals}
          className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg"
        >
          =
        </button>
        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          0
        </button>
        <button
          onClick={inputDecimal}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg"
        >
          .
        </button>
      </div>
    </div>
  );
} 