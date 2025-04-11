import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ReportItem.css';

function ReportItem() {
  const [activeTab, setActiveTab] = useState('found');
  const [itemHandling, setItemHandling] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    location: '',
    date: '',
    time: '',
    handlingDetails: '',
    handoverToSecurity: false,
    securityId: '',
    securityName: '',
    pickupMessage: '',
    file: null,
    imageBase64: ''
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setItemHandling('');
    setFormData(prev => ({
      ...prev,
      handoverToSecurity: false,
      securityId: '',
      securityName: '',
      pickupMessage: '',
      imageBase64: ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          file,
          imageBase64: reader.result.split(',')[1] // remove data:image/*;base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in!');
      return;
    }

    const dateLostOrFound = `${formData.date} ${formData.time}`;

    const payload = {
      itemName: formData.itemName,
      categoryId: formData.category,
      description: formData.description,
      location: formData.location,
      dateLostOrFound,
      userId: parseInt(userId),
      imageUrl: formData.imageBase64,
      handoverToSecurity: formData.handoverToSecurity,
      securityId: formData.securityId,
      securityName: formData.securityName,
      pickupMessage: formData.pickupMessage
    };

    const endpoint = activeTab === 'found' ? '/api/items/found' : '/api/items/lost';

    try {
      await axios.post(`http://localhost:8080${endpoint}`, payload);
      alert(`✅ ${activeTab === 'found' ? 'Found' : 'Lost'} item reported successfully!`);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(`❌ Failed to report item: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="report-item-container">
      <div className="tabs">
        <button
          className={`tab lost ${activeTab === 'lost' ? 'active' : ''}`}
          onClick={() => handleTabChange('lost')}
        >
          Lost
        </button>
        <button
          className={`tab found ${activeTab === 'found' ? 'active' : ''}`}
          onClick={() => handleTabChange('found')}
        >
          Found
        </button>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <h2>{activeTab === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}</h2>

        <label>
          Enter item name:
          <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required />
        </label>

        <label>
          Select category:
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select category</option>
            <option value="1">Phone</option>
            <option value="2">Wallet</option>
            <option value="3">Watch</option>
            <option value="4">Bags</option>
            <option value="5">Electronics</option>
            <option value="6">Documents</option>
            <option value="7">Keys</option>
            <option value="8">Fashion accessories</option>
            <option value="9">Jewellery</option>
            <option value="10">Others</option>
          </select>
        </label>

        <label>
          Enter description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label>
          Select location:
          <select name="location" value={formData.location} onChange={handleChange} required>
            <option value="">Select location</option>
            <option value="location1">Location 1</option>
            <option value="location2">Location 2</option>
            <option value="location3">Location 3</option>
            {/* add more locations if needed */}
          </select>
        </label>

        <label>
          Select date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>

        <label>
          Select time:
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </label>

        <label>
          Upload image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {/* Found Tab: Handling Options */}
        {activeTab === 'found' && (
          <>
            <div>
              <label>Item Handling:</label>
              <input
                type="radio"
                name="itemHandling"
                value="keep"
                checked={itemHandling === 'keep'}
                onChange={() => {
                  setItemHandling('keep');
                  setFormData(prev => ({
                    ...prev,
                    handoverToSecurity: false,
                    securityId: '',
                    securityName: ''
                  }));
                }}
              /> Keep it with me
              <input
                type="radio"
                name="itemHandling"
                value="security"
                checked={itemHandling === 'security'}
                onChange={() => {
                  setItemHandling('security');
                  setFormData(prev => ({
                    ...prev,
                    handoverToSecurity: true,
                    pickupMessage: '' // Clear pickup message when choosing security
                  }));
                }}
              /> Handover to Security
            </div>

            {itemHandling === 'keep' && (
              <label>
                Pickup Message:
                <input type="text" name="pickupMessage" value={formData.pickupMessage} onChange={handleChange} />
              </label>
            )}

            {formData.handoverToSecurity && (
              <>
                <label>
                  Security ID:
                  <input type="text" name="securityId" value={formData.securityId} onChange={handleChange} />
                </label>
                <label>
                  Security Name:
                  <input type="text" name="securityName" value={formData.securityName} onChange={handleChange} />
                </label>
              </>
            )}
          </>
        )}

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default ReportItem;