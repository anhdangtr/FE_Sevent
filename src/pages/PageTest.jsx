import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCardTest from "../components/EventCardTest";
import { useNavigate } from "react-router-dom";
import "./PageTest.css";
import Navbar from "../components/Navbar";
import heroBg from "../assets/Event_UITEnglishConest.jpg";
import CategoryAll from "../assets/Category_All.png";
import CategoryVolunteer from "../assets/Category_Volunteer.png";
import CategoryAcademic from "../assets/Category_Academic.png";
import CategoryEntertainment from "../assets/Category_Entertainment.png";
import CategoryConductScore from "../assets/Category_Conduct Score.png";

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
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const LIMIT = 9;

  useEffect(() => {
    fetchEvents();
  }, [page, search, category]);

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
        category: category !== "all" ? category : undefined,
      };

      const response = await axios.get(`${API_URL}/events`, { params });

      if (response.data.success) {
        setEvents(response.data.data);
        setTotalPages(response.data.pagination.pages);
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
        params: { limit: 4 },
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
    <>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className="landpage-container">

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
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <h1>Where your eventure starts!</h1>
            <p>Search and join the events you like</p>

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

        {/* Events Section */}
        <div className="events-section">
          <div className="container">

            {/* Trending Section */}
            {page === 1 && !search && trendingEvents.length > 0 && (
              <div className="trending-section">
                <h2 className="section-title">Sự Kiện Nổi Bật</h2>
                <div className="events-grid">
                  {trendingEvents.map((event) => (
                    <EventCardTest key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {page === 1 && !search && (
              <div className="filters">
                <h2 className="category-label">Explore categories</h2>

                <div className="category-options">
                  <div
                    className={`category-option ${category === "all" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("all")}
                  >
                    <img src={CategoryAll} alt="All" />
                    <span className="category-name">All</span>
                  </div>

                  <div
                    className={`category-option ${category === "6935c87fdf7bfe8ffc73367d" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc73367d")}
                  >
                    <img src={CategoryVolunteer} alt="Volunteer" />
                    <span className="category-name">Volunteer</span>
                  </div>

                  <div
                    className={`category-option ${category === "6935c87fdf7bfe8ffc73367e" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc73367e")}
                  >
                    <img src={CategoryAcademic} alt="Academic" />
                    <span className="category-name">Academic</span>
                  </div>

                  <div
                    className={`category-option ${category === "6935c87fdf7bfe8ffc73367f" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc73367f")}
                  >
                    <img src={CategoryEntertainment} alt="Entertainment" />
                    <span className="category-name">Entertainment</span>
                  </div>

                  <div
                    className={`category-option ${category === "6935c87fdf7bfe8ffc733680" ? "active" : ""}`}
                    onClick={() => handleCategoryChange("6935c87fdf7bfe8ffc733680")}
                  >
                    <img src={CategoryConductScore} alt="Conduct score" />
                    <span className="category-name">Conduct score</span>
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
    </>
  );
};

export default PageTest;
