import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

const ProductManage = () => {
  // Lists State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('0');
  const [imagesText, setImagesText] = useState('');
  const [sizesText, setSizesText] = useState('');
  const [featured, setFeatured] = useState(false);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const prodRes = await api.get('/products?limit=100'); // Load bulk for management
      const catRes = await api.get('/categories');
      setProducts(prodRes.data.products);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load products listing');
      setToastType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditProductId(null);
    setTitle('');
    setPrice('');
    setDiscount('0');
    setDescription('');
    setBrand('');
    setCategory(categories[0]?._id || '');
    setStock('0');
    setImagesText('');
    setSizesText('');
    setFeatured(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditProductId(product._id);
    setTitle(product.title);
    setPrice(product.price.toString());
    setDiscount((product.discount || 0).toString());
    setDescription(product.description);
    setBrand(product.brand);
    setCategory(product.category?._id || product.category || '');
    setStock(product.stock.toString());
    setImagesText(product.images ? product.images.join(', ') : '');
    setSizesText(product.sizes ? product.sizes.join(', ') : '');
    setFeatured(product.featured || false);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${productId}`);
      setToastMessage('Product deleted successfully');
      setToastType('success');
      fetchProductsAndCategories();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to delete product');
      setToastType('danger');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !brand || !category || !description) {
      setToastMessage('Please fill in all required fields');
      setToastType('warning');
      return;
    }

    // Split comma strings
    const images = imagesText ? imagesText.split(',').map(img => img.trim()).filter(Boolean) : [];
    const sizes = sizesText ? sizesText.split(',').map(s => s.trim()).filter(Boolean) : [];

    const payload = {
      title,
      price: Number(price),
      discount: Number(discount),
      description,
      brand,
      category,
      stock: Number(stock),
      images,
      sizes,
      featured
    };

    try {
      if (editProductId) {
        await api.put(`/products/${editProductId}`, payload);
        setToastMessage('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        setToastMessage('Product created successfully!');
      }
      setToastType('success');
      setShowModal(false);
      fetchProductsAndCategories();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to save product');
      setToastType('danger');
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header buttons */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="text-white font-heading mb-1">Manage Products</h3>
          <p className="text-muted small">Add, update, or remove inventory products</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary-glow rounded-pill px-4">
          <i className="bi bi-plus-lg me-1"></i> Add Product
        </button>
      </div>

      {/* Products list table */}
      <div className="card glass-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted small mb-0">No products in active database. Click Add Product to populate.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 small">
              <thead>
                <tr className="border-secondary border-opacity-10 text-muted">
                  <th>Image</th>
                  <th>Title</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Disc %</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} className="border-secondary border-opacity-10">
                    <td>
                      <img
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="rounded"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="fw-bold">{prod.title}</td>
                    <td>{prod.brand}</td>
                    <td>{prod.category?.name || 'Uncategorized'}</td>
                    <td>${prod.price.toFixed(2)}</td>
                    <td>{prod.discount}%</td>
                    <td>
                      <span className={`badge rounded-pill ${prod.stock > 10 ? 'badge-glow-success' : 'badge-glow-warning'}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td>
                      {prod.featured ? (
                        <span className="text-success"><i className="bi bi-star-fill text-warning"></i> Yes</span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="btn btn-sm btn-outline-glass me-2"
                        title="Edit Item"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Item"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal overlay */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-heading text-white">{editProductId ? 'Edit Product' : 'Add Product'}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body row g-3 text-start">
                  {/* Title */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Product Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Brand */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Brand <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </div>

                  {/* Category Select */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Category <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      min="0"
                    />
                  </div>

                  {/* Price */}
                  <div className="col-md-4 col-6">
                    <label className="form-label text-muted small">Original Price ($) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                    />
                  </div>

                  {/* Discount */}
                  <div className="col-md-4 col-6">
                    <label className="form-label text-muted small">Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>

                  {/* Featured */}
                  <div className="col-md-4 col-12 d-flex align-items-center pt-md-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="featuredCheck"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                      />
                      <label className="form-check-label text-white small" htmlFor="featuredCheck">
                        Promote to Featured
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="form-label text-muted small">Description <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Comma-separated sizes */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Sizes (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. S, M, L, XL"
                      value={sizesText}
                      onChange={(e) => setSizesText(e.target.value)}
                    />
                  </div>

                  {/* Comma-separated images */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Image URLs (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. https://domain.com/pic1.jpg, https://domain.com/pic2.jpg"
                      value={imagesText}
                      onChange={(e) => setImagesText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-glass"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-glow px-4">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default ProductManage;
