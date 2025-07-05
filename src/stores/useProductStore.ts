import { create } from 'zustand';

export type Product = {
  id: string;
  category: string;
  name: string;
  size?: string;
  price: string;
  imageUrl: string;
  description: string;
  availableSizes: string[];
  typeOptions?: Record<string, string[]>;
};

export type CartItem = {
  product: Product;
  selectedType?: string | null;
  selectedSize?: string | null;
  quantity: number;
  total: number;
};

type ProductStore = {
  products: Product[];
  cart: CartItem[];
  setProducts: (products: Product[]) => void;
  getProductById: (id: string) => Product | undefined;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [
  {
    id: "1",
    category: "Cement",
    name: "Dalmia Cement",
    size: "50kg",
    price: "₹420",
    imageUrl:
      "https://5.imimg.com/data5/UV/PU/XW/SELLER-68311677/dalmia-cement-1000x1000.jpg",
    description: "Premium quality cement suitable for all construction needs.",
    availableSizes: ["50kg"],
  },
  {
    id: "2",
    category: "Cement",
    name: "Maha Cement",
    size: "50kg",
    price: "₹415",
    imageUrl:
      "https://5.imimg.com/data5/SELLER/Default/2021/4/CX/UO/QU/127185130/maha-construction-cement-500x500.jpeg",
    description: "High strength cement ensuring durability and performance.",
    availableSizes: ["50kg"],
  },
  {
    id: "3",
    category: "Cement",
    name: "Chettinad Cement",
    size: "50kg",
    price: "₹410",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7pIh1hTTAeI12I7GtojliG_LLPgRRGG1Gvw&s",
    description: "Reliable cement used for both residential and commercial construction.",
    availableSizes: ["50kg"],
  },
  {
    id: "6",
    category: "Sand",
    name: "M-Sand",
    size: "1 Unit",
    price: "₹950",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Construction_Sand_%28M-Sand%29.jpg/800px-Construction_Sand_%28M-Sand%29.jpg",
    description: "Manufactured sand with consistent particle size, ideal for construction.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "7",
    category: "Sand",
    name: "River Sand",
    size: "1 Unit",
    price: "₹900",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/70/River_Sand.jpg",
    description: "Natural river sand, widely used for plastering and masonry work.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "8",
    category: "Bricks",
    name: "Fly Ash Brick",
    price: "₹7",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE96elCGoEeJV2JTF_t_1JfN-neh8zm9JcDA&s",
    description: "High-quality Fly Ash Bricks, eco-friendly and durable, ideal for construction.",
    availableSizes: ["Mold", "Hollow's"],
    typeOptions: {
      Mold: ["9x4x3 in"],
      "Hollow's": ["16x8x4 in", "12x8x4 in"],
    },
  },
  {
    id: "9",
    category: "Sand",
    name: "P-Sand",
    size: "1 Unit",
    price: "₹900",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi4GKgOpAJ_2crMkDTdHs8fw5MYiemWXL9zg&s",
    description: "Plastering sand with fine texture, ideal for smooth finishes.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "10",
    category: "Sand",
    name: "1/4 Jalli",
    size: "1 Unit",
    price: "₹850",
    imageUrl:
      "https://5.imimg.com/data5/ANDROID/Default/2020/12/SJ/UA/SV/117773839/30-mm-blue-metal-500x500-jpg.jpg",
    description: "Small sized blue metal aggregate used for concreting.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "11",
    category: "Sand",
    name: "2/3 Jalli",
    size: "1 Unit",
    price: "₹870",
    imageUrl:
      "https://5.imimg.com/data5/ANDROID/Default/2020/12/SJ/UA/SV/117773839/30-mm-blue-metal-500x500-jpg.jpg",
    description: "Medium aggregate ideal for RCC and foundation work.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "12",
    category: "Sand",
    name: "1½ Jalli",
    size: "1 Unit",
    price: "₹890",
    imageUrl:
      "https://5.imimg.com/data5/ANDROID/Default/2020/12/SJ/UA/SV/117773839/30-mm-blue-metal-500x500-jpg.jpg",
    description: "Large blue metal aggregate for heavy-duty construction.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "13",
    category: "Sand",
    name: "3/4 Jalli",
    size: "1 Unit",
    price: "₹880",
    imageUrl:
      "https://5.imimg.com/data5/ANDROID/Default/2020/12/SJ/UA/SV/117773839/30-mm-blue-metal-500x500-jpg.jpg",
    description: "Crushed stone aggregate used in concrete mix.",
    availableSizes: ["1 Unit"],
  },
  {
    id: "14",
    category: "Bricks",
    name: '4" Brick',
    size: "4x8x4 in",
    price: "₹6",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb1l5e_KUzrBCP90yVK7-SG8Hwpu1V60iaPg&s",
    description: 'Standard size 4" clay bricks used in partition walls.',
    availableSizes: ["4x8x4 in"],
  },
  {
    id: "15",
    category: "Bricks",
    name: '6" Brick',
    size: "6x8x4 in",
    price: "₹8",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb1l5e_KUzrBCP90yVK7-SG8Hwpu1V60iaPg&s",
    description: 'Durable 6" bricks for heavy-duty wall construction.',
    availableSizes: ["6x8x4 in"],
  },
],

  cart: [],
  setProducts: (products) => set({ products }),
  getProductById: (id) => get().products.find((p) => p.id === id),
  addToCart: (item) => {
    const currentCart = get().cart;

    // Optionally avoid duplicates by checking existing product + options
    const existsIndex = currentCart.findIndex(
      (cartItem) =>
        cartItem.product.id === item.product.id &&
        cartItem.selectedType === item.selectedType &&
        cartItem.selectedSize === item.selectedSize
    );

    if (existsIndex !== -1) {
      // If item exists, update quantity & total
      const updatedCart = [...currentCart];
      updatedCart[existsIndex] = {
        ...updatedCart[existsIndex],
        quantity: updatedCart[existsIndex].quantity + item.quantity,
        total: updatedCart[existsIndex].total + item.total,
      };
      set({ cart: updatedCart });
    } else {
      // Add new item
      set({ cart: [...currentCart, item] });
    }
  },
  clearCart: () => set({ cart: [] }),
}));
