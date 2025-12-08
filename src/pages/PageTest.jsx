import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCardTest from "../components/EventCardTest";
import { useNavigate } from "react-router-dom";
import "./PageTest.css";
import Navbar from "../components/Navbar";
import heroBg from "../assets/Event_UITEnglishConest.jpg";

const PageTest = () => {
  const [events, setEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [activeNav, setActiveNav] = useState("home");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);


  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const LIMIT = 9;


  // Lấy danh sách events
  useEffect(() => {
    fetchEvents();
  }, [page, search, category]);

  // Lấy events nổi bật lần đầu
  useEffect(() => {
    fetchTrendingEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: LIMIT,
        search: search || undefined,
        category: category && category !== "all" ? category : undefined
      };

      console.debug("fetchEvents params:", params);
      const response = await axios.get(`${API_URL}/events`, { params });
      console.debug("fetchEvents response:", response?.data?.pagination || response?.data?.data?.length);

      if (response.data.success) {
        setEvents(response.data.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        console.warn('Fetch events returned success=false', response.data);
      }
    } catch (error) {
      console.error("Fetch events error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/trending`, {
        params: { limit: 3 }
      });

      if (response.data.success) {
        setTrendingEvents(response.data.data);
      }
    } catch (error) {
      console.error("Fetch trending events error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="landpage-container">
       {/* <Navbar activeNav={activeNav} setActiveNav={setActiveNav} /> */}

      {/* Hero Section */}
      {/* Hero Section */}
          <section
            className="hero-section"
            style={{
              backgroundImage: `url(${heroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* Overlay giảm opacity */}
            <div className="hero-overlay"></div>

            <div className="hero-content">
              <h1>Where your eventure starts!</h1>
              <p>Search and join the events you like</p>

              {/* Search Bar */}
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Event's name, location, ... or any keyword"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                
              </form>
            </div>
          </section>




      {/* Main Events Section */}
      <div className="events-section">
        <div className="container">
          {page === 1 && !search && (
            <div className="filters">
              <h2 htmlFor="category" className="category-label">
                Explore categories
              </h2>
              <div className="category-options">
                <div
                  className={`category-option ${category === "all" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("all")}
                >
                  <span style={{fontSize:28, marginRight:8}}>📂</span>
                  <span className="category-name">All</span>
                </div>
                <div
                  className={`category-option ${category === "6935c87fdf7bfe8ffc73367d" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc73367d")}
                >
                  <img src="src/assets/Category_Volunteer.png" alt="Volunteer" />
                  <span className="category-name">Volunteer</span>
                </div>

                <div
                  className={`category-option ${category === "6935c87fdf7bfe8ffc73367e" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc73367e")}
                >
                  <img src="src/assets/Category_Academic.png" alt="Academic" />
                  <span className="category-name">Academic</span>
                </div>

                <div
                  className={`category-option ${category === "6935c87fdf7bfe8ffc73367f" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc73367f")}
                >
                  <img src="src/assets/Category_Entertainment.png" alt="Entertainment" />
                  <span className="category-name">Entertainment</span>
                </div>

                <div
                  className={`category-option ${category === "6935c87fdf7bfe8ffc733680" ? "active" : ""}`}
                  onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc733680")}
                >
                  <img src="src/assets/Category_Conduct Score.png" alt="Conduct score" />
                  <span className="category-name">Conduct score</span>
                </div>
              </div>
            </div>
          )}

          {/* Trending Events Section */}
          {page === 1 && !search && trendingEvents.length > 0 && (
            <div className="trending-section">
              <div className="container">
                <h2 className="section-title">  Sự Kiện Nổi Bật</h2>
                <div className="events-grid">
                  {trendingEvents.map((event) => (
                    <EventCardTest key={event._id} event={event} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {loading ? (
            <div className="loading">Đang tải sự kiện...</div>
          ) : events.length > 0 ? (
            <>
              <div className="events-grid">
                {events.map((event) => (
                  <EventCardTest key={event._id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Trước
                  </button>

                  <div className="page-info">
                    Trang {page} / {totalPages}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="pagination-btn"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-events">
              <p>Không tìm thấy sự kiện nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTest;

