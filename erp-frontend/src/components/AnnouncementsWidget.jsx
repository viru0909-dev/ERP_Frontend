import React, { useState, useEffect } from 'react';

const AnnouncementsWidget = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading announcements
    setTimeout(() => {
      setAnnouncements([
        {
          id: 1,
          title: "Mid-term Examinations Schedule",
          content: "Mid-term examinations will commence from March 15th. Please check your individual timetables.",
          date: "2024-03-01",
          priority: "high"
        },
        {
          id: 2, 
          title: "Library New Hours",
          content: "Library will now be open until 10 PM on weekdays.",
          date: "2024-02-28",
          priority: "medium"
        },
        {
          id: 3,
          title: "Campus Fest 2024",
          content: "Annual campus festival will be held on April 20-22. Registration opens soon!",
          date: "2024-02-25",
          priority: "low"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-widget">
        <h3>📢 Latest Announcements</h3>
        <div>Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-widget">
      <h3>📢 Latest Announcements</h3>
      <div className="announcements-list">
        {announcements.map(announcement => (
          <div key={announcement.id} className={`announcement-item priority-${announcement.priority}`}>
            <div className="announcement-header">
              <h4>{announcement.title}</h4>
              <span className="announcement-date">{new Date(announcement.date).toLocaleDateString()}</span>
            </div>
            <p>{announcement.content}</p>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .announcements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .announcement-item {
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid;
          background: rgba(30, 41, 59, 0.5);
        }
        
        .priority-high {
          border-left-color: #ef4444;
        }
        
        .priority-medium {
          border-left-color: #f59e0b;
        }
        
        .priority-low {
          border-left-color: #8b5cf6;
        }
        
        .announcement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .announcement-header h4 {
          margin: 0;
          color: #f1f5f9;
          font-size: 16px;
          font-weight: 600;
        }
        
        .announcement-date {
          font-size: 12px;
          color: #cbd5e1;
        }
        
        .announcement-item p {
          margin: 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default AnnouncementsWidget;