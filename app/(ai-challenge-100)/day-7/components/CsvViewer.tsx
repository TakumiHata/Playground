'use client';

import { useState, useMemo } from 'react';

interface CsvData {
  headers: string[];
  rows: string[][];
}

type SortDirection = 'asc' | 'desc' | null;

export default function CsvViewer() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(line => 
          line.trim().replace(/\r$/, '') // CRを削除
        ).filter(line => line);
        
        if (lines.length === 0) {
          throw new Error('CSVファイルが空です');
        }

        // ヘッダー行を処理
        const headers = lines[0].split(',').map(header => 
          header.trim()
            .replace(/^["']|["']$/g, '') // 前後のクォートを削除
            .replace(/undefined/i, '') // undefinedを削除
        );

        // データ行を処理
        const rows = lines.slice(1).map(line => 
          line.split(',').map(cell => 
            cell.trim()
              .replace(/^["']|["']$/g, '') // 前後のクォートを削除
          )
        );

        // 各行の列数がヘッダーと一致するか確認
        const isValid = rows.every(row => row.length === headers.length);
        if (!isValid) {
          throw new Error('CSVファイルの形式が不正です');
        }

        setCsvData({ headers, rows });
        setError('');
        setSortColumn(null);
        setSortDirection(null);
        setFilterText('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'CSVファイルの読み込みに失敗しました');
        setCsvData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    if (!csvData) return null;

    let filteredRows = csvData.rows;
    
    // フィルタリング
    if (filterText) {
      const searchText = filterText.toLowerCase();
      filteredRows = filteredRows.filter(row =>
        row.some(cell => cell.toLowerCase().includes(searchText))
      );
    }

    // ソート
    if (sortColumn !== null && sortDirection) {
      filteredRows.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        // 数値として比較可能な場合は数値として比較
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // 文字列として比較
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return { ...csvData, rows: filteredRows };
  }, [csvData, sortColumn, sortDirection, filterText]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">CSVビューア</h1>

      <div className="mb-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {sortedAndFilteredData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="検索..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {sortedAndFilteredData.headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(index)}
                    >
                      <div className="flex items-center">
                        {header || `列${index + 1}`}
                        {sortColumn === index && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
            表示件数: {sortedAndFilteredData.rows.length}件
          </div>
        </div>
      )}
    </div>
  );
} 