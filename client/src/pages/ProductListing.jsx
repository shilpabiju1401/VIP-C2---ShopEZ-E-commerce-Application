import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Skeleton';
import api from '../services/api';
import Toast from '../components/Toast';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // API State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State (bind to URL or state defaults)
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Sync state filters with search params updates
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Load static filter choices (categories) once
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to fetch categories list', err);
      }
    };
    fetchFilterData();
  }, []);

  // Fetch products upon filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedBrand) params.append('brand', selectedBrand);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (sortBy) params.append('sortBy', sortBy);
        params.append('page', page.toString());
        params.append('limit', '6'); // 6 per page for nice layout grid

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.products);
        setPages(res.data.pages);
        setTotalProducts(res.data.totalProducts);
        setBrands(res.data.brands); // Unique brands returned by query
      } catch (err) {
        console.error('Failed to fetch products list', err);
        setToastMessage('Error loading products');
        setToastType('danger');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, page]);

  // Update query params helper
  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    // Set page to 1 on filter changes
    if (!newParams.page) {
      params.set('page', '1');
    }

    Object.keys(newParams).forEach(key => {
      if (newParams[key] === undefined || newParams[key] === null || newParams[key] === '') {
        params.delete(key);
      } else {
        params.set(key, newParams[key]);
      }
    });

    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParams({ keyword });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({}); // Clear URL params
  };

  const handleShowToast = (msg, type) => {
    setToastMessage(msg);
    setToastType(type);
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12 text-center text-md-start">
          <h2 className="text-white font-heading">Shop Catalog</h2>
          <p className="text-muted small">Showing {totalProducts} items matching your criteria</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Filter Sidebar */}
        <div className="col-lg-3 col-md-4">
          <div className="card glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white mb-0 font-heading">Filters</h5>
              <button
                onClick={handleClearFilters}
                className="btn btn-sm btn-link text-gradient text-decoration-none fw-semibold p-0"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <label className="form-label text-muted small">Search Keyword</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Earbuds"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="btn btn-primary-glow px-3">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Category Select */}
            <div className="mb-4">
              <label className="form-label text-muted small">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => updateQueryParams({ category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Select */}
            <div className="mb-4">
              <label className="form-label text-muted small">Brand</label>
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => updateQueryParams({ brand: e.target.value })}
              >
                <option value="">All Brands</option>
                {brands.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Boundaries */}
            <div className="mb-4">
              <label className="form-label text-muted small">Price Boundaries ($)</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => updateQueryParams({ minPrice })}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => updateQueryParams({ maxPrice })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Product Catalog Grid */}
        <div className="col-lg-9 col-md-8">
          {/* Grid Controls (Sorting) */}
          <div className="card glass-card p-3 mb-4 d-flex flex-row justify-content-between align-items-center gap-3">
            <span className="text-muted small d-none d-sm-inline">Sort order:</span>
            <div className="col-md-4 col-sm-6 col-12 ms-auto">
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => updateQueryParams({ sortBy: e.target.value })}
              >
                <option value="newest">Release Date: Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratings">Ratings: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="row g-4 mb-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="col-lg-4 col-md-6">
                  <CardSkeleton />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-12 py-5 text-center text-muted">
                <i className="bi bi-box-seam fs-1 mb-3 d-block text-secondary"></i>
                <h5>No Products Found</h5>
                <p className="small">Try adjusting search tags or filters.</p>
                <button onClick={handleClearFilters} className="btn btn-primary-glow rounded-pill px-4 mt-2">
                  Clear All Filters
                </button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="col-lg-4 col-md-6">
                  <ProductCard product={product} onShowMessage={handleShowToast} />
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <nav aria-label="Catalog pagination">
                <ul className="pagination gap-2 border-0">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="btn btn-outline-glass px-3 py-2 rounded-circle"
                      onClick={() => updateQueryParams({ page: page - 1 })}
                      style={{ width: '40px', height: '40px', padding: 0 }}
                      disabled={page === 1}
                    >
                      ‹
                    </button>
                  </li>
                  {Array.from({ length: pages }).map((_, idx) => (
                    <li key={idx} className="page-item">
                      <button
                        className={`btn ${page === idx + 1 ? 'btn-primary-glow' : 'btn-outline-glass'} px-3 py-2 rounded-circle`}
                        style={{ width: '40px', height: '40px', padding: 0 }}
                        onClick={() => updateQueryParams({ page: idx + 1 })}
                      >
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                    <button
                      className="btn btn-outline-glass px-3 py-2 rounded-circle"
                      onClick={() => updateQueryParams({ page: page + 1 })}
                      style={{ width: '40px', height: '40px', padding: 0 }}
                      disabled={page === pages}
                    >
                      ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Floating Notifications */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default ProductListing;
