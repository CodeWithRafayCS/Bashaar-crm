"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { getProducts, addProduct, deleteProduct, updateProduct } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import {
  Package,
  Plus,
  X,
  Edit2,
  Trash2,
  Check,
  Search,
  Filter,
  DollarSign,
  Tag,
  Box,
  Grid,
  List,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ProductSettingsProps {
  className?: string;
}

const CATEGORIES = [
  "General",
  "Software",
  "Hardware",
  "Services",
  "Consulting",
  "Training",
  "Support",
  "License",
  "Subscription",
  "Custom",
];

export function ProductSettings({ className = "" }: ProductSettingsProps) {
  const { pushToast } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category" | "createdAt">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "General",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      pushToast("error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      pushToast("error", "Product name is required");
      return;
    }

    try {
      const newProduct = await addProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price) || 0,
        category: formData.category,
        active: true,
      });
      setProducts([...products, newProduct]);
      setFormData({ name: "", description: "", price: "", category: "General" });
      pushToast("success", "Product added successfully");
    } catch (error) {
      pushToast("error", "Failed to add product");
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Product>) => {
    try {
      await updateProduct(id, updates);
      setProducts(
        products.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      setEditingId(null);
      pushToast("success", "Product updated successfully");
    } catch (error) {
      pushToast("error", "Failed to update product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      pushToast("success", "Product deleted successfully");
    } catch (error) {
      pushToast("error", "Failed to delete product");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateProduct(id, { active: !currentStatus });
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, active: !currentStatus } : p
        )
      );
      pushToast("success", `Product ${currentStatus ? "deactivated" : "activated"}`);
    } catch (error) {
      pushToast("error", "Failed to update product status");
    }
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="product-settings-loading">
        <Loader2 className="loading-spinner" />
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className={`product-settings ${className}`}>
      <div className="settings-header">
        <div className="header-info">
          <h3 className="settings-title">
            <Package className="title-icon" />
            Products & Services
          </h3>
          <p className="settings-description">
            Manage your product catalog for deals and proposals.
          </p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            {products.length} products
          </span>
          <span className="stat-badge active">
            {products.filter((p) => p.active).length} active
          </span>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="add-section">
        <form onSubmit={handleAdd} className="add-form">
          <div className="add-inputs">
            <div className="form-group">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name..."
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <Input
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="form-input"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                className="form-select"
              />
            </div>
          </div>
          <Button type="submit" variant="gold" className="add-btn">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </form>
      </div>

      {/* Search & Filters */}
      <div className="search-filter">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="category">Sort by Category</option>
            <option value="createdAt">Sort by Date</option>
          </select>

          <button
            type="button"
            className="sort-direction"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            {sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className="view-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Package className="empty-icon" />
          <p>No products found</p>
          {searchTerm || categoryFilter ? (
            <span className="empty-hint">Try adjusting your filters</span>
          ) : (
            <span className="empty-hint">Add your first product above</span>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <div className="product-icon">
                  <Package className="w-5 h-5" />
                </div>
                <div className="product-status">
                  <span className={`status-badge ${product.active ? "active" : "inactive"}`}>
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="product-body">
                <h4 className="product-name">{product.name}</h4>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-meta">
                  <span className="product-category">{product.category || "General"}</span>
                  <span className="product-price">{formatCurrency(product.price)}</span>
                </div>
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  className="action-btn toggle"
                  onClick={() => handleToggleActive(product.id, product.active)}
                >
                  {product.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  className="action-btn edit"
                  onClick={() => setEditingId(product.id)}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="action-btn delete"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {editingId === product.id && (
                <div className="edit-overlay">
                  <div className="edit-form">
                    <Input
                      value={product.name}
                      onChange={(e) => {
                        const updated = products.map((p) =>
                          p.id === product.id ? { ...p, name: e.target.value } : p
                        );
                        setProducts(updated);
                      }}
                      className="edit-input"
                      autoFocus
                    />
                    <Input
                      value={product.price}
                      type="number"
                      onChange={(e) => {
                        const updated = products.map((p) =>
                          p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                        );
                        setProducts(updated);
                      }}
                      className="edit-input"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="gold"
                      onClick={() => {
                        const updated = products.find((p) => p.id === product.id);
                        if (updated) {
                          handleUpdate(product.id, {
                            name: updated.name,
                            price: updated.price,
                          });
                        }
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="products-list">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-name-cell">{product.name}</span>
                      {product.description && (
                        <span className="product-desc-cell">{product.description}</span>
                      )}
                    </div>
                  </td>
                  <td>{product.category || "General"}</td>
                  <td className="price-cell">{formatCurrency(product.price)}</td>
                  <td>
                    <span className={`status-badge ${product.active ? "active" : "inactive"}`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="action-btn toggle"
                        onClick={() => handleToggleActive(product.id, product.active)}
                      >
                        {product.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        className="action-btn edit"
                        onClick={() => setEditingId(product.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .product-settings {
          width: 100%;
        }

        .product-settings-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .loading-spinner {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Header */
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .settings-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .title-icon {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.2);
        }

        .settings-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.2);
          margin: 0.2rem 0 0 0;
        }

        .header-stats {
          display: flex;
          gap: 0.5rem;
        }

        .stat-badge {
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.2);
        }

        .stat-badge.active {
          background: rgba(0, 200, 83, 0.06);
          border-color: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        /* Add Section */
        .add-section {
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }

        .add-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .add-inputs {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr;
          gap: 0.75rem;
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .form-group :global(.form-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .form-group :global(.form-select) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .form-group :global(.form-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(label) {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .add-btn {
          padding: 0.4rem 1rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
          white-space: nowrap;
          height: 38px;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Search & Filters */
        .search-filter {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.15);
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem 0.4rem 2.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          font-family: inherit;
        }

        .filter-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          font-family: inherit;
          cursor: pointer;
          min-width: 140px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f4c542;
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .sort-direction {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .sort-direction:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.4);
        }

        .view-toggle {
          display: flex;
          gap: 0.15rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.15rem;
        }

        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .view-btn.active {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 0.75rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .products-grid::-webkit-scrollbar {
          width: 3px;
        }

        .products-grid::-webkit-scrollbar-track {
          background: transparent;
        }

        .products-grid::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem;
          transition: all 0.3s;
          position: relative;
        }

        .product-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .product-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(244, 197, 66, 0.06);
          border-radius: 8px;
          color: #f4c542;
        }

        .status-badge {
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.06);
        }

        .status-badge.inactive {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .product-body {
          margin-bottom: 0.5rem;
        }

        .product-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.2rem 0;
        }

        .product-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          margin: 0 0 0.3rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-category {
          font-size: 0.6rem;
          padding: 0.05rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.2);
        }

        .product-price {
          font-size: 0.9rem;
          font-weight: 700;
          color: #f4c542;
        }

        .product-actions {
          display: flex;
          gap: 0.2rem;
          justify-content: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 0.5rem;
        }

        .action-btn {
          padding: 0.2rem 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 4px;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .action-btn.toggle:hover {
          background: rgba(244, 197, 66, 0.06);
          border-color: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .action-btn.edit:hover {
          background: rgba(66, 133, 244, 0.06);
          border-color: rgba(66, 133, 244, 0.06);
          color: #4285f4;
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.06);
          border-color: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        /* Edit Overlay */
        .edit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(8px);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
        }

        .edit-form {
          display: flex;
          gap: 0.3rem;
          width: 100%;
          flex-wrap: wrap;
        }

        .edit-input {
          flex: 1;
          min-width: 80px;
        }

        .edit-input :global(.form-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(244, 197, 66, 0.2);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .edit-input :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        /* Products List */
        .products-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .products-list::-webkit-scrollbar {
          width: 3px;
        }

        .products-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .products-list::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .products-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .products-table th {
          padding: 0.4rem 0.6rem;
          text-align: left;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.15);
        }

        .products-table td {
          padding: 0.4rem 0.6rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.4);
        }

        .product-cell {
          display: flex;
          flex-direction: column;
        }

        .product-name-cell {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .product-desc-cell {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .price-cell {
          font-weight: 600;
          color: #f4c542;
        }

        .action-buttons {
          display: flex;
          gap: 0.2rem;
          flex-wrap: wrap;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 0.3rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          width: 32px;
          height: 32px;
          opacity: 0.3;
        }

        .empty-state p {
          font-size: 0.85rem;
          margin: 0;
        }

        .empty-hint {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.05);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .add-inputs {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .settings-header {
            flex-direction: column;
          }

          .add-inputs {
            grid-template-columns: 1fr;
          }

          .add-form {
            flex-direction: column;
          }

          .add-btn {
            width: 100%;
            justify-content: center;
          }

          .search-filter {
            flex-direction: column;
          }

          .filter-controls {
            width: 100%;
            flex-wrap: wrap;
          }

          .filter-select {
            flex: 1;
            min-width: 120px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .products-table {
            font-size: 0.75rem;
          }

          .products-table th,
          .products-table td {
            padding: 0.3rem 0.4rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .filter-controls {
            flex-direction: column;
          }

          .filter-select {
            width: 100%;
          }

          .view-toggle {
            width: 100%;
            justify-content: center;
          }

          .product-card {
            padding: 0.5rem;
          }

          .product-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}