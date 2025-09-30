import type { Product, Transaction } from '@/lib/types';

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Banana Prata',
    purchasePrice: 2.5,
    sellingPrice: 4.5,
    stock: 50,
    unit: 'kg',
    category: 'Fruta',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1695004310230-edf1cb00f321?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxiYW5hbmElMjBmcnVpdHxlbnwwfHx8fDE3NTkxOTUxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "banana fruit"
    },
    lowStockThreshold: 10,
  },
  {
    id: 'prod-002',
    name: 'Maçã Fuji',
    purchasePrice: 4.0,
    sellingPrice: 7.0,
    stock: 35,
    unit: 'kg',
    category: 'Fruta',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1659262988364-1e0f6a2e35f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxhcHBsZSUyMGZydWl0fGVufDB8fHx8MTc1OTEwNzE2OHww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "apple fruit"
    },
    lowStockThreshold: 10,
  },
  {
    id: 'prod-003',
    name: 'Laranja Pera',
    purchasePrice: 3.0,
    sellingPrice: 5.0,
    stock: 80,
    unit: 'kg',
    category: 'Fruta',
    image: {
        imageUrl: "https-images.unsplash.com/photo-1637679231107-2fa35c20b9aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8b3JhbmdlJTIwZnJ1aXR8ZW58MHx8fHwxNzU5MTQ2NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "orange fruit"
    },
    lowStockThreshold: 20,
  },
  {
    id: 'prod-004',
    name: 'Abacaxi Pérola',
    purchasePrice: 5.0,
    sellingPrice: 8.0,
    stock: 8,
    unit: 'unidade',
    category: 'Fruta',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1710224764630-2bddaea00868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwaW5lYXBwbGUlMjBmcnVpdHxlbnwwfHx8fDE3NTkyMDMyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "pineapple fruit"
    },
    lowStockThreshold: 5,
  },
  {
    id: 'prod-005',
    name: 'Água de Coco 500ml',
    purchasePrice: 4.0,
    sellingPrice: 7.0,
    stock: 15,
    unit: 'unidade',
    category: 'Produto Processado',
    image: {
        imageUrl: "https://images.unsplash.com/flagged/photo-1560505761-b46fb3d231bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjb2NvbnV0JTIwd2F0ZXJ8ZW58MHx8fHwxNzU5MjAzMjYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "coconut water"
    },
    lowStockThreshold: 5,
  },
  {
    id: 'prod-006',
    name: 'Mandioca Descascada',
    purchasePrice: 3.5,
    sellingPrice: 6.0,
    stock: 20,
    unit: 'kg',
    category: 'Outro',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1689682609878-971c0b1f86b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx5dWNhJTIwcm9vdHxlbnwwfHx8fDE3NTkyMDMyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "yuca root"
    },
    lowStockThreshold: 8,
  },
  {
    id: 'prod-007',
    name: 'Ovos Caipira (dúzia)',
    purchasePrice: 8.0,
    sellingPrice: 12.0,
    stock: 12,
    unit: 'unidade',
    category: 'Outro',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1613900050733-09d5dc8b36de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxlZ2dzJTIwY2FydG9ufGVufDB8fHx8MTc1OTE2MjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "eggs carton"
    },
    lowStockThreshold: 5,
  },
   {
    id: 'prod-008',
    name: 'Manga Tommy',
    purchasePrice: 3.0,
    sellingPrice: 5.5,
    stock: 40,
    unit: 'kg',
    category: 'Fruta',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1734163075572-8948e799e42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxtYW5nbyUyMGZydWl0fGVufDB8fHx8MTc1OTIwMzI2MHww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "mango fruit"
    },
    lowStockThreshold: 10,
  },
  {
    id: 'prod-009',
    name: 'Mamão Formosa',
    purchasePrice: 3.5,
    sellingPrice: 6.0,
    stock: 2,
    unit: 'unidade',
    category: 'Fruta',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1594494805016-81a405df78ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cGFwYXlhJTIwZnJ1aXR8ZW58MHx8fHwxNzU5MjAzMjYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "papaya fruit"
    },
    lowStockThreshold: 5,
  },
  {
    id: 'prod-010',
    name: 'Uva Thompson',
    purchasePrice: 7.0,
    sellingPrice: 12.0,
    stock: 25,
    unit: 'caixa',
    category: 'Fruta',
    image: {
        imageUrl: "https://images.unsplash.com/photo-1718182108054-dac788155eea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxncmFwZXMlMjBmcnVpdHxlbnwwfHx8fDE3NTkxOTUxODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "grapes fruit"
    },
    lowStockThreshold: 8,
  },
];

export const transactions: Transaction[] = [
  {
    id: 'txn-001',
    type: 'Venda',
    date: '2024-07-20T10:30:00Z',
    items: [
      { product: products[0], quantity: 2, unitPrice: 4.5 },
      { product: products[1], quantity: 1, unitPrice: 7.0 },
    ],
    total: 16.0,
  },
  {
    id: 'txn-002',
    type: 'Venda',
    date: '2024-07-20T11:00:00Z',
    items: [{ product: products[2], quantity: 5, unitPrice: 5.0 }],
    total: 25.0,
  },
  {
    id: 'txn-003',
    type: 'Compra',
    date: '2024-07-19T04:00:00Z',
    items: [
      { product: products[0], quantity: 50, unitPrice: 2.5 },
      { product: products[1], quantity: 40, unitPrice: 4.0 },
    ],
    total: 285.0,
  },
  {
    id: 'txn-004',
    type: 'Descarte',
    date: '2024-07-19T18:00:00Z',
    items: [{ product: products[3], quantity: 2, unitPrice: 5.0 }],
    total: 10.0,
    reason: 'Amassado',
  },
   {
    id: 'txn-005',
    type: 'Venda',
    date: '2024-07-21T12:15:00Z',
    items: [
      { product: products[7], quantity: 3, unitPrice: 5.5 },
      { product: products[9], quantity: 1, unitPrice: 12.0 },
    ],
    total: 28.5,
  },
  {
    id: 'txn-006',
    type: 'Venda',
    date: '2024-07-22T09:45:00Z',
    items: [
      { product: products[4], quantity: 2, unitPrice: 7.0 },
      { product: products[6], quantity: 1, unitPrice: 12.0 },
    ],
    total: 26.0,
  },
];
