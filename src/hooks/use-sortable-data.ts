
'use client';

import { useMemo } from 'react';
import { get } from 'lodash';
import { Timestamp } from 'firebase/firestore';

export type SortDescriptor = {
  key: string;
  direction: 'ascending' | 'descending';
};

// Helper function to safely get nested properties
const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

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
        sortableItems = sortableItems.filter(item => {
            return searchKeys.some(key => {
                const value = get(item, key);
                if (Array.isArray(value)) {
                    return value.some(subItem => 
                        Object.values(subItem).some(v => 
                            String(v).toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    );
                }
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
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
            comparison = String(aValue).localeCompare(String(bValue), 'pt-BR', { numeric: true });
        }

        return sortDescriptor.direction === 'ascending' ? comparison : -comparison;
      });
    }

    return sortableItems;
  }, [data, sortDescriptor, searchTerm, searchKeys]);

  return { sortedData };
}
