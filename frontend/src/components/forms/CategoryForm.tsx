import { useState } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { ProductCategory } from '@/types';
import { Button } from '@/components/common/Button';

interface CategoryFormProps {
    category: ProductCategory | null;
    categories: ProductCategory[];
    onClose: () => void;
    onSuccess: () => void;
}

export function CategoryForm({ category, categories, onClose, onSuccess }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `${import.meta.env.VITE_API_URL}/products/categories/${editingId}`
                : `${import.meta.env.VITE_API_URL}/products/categories`;

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                setName('');
                setDescription('');
                setEditingId(null);
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save category');
            }
        } catch (err) {
            setError('An error occurred while saving the category');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat: ProductCategory) => {
        setName(cat.name);
        setDescription(cat.description || '');
        setEditingId(cat.id);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this category? Products using it will remain but show no category.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Categories</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add/Edit Form */}
                    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h3>

                        {error && (
                            <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Category name *"
                            />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Description (optional)"
                            />
                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading} size="sm" className="flex-1">
                                    {loading ? '...' : editingId ? 'Update' : 'Add'}
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            setEditingId(null);
                                            setName('');
                                            setDescription('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Existing Categories */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Existing Categories ({categories.length})</h3>

                        {categories.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">No categories yet. Add one above to get started.</p>
                        ) : (
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{cat.name}</div>
                                            {cat.description && (
                                                <div className="text-sm text-gray-500">{cat.description}</div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <Button onClick={onClose} variant="secondary" className="w-full">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


