import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LostItems.css';

function LostItems() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    location: 'All',
    category: 'All'
  });
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [isAuthenticated] = useState(true); // Assume authenticated for demo
  const [handoverFormData, setHandoverFormData] = useState({
    employeeId: '',
    employeeName: '',
    foundLocationDetails: '',
    foundDateTime: '',
    photo: null,
    handlingOption: '',
    pickupMessage: '',
    securityId: ''
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/items')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .filter((item) => item.type === 'LOST')
          .map((item) => ({
            id: item.id,
            name: item.itemName,
            image: item.imageUrl || null,
            category: item.category?.name || 'Unknown',
            location: item.location || 'Unknown',
            date: item.dateLostOrFound?.split('T')[0],
            time: item.dateLostOrFound?.split('T')[1]?.substring(0, 5),
            status:
              item.itemStatus === 'NOT_FOUND'
                ? 'Pending'
                : item.itemStatus === 'REQUESTED'
                ? 'Requested'
                : 'Completed',
            description: item.description || ''
          }));
        setLostItems(formatted);
      })
      .catch((err) => console.error('Error fetching items:', err));
  }, []);

  const groupItemsByTime = () => {
    const today = new Date();
    const groups = {
      Today: [],
      'This Week': [],
      'This Month': [],
      Earlier: []
    };

    lostItems.forEach((item) => {
      const itemDate = new Date(item.date);
      const diffDays = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) groups.Today.push(item);
      else if (diffDays <= 7) groups['This Week'].push(item);
      else if (diffDays <= 30) groups['This Month'].push(item);
      else groups.Earlier.push(item);
    });

    return groups;
  };

  const filteredItems = lostItems.filter((item) => {
    return (
      (filters.status === 'All' || item.status === filters.status) &&
      (filters.location === 'All' || item.location === filters.location) &&
      (filters.category === 'All' || item.category === filters.category) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const groupedItems = groupItemsByTime();

  const handleHandoverClick = (item) => {
    setSelectedItem(item);
    setShowHandoverModal(true);
  };

  const handleHandoverInputChange = (e) => {
    const { name, value } = e.target;
    setHandoverFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHandoverRadioChange = (e) => {
    const { value } = e.target;
    setHandoverFormData(prev => ({
      ...prev,
      handlingOption: value,
      pickupMessage: '',
      securityId: ''
    }));
  };

  const handleHandoverSubmit = (e) => {
    e.preventDefault();
    // Simulate POST request to backend
    console.log('Handover data submitted:', { selectedItem, handoverFormData });
    setShowHandoverModal(false);
    setTimeout(() => {
      navigate('/my-activity');
    }, 1000);
  };

  return (
    <div className="lost-items-page">
      <div className="lost-items-container">
        <h1 className="lost-items-title">LOST ITEMS</h1>

        <div className="search-filter-section">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Lost Items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="filter-controls">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              title="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Requested">Requested</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              title="Filter by location"
            >
              <option value="All">All Locations</option>
              {[...new Set(lostItems.map((item) => item.location))].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              title="Filter by category"
            >
              <option value="All">All Categories</option>
              {[...new Set(lostItems.map((item) => item.category))].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">🕵‍♂</div>
            <p>No lost items found matching your criteria.</p>
          </div>
        ) : (
          <div className="items-list">
            {Object.entries(groupedItems).map(([group, items]) => (
              items.length > 0 && (
                <div key={group} className="time-group">
                  <h2>{group}</h2>
                  <div className="items-grid">
                    {items.map((item) => (
                      <div key={item.id} className="lost-item-card">
                        <div className="card-front">
                          <div className="item-image">
                            {item.image ? (
                              <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} />
                            ) : (
                              '📷'
                            )}
                          </div>
                          <h3>{item.name}</h3>
                          <span className={`status-badge ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                          {isAuthenticated && (
                            <button className="handover-button" onClick={() => handleHandoverClick(item)}>
                              Handover
                            </button>
                          )}
                        </div>
                        <div className="card-back">
                          <h3>{item.name}</h3>
                          <div className="item-details">
                            <div className="detail-labels">
                              <span>Category:</span>
                              <span>Location:</span>
                              <span>Date:</span>
                              <span>Time:</span>
                              <span>Status:</span>
                            </div>
                            <div className="detail-values">
                              <span>{item.category}</span>
                              <span>{item.location}</span>
                              <span>{item.date}</span>
                              <span>{item.time}</span>
                              <span>{item.status}</span>
                            </div>
                          </div>
                          <div className="description">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {showHandoverModal && selectedItem && (
          <div className="handover-modal">
            <div className="modal-content">
              <h2>Handover Lost Item</h2>
              <form onSubmit={handleHandoverSubmit}>
                <label>
                  Employee ID:
                  <input type="text" name="employeeId" value={handoverFormData.employeeId} onChange={handleHandoverInputChange} required />
                </label>
                <label>
                  Employee Name:
                  <input type="text" name="employeeName" value={handoverFormData.employeeName} onChange={handleHandoverInputChange} required />
                </label>
                <label>
                  Where it was found:
                  <textarea
                    name="foundLocationDetails"
                    value={handoverFormData.foundLocationDetails}
                    onChange={handleHandoverInputChange}
                    required
                    placeholder="Enter location details"
                  />
                </label>
                <label>
                  When it was found:
                  <input
                    type="datetime-local"
                    name="foundDateTime"
                    value={handoverFormData.foundDateTime}
                    onChange={handleHandoverInputChange}
                    required
                  />
                </label>
                <label>
                  Upload Photo:
                  <input type="file" accept="image/*" name="photo" onChange={handleHandoverInputChange} required />
                </label>
                <div className="handling-options">
                  <label>
                    <input
                      type="radio"
                      name="handlingOption"
                      value="keep"
                      checked={handoverFormData.handlingOption === 'keep'}
                      onChange={handleHandoverRadioChange}
                      required
                    />
                    Keep it with Me
                  </label>
                  {handoverFormData.handlingOption === 'keep' && (
                    <textarea
                      name="pickupMessage"
                      value={handoverFormData.pickupMessage}
                      onChange={handleHandoverInputChange}
                      placeholder="Pickup Message/Instructions"
                      className="handling-input"
                    />
                  )}
                  <label>
                    <input
                      type="radio"
                      name="handlingOption"
                      value="security"
                      checked={handoverFormData.handlingOption === 'security'}
                      onChange={handleHandoverRadioChange}
                    />
                    Handover to Security
                  </label>
                  {handoverFormData.handlingOption === 'security' && (
                    <input
                      type="text"
                      name="securityId"
                      value={handoverFormData.securityId}
                      onChange={handleHandoverInputChange}
                      placeholder="Security ID"
                      className="handling-input"
                    />
                  )}
                </div>
                <div className="modal-buttons">
                  <button type="button" className="cancel-button" onClick={() => setShowHandoverModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LostItems;