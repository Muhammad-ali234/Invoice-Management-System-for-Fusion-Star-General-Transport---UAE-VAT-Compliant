import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Tag, Box } from 'lucide-react';
import { Product, ProductCategory, Unit } from '@/types';
import { Button } from '@/components/common/Button';
import { ProductForm } from '@/components/forms/ProductForm';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { UnitForm } from '@/components/forms/UnitForm';
import { Layout } from '@/components/layout/Layout';

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showActiveOnly, setShowActiveOnly] = useState(true);

    // Modal states
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showUnitForm, setShowUnitForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    useEffect(() => {
        fetchData();
    }, [selectedCategory, showActiveOnly]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Fetch products
            let productsUrl = `${import.meta.env.VITE_API_URL}/products?`;
            if (selectedCategory) productsUrl += `category=${selectedCategory}&`;
            if (showActiveOnly) productsUrl += `active=true&`;

            const [productsRes, categoriesRes, unitsRes] = await Promise.all([
                fetch(productsUrl, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/products/categories/all`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/products/units/all`, { headers }),
            ]);

            const productsData = await productsRes.json();
            const categoriesData = await categoriesRes.json();
            const unitsData = await unitsRes.json();

            setProducts(productsData);
            setCategories(categoriesData);
            setUnits(unitsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleToggleActive = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}/toggle`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error toggling product status:', error);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Layout title="Products & Services">
            <div className="mb-8">
                <p className="text-gray-600">Manage your product catalog for quick invoice creation</p>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 items-center flex-wrap">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showActiveOnly}
                                onChange={(e) => setShowActiveOnly(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Active Only</span>
                        </label>

                        <Button onClick={() => setShowCategoryForm(true)} variant="secondary" size="sm">
                            <Tag size={16} className="mr-1" />
                            Categories
                        </Button>

                        <Button onClick={() => setShowUnitForm(true)} variant="secondary" size="sm">
                            <Box size={16} className="mr-1" />
                            Units
                        </Button>

                        <Button onClick={handleAddProduct} size="sm">
                            <Plus size={16} className="mr-1" />
                            Add Product
                        </Button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <Box size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first product'}
                    </p>
                    <Button onClick={handleAddProduct}>
                        <Plus size={16} className="mr-2" />
                        Add Product
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tax %
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className={!product.is_active ? 'bg-gray-50 opacity-60' : ''}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        {product.description && (
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.category_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.unit_abbreviation || product.unit_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {Number(product.tax_percent || 0)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleActive(product.id)}
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${product.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {showProductForm && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    units={units}
                    onClose={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                    }}
                    onSuccess={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        fetchData();
                    }}
                />
            )}

            {showCategoryForm && (
                <CategoryForm
                    category={editingCategory}
                    categories={categories}
                    onClose={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                    }}
                    onSuccess={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                        fetchData();
                    }}
                />
            )}

            {showUnitForm && (
                <UnitForm
                    unit={editingUnit}
                    units={units}
                    onClose={() => {
                        setShowUnitForm(false);
                        setEditingUnit(null);
                    }}
                    onSuccess={() => {
                        setShowUnitForm(false);
                        setEditingUnit(null);
                        fetchData();
                    }}
                />
            )}
        </Layout>
    );
}


