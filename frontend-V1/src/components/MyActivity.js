import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyActivity.css';

function MyActivity() {
    const navigate = useNavigate();
    const [filterValue, setFilterValue] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId'); // Or however you access the userId
    console.log(userId);
    useEffect(() => {
        if (!userId) {
            // Handle case where user is not logged in (e.g., redirect)
            console.error('User ID not found. User must be logged in.');
            return;
        }
else{}
        fetch(`http://localhost:8080/api/items/filter?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Map the backend data to the format expected by the component
                
                const mappedActivities = data.map(item => ({
                    itemId: item.itemId,
                    type: item.type,
                    itemName: item.itemName, // Use itemName from backend
                    itemStatus: item.itemStatus, // Use itemStatus from backend
                    imageUrl: item.imageUrl,
                    actionStatus: getActionStatus(item.itemStatus, item.type) // Derive actionStatus
                }));
                setActivities(mappedActivities);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching activity:', error);
                setLoading(false);
            });
    }, [userId, navigate]);

    const handleFilterChange = (e) => {
        setFilterValue(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleRefresh = () => {
        // In a real app, this would fetch updated data from an API
        alert('Refreshing activity data...');
    };

    // Function to derive actionStatus based on itemStatus and type
    const getActionStatus = (itemStatus, type) => {
        if (type === 'LOST') {
            switch (itemStatus) {
                case 'NOT_FOUND':
                    return 'Search Initiated';
                case 'WITH_FINDER':
                    return 'Contact Finder';
                case 'WITH_SECURITY':
                    return 'Awaiting Claim';
                case 'RECEIVED':
                    return 'Closed';
                default:
                    return 'Unknown';
            }
        } else if (type === 'FOUND') {
            switch (itemStatus) {
                case 'NOT_FOUND':
                    return 'Available';
                case 'WITH_FINDER':
                    return 'Contact Finder';
                case 'WITH_SECURITY':
                    return 'Awaiting Pickup';
                case 'RECEIVED':
                    return 'Closed';
                default:
                    return 'Unknown';
            }
        }
        return 'Unknown';
    };

    // Filter activities based on selected filters
    const filteredActivities = activities.filter(activity => {
        const matchesType = filterValue === 'All' ||
            (filterValue === 'Lost' && activity.type === 'LOST') ||
            (filterValue === 'Found' && activity.type === 'FOUND');

        const matchesStatus = statusFilter === 'All' || activity.itemStatus === statusFilter;

        return matchesType && matchesStatus;
    });

    // if (loading) {
    //     return <div>Loading...</div>; // Or a loading spinner
    // }

    return (
        <div className="activity-page">
            <div className="activity-container">
                <h1 className="activity-title">MY ACTIVITY</h1>

                <div className="activity-filters">
                    <div className="filter-group">
                        <label>Filter by:</label>
                        <select
                            value={filterValue}
                            onChange={handleFilterChange}
                            className="filter-dropdown"
                        >
                            <option value="All">All</option>
                            <option value="Lost">Lost Items</option>
                            <option value="Found">Found Items</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status:</label>
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="filter-dropdown"
                        >
                            <option value="All">All</option>
                            <option value="NOT_FOUND">Not Found</option>
                            <option value="WITH_FINDER">With Finder</option>
                            <option value="WITH_SECURITY">With Security</option>
                            <option value="RECEIVED">Received</option>
                        </select>
                    </div>

                    <button onClick={handleRefresh} className="refresh-button">
                        ↻
                    </button>
                </div>

                <div className="activity-list">
                    {filteredActivities.map(activity => (
                        <div key={activity.itemId} className="activity-item">
                            <div className="item-header">
                                <h2>{activity.type}</h2>
                            </div>
                            <div className="item-details">
                            <div className="item-image">
                                  {activity.imageUrl ? (
                                    <img src={`data:image/jpeg;base64,${activity.imageUrl}`} alt={activity.itemName} />
                                  ) : (
                                    <div className="placeholder-image">📷</div>
                                  )}
                                </div>
                                <div className="item-info">
                                    <div className="item-name">Name: {activity.itemName}</div>
                                    <div className={`item-status ${activity.itemStatus.toLowerCase()}`}>
                                        {activity.itemStatus}
                                    </div>
                                </div>
                                <div className="item-action">
                                    <button className="action-button">{activity.actionStatus}</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredActivities.length === 0 && (
                        <div className="no-activities">
                            No activities match your current filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyActivity;