
'use client';

import { useMemo } from 'react';
import { get } from 'lodash';
import { Timestamp } from 'firebase/firestore';

export type SortDescriptor = {
  key: string;
  direction: 'ascending' | 'descending';
};

function searchInItem(item: any, searchTerm: string, keys: string[]): boolean {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    for (const key of keys) {
        const value = get(item, key);
        
        if (value === null || value === undefined) {
            continue;
        }
        
        if (Array.isArray(value)) {
            // If the value is an array of objects (like transaction items)
            // check if the search term is in any of the objects' values.
            if (value.some(subItem => 
                typeof subItem === 'object' && 
                Object.values(subItem).some(val => 
                    String(val).toLowerCase().includes(lowerCaseSearchTerm)
                )
            )) {
                return true;
            }
        } else if (String(value).toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
        }
    }
    return false;
}

export function useSortableData<T>(
  data: T[],
  sortDescriptor: SortDescriptor | null,
  searchTerm: string,
  searchKeys: string[] | undefined
) {
  const sortedData = useMemo(() => {
    let sortableItems = [...data];

    // 1. Filtering
    if (searchTerm && searchKeys) {
        sortableItems = sortableItems.filter(item => searchInItem(item, searchTerm, searchKeys));
    }

    // 2. Sorting
    if (sortDescriptor !== null) {
      sortableItems.sort((a, b) => {
        const aValue = get(a, sortDescriptor.key);
        const bValue = get(b, sortDescriptor.key);
        
        let comparison = 0;

        // Handle different data types
        if (aValue instanceof Timestamp && bValue instanceof Timestamp) {
            comparison = aValue.toMillis() - bValue.toMillis();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        } else {
            // Treat null or undefined values as empty strings for sorting
            const strA = aValue === null || aValue === undefined ? '' : String(aValue);
            const strB = bValue === null || bValue === undefined ? '' : String(bValue);
            comparison = strA.localeCompare(strB, 'pt-BR', { numeric: true });
        }

        return sortDescriptor.direction === 'ascending' ? comparison : -comparison;
      });
    }

    return sortableItems;
  }, [data, sortDescriptor, searchTerm, searchKeys]);

  return { sortedData };
}
