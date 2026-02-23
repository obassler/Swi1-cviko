import { useState, useEffect } from 'react'
import './App.css'

type Item = {
    id: number
    name: string
    price: number
    quantity: number
}

function App() {
    const [showModal, setShowModal] = useState(false)
    const [items, setItems] = useState<Item[]>([])

    const [item, setItem] = useState<Omit<Item, 'id'>>({
        name: '',
        price: 0,
        quantity: 0
    })

    // ✅ Fetch all items
    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/items')
            if (!response.ok) {
                throw new Error('Failed to fetch items')
            }
            const data = await response.json()
            setItems(data)
        } catch (error) {
            console.error(error)
        }
    }

    // Load items on page load
    useEffect(() => {
        fetchItems()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setItem({
            ...item,
            [name]: name === 'name' ? value : Number(value)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:8080/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })

            if (!response.ok) {
                throw new Error('Failed to create item')
            }

            alert('Item created successfully!')

            setItem({ name: '', price: 0, quantity: 0 })
            setShowModal(false)

            fetchItems() // ✅ Refresh list
        } catch (error) {
            alert('Error creating item')
            console.error(error)
        }
    }

    // ✅ Delete item
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/items/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete item')
            }

            fetchItems() // ✅ Refresh list
        } catch (error) {
            alert('Error deleting item')
            console.error(error)
        }
    }

    return (
        <>
            <h1>Item Management</h1>

            <button onClick={() => setShowModal(true)}>
                ➕ Add Item
            </button>

            {/* ✅ Items List */}
            <h2>All Items</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((it) => (
                    <tr key={it.id}>
                        <td>{it.name}</td>
                        <td>${it.price}</td>
                        <td>{it.quantity}</td>
                        <td>
                            <button onClick={() => handleDelete(it.id)}>
                                ❌ Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* ✅ Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Item</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Item name"
                                value={item.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={item.price}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={handleChange}
                                required
                            />

                            <div className="modal-buttons">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default App