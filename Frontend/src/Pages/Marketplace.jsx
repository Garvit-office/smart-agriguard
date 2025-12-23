import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
// Demo admin check (replace with real auth in production)
const isAdmin = true;

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', image: '' });
    const { addToCart } = useCart();

    // Mock/demo products
    const demoProducts = [
        { _id: '1', name: 'Organic Fertilizer', price: 299, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
        { _id: '2', name: 'Garden Shovel', price: 499, image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
        { _id: '3', name: 'Plant Seeds Pack', price: 199, image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80' },
        { _id: '4', name: 'Watering Can', price: 350, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80' },
    ];

    // Fetch products from backend, fallback to demo if empty
    useEffect(() => {
        axios.get("http://localhost:5000/api/products").then((res) => {
            if (res.data && res.data.length > 0) {
                setProducts(res.data);
            } else {
                setProducts(demoProducts);
            }
        }).catch(() => setProducts(demoProducts));
    }, []);

    // Admin add product handler
    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleAddProduct = (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.image) return;
        // Try to post to backend, else add locally
        axios.post("http://localhost:5000/api/products", form)
            .then(res => setProducts(prev => [...prev, res.data]))
            .catch(() => {
                // Fallback: add locally with random id
                setProducts(prev => [...prev, { ...form, _id: Math.random().toString(36).substr(2, 9) }]);
            });
        setForm({ name: '', price: '', image: '' });
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Marketplace</h1>

            {isAdmin && (
                <form onSubmit={handleAddProduct} className="mb-8 bg-gray-50 p-4 rounded shadow flex flex-col md:flex-row gap-4 items-center">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="Product Name"
                        className="border rounded px-3 py-2 w-full md:w-1/4"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleFormChange}
                        placeholder="Price"
                        className="border rounded px-3 py-2 w-full md:w-1/4"
                        required
                    />
                    <input
                        type="url"
                        name="image"
                        value={form.image}
                        onChange={handleFormChange}
                        placeholder="Image URL"
                        className="border rounded px-3 py-2 w-full md:w-1/3"
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full md:w-auto">Add Product</button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p._id} className="border p-4 rounded shadow bg-white flex flex-col items-center">
                        <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded mb-2" />
                        <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                        <p className="mb-2 text-green-700 font-semibold">₹{p.price}</p>
                        <button
                            onClick={() => addToCart(p)}
                            className="mt-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
