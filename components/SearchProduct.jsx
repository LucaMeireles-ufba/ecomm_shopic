'use client'
import { Search } from 'lucide-react'

export function SearchProduct({ placeholder, filterValue, setFilterValue }) {
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			setFilterValue(e.target.value); // Directly use setFilterValue
		}
	};

	return (
		<div className="relative w-full">
			<input
				type="text"
				placeholder={placeholder}
				onKeyDown={handleKeyPress}
				className="w-full border rounded-full px-12 py-3 bg-zinc-200 focus:outline-none focus:ring focus:border-blue-300"
				value={filterValue} // Keep input controlled by value
				onChange={(e) => setFilterValue(e.target.value)} // Update on change as well
			/>
			<div className="absolute inset-y-0 left-4 flex items-center">
				<Search className="text-gray-400" />
			</div>
		</div>
	);
}
