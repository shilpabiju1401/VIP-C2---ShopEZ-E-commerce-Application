import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Toast from '../../components/Toast';

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load categories');
      setToastType('danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditCategoryId(null);
    setName('');
    setDescription('');
    setImage('');
    setShowModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditCategoryId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setShowModal(true);
  };

  const handleDelete = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category? (Products within this category will stay, but categories fields will clear)')) return;

    try {
      await api.delete(`/categories/${catId}`);
      setToastMessage('Category removed successfully');
      setToastType('success');
      fetchCategories();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to delete category');
      setToastType('danger');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setToastMessage('Category name is required');
      setToastType('warning');
      return;
    }

    const payload = {
      name,
      description,
      image
    };

    try {
      if (editCategoryId) {
        await api.put(`/categories/${editCategoryId}`, payload);
        setToastMessage('Category updated successfully!');
      } else {
        await api.post('/categories', payload);
        setToastMessage('Category created successfully!');
      }
      setToastType('success');
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Failed to save category');
      setToastType('danger');
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="text-white font-heading mb-1">Manage Categories</h3>
          <p className="text-muted small">Create, update, or delete catalog sections</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary-glow rounded-pill px-4">
          <i className="bi bi-plus-lg me-1"></i> Add Category
        </button>
      </div>

      {/* Table grid */}
      <div className="card glass-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted small mb-0">No categories found in active database.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0 small">
              <thead>
                <tr className="border-secondary border-opacity-10 text-muted">
                  <th>Image preview</th>
                  <th>Name</th>
                  <th>Slug key</th>
                  <th>Description</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-secondary border-opacity-10">
                    <td>
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="rounded"
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="fw-bold">{cat.name}</td>
                    <td className="text-muted">{cat.slug}</td>
                    <td className="text-muted" style={{ maxWidth: '280px' }}>{cat.description || 'No description provided'}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="btn btn-sm btn-outline-glass me-2"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
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

      {/* Category Modal Overlay */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(9, 13, 22, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title font-heading text-white">{editCategoryId ? 'Edit Category' : 'Add Category'}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="modal-body d-flex flex-column gap-3 text-start">
                  
                  {/* Category Name */}
                  <div>
                    <label className="form-label text-muted small">Category Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sports Equipment"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="form-label text-muted small">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Brief category summary..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="form-label text-muted small">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
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
                    Save Category
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

export default CategoryManage;
