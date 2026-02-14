import { useState } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { Unit } from '@/types';
import { Button } from '@/components/common/Button';

interface UnitFormProps {
    unit: Unit | null;
    units: Unit[];
    onClose: () => void;
    onSuccess: () => void;
}

export function UnitForm({ unit, units, onClose, onSuccess }: UnitFormProps) {
    const [name, setName] = useState(unit?.name || '');
    const [abbreviation, setAbbreviation] = useState(unit?.abbreviation || '');
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
                ? `${import.meta.env.VITE_API_URL}/products/units/${editingId}`
                : `${import.meta.env.VITE_API_URL}/products/units`;

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, abbreviation }),
            });

            if (response.ok) {
                setName('');
                setAbbreviation('');
                setEditingId(null);
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to save unit');
            }
        } catch (err) {
            setError('An error occurred while saving the unit');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (u: Unit) => {
        setName(u.name);
        setAbbreviation(u.abbreviation || '');
        setEditingId(u.id);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this unit? Products using it will remain but show no unit.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/units/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error deleting unit:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-semibold text-gray-900">Manage Units</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add/Edit Form */}
                    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            {editingId ? 'Edit Unit' : 'Add New Unit'}
                        </h3>

                        {error && (
                            <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-3 mb-3">
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-2 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Unit name * (e.g., Hour, Piece)"
                            />
                            <input
                                type="text"
                                value={abbreviation}
                                onChange={(e) => setAbbreviation(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Abbr. (e.g., hr)"
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
                                            setAbbreviation('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Existing Units */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Existing Units ({units.length})</h3>

                        {units.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">No units yet. Add one above to get started.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {units.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                {u.name}
                                                {u.abbreviation && <span className="ml-2 text-sm text-gray-500">({u.abbreviation})</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(u)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={14} />
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


