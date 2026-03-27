import { useState, useEffect, useRef, useCallback } from "react";

// ─── Contact Constants ───
const PHONE = "+91 7799066727";
const WHATSAPP = "917799066727";
const EMAIL = "chakinalabhadraiah@gmail.com";
const ADDRESS = "Beside Police Station, Kuravi, Mahabubabad District, Telangana 506105, India";

// ─── Location Constants ───
const LATITUDE = 17.5242715;
const LONGITUDE = 79.9944457;
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/seBMRjvPfHTDV9rn7";
const GOOGLE_MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1903.5!2d${LONGITUDE}!3d${LATITUDE}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a348ebb0384e319%3A0x52a4c895b48e1ac6!2sOm%20Function%20Hall%20And%20Gardens!5e1!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin`;

// ─── Base URL (matches vite.config.js base) ───
const BASE = import.meta.env.BASE_URL;

// ─── Gallery Images Configuration ───
const GALLERY_IMAGES = [
  { src: `${BASE}gallery/venue-exterior-1.png`, alt: "Om Function Hall Exterior View", caption: "Welcome to Om Function Hall" },
  { src: `${BASE}gallery/venue-interior.png`, alt: "Grand Banquet Hall Interior", caption: "Grand Hall - 1000+ Guests" },
  { src: `${BASE}gallery/venue-exterior-2.png`, alt: "Om Function Hall & Gardens", caption: "Beautiful Venue & Gardens" },
  { src: `${BASE}gallery/venue-wedding-1.png`, alt: "Wedding Celebration", caption: "Grand Wedding Celebrations" },
  { src: `${BASE}gallery/venue-stage-decor.png`, alt: "Stage Decoration", caption: "Elegant Stage Setup" },
  { src: `${BASE}gallery/venue-wedding-2.png`, alt: "Wedding Ceremony", caption: "Memorable Wedding Moments" },
  { src: `${BASE}gallery/temple-mandap.png`, alt: "Temple Mandap Setup", caption: "Traditional Mandap Decoration" },
  { src: `${BASE}gallery/venue-event.png`, alt: "Event Celebration", caption: "Grand Event Celebrations" },
  { src: `${BASE}gallery/venue-pooja.png`, alt: "Pooja Ceremony", caption: "Sacred Pooja Ceremonies" },
  { src: `${BASE}gallery/venue-balloons.png`, alt: "Balloon Decoration", caption: "Festive Balloon Decor" },
  { src: `${BASE}gallery/venue-birthday.png`, alt: "Birthday Celebration", caption: "Birthday Party Setup" },
  { src: `${BASE}gallery/venue-exterior-3.png`, alt: "Venue Night View", caption: "Beautiful Evening Ambiance" },
];

// ─── Founder Image ───
const FOUNDER_IMAGE = `${BASE}gallery/founder-portrait.png`;

// ─── Animated Counter Hook ───
function useCounter(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

// ─── Counter Component ───
function AnimatedStat({ num, suffix = "", label }) {
  const { count, ref } = useCounter(parseInt(num), 2000);
  return (
    <div className="hero-stat" ref={ref}>
      <div className="hero-stat-num">{count}{suffix}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}

// ─── Image Carousel Component ───
function ImageCarousel({ images, autoPlayInterval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = (index) => setCurrentIndex(index);

  useEffect(() => {
    autoPlayRef.current = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(autoPlayRef.current);
  }, [goToNext, autoPlayInterval]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);
  const resumeAutoPlay = () => { autoPlayRef.current = setInterval(goToNext, autoPlayInterval); };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; pauseAutoPlay(); };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) { if (diff > 0) goToNext(); else goToPrev(); }
    resumeAutoPlay();
  };

  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => { setLoadedImages((prev) => ({ ...prev, [index]: true })); if (index === 0) setIsLoading(false); };
      img.onerror = () => { setImageErrors((prev) => ({ ...prev, [index]: true })); if (index === 0) setIsLoading(false); };
      img.src = image.src;
    });
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <div className="carousel" onMouseEnter={pauseAutoPlay} onMouseLeave={resumeAutoPlay}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="carousel-container">
        {images.map((image, index) => (
          <div key={index} className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}>
            {imageErrors[index] ? (
              <div className="carousel-placeholder">
                <span className="placeholder-icon">📷</span>
                <span className="placeholder-text">{image.caption}</span>
              </div>
            ) : (
              <>
                <img src={image.src} alt={image.alt} loading={index <= 1 ? "eager" : "lazy"}
                  className={loadedImages[index] ? "loaded" : ""} />
                {!loadedImages[index] && (
                  <div className="carousel-loader"><div className="loader-spinner"></div></div>
                )}
              </>
            )}
            <div className="carousel-caption"><p>{image.caption}</p></div>
          </div>
        ))}
      </div>
      <button className="carousel-btn carousel-btn-prev" onClick={goToPrev} aria-label="Previous slide">‹</button>
      <button className="carousel-btn carousel-btn-next" onClick={goToNext} aria-label="Next slide">›</button>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button key={index} className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
      <div className="carousel-progress">
        <div className="carousel-progress-bar" style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }} />
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", date: "", event: "", guests: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMsg = `Hello! I'd like to book Om Function Hall.\n\nName: ${formData.name}\nPhone: ${formData.phone}\nDate: ${formData.date}\nEvent: ${formData.event}\nGuests: ${formData.guests}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
    setShowModal(true);
    setTimeout(() => setShowModal(false), 4000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const closeMobile = () => setMobileOpen(false);

  const venues = [
    {
      name: "Grand Banquet Hall", emoji: "🏛️",
      desc: "Our largest venue with separate dining and event areas in different sheds. Perfect for grand weddings, large receptions, and community gatherings with comfortable seating arrangements.",
      capacity: "1000+", badge: "GRAND",
      features: ["Separate Dining Shed", "Event Center", "Bride & Groom Rooms", "Sound System"],
      bg: "linear-gradient(135deg, #2D1810 0%, #5C3A28 100%)"
    },
    {
      name: "Celebration Hall", emoji: "✨",
      desc: "Ideal venue for medium-sized celebrations including weddings, birthday parties, engagements, and family functions. Well-equipped with all essential amenities for a memorable event.",
      capacity: "500+", badge: "POPULAR",
      features: ["Combined Hall", "Bride & Groom Rooms", "Sound System", "Stage Area"],
      bg: "linear-gradient(135deg, #3A5A32 0%, #7A8B6F 100%)"
    },
  ];

  const services = [
    { icon: "🍽️", name: "Catering Services", desc: "Delicious multi-cuisine catering with authentic Telugu, North Indian dishes prepared by experienced cooks." },
    { icon: "🎊", name: "Event Decoration", desc: "Beautiful floral arrangements, mandap decoration, lighting and thematic setups available at additional charges." },
    { icon: "🔊", name: "Sound System", desc: "Both halls are equipped with decent sound systems suitable for announcements and small gatherings." },
    { icon: "👰", name: "Bride & Groom Rooms", desc: "Dedicated preparation rooms for bride and groom available in both venues for comfort and privacy." },
    { icon: "🚗", name: "Ample Parking", desc: "Spacious parking area for guests with easy access and security arrangements." },
    { icon: "🪑", name: "Seating & Tables", desc: "Complete seating arrangements with tables and chairs provided for all guests." },
  ];

  const events = [
    { emoji: "💒", name: "Weddings", desc: "Grand celebrations" },
    { emoji: "🎂", name: "Birthdays", desc: "Milestone moments" },
    { emoji: "💍", name: "Engagements", desc: "New beginnings" },
    { emoji: "🎓", name: "Receptions", desc: "Elegant gatherings" },
    { emoji: "🕉️", name: "Poojas", desc: "Sacred ceremonies" },
    { emoji: "👶", name: "Baby Showers", desc: "Joyful occasions" },
    { emoji: "🎉", name: "Anniversaries", desc: "Love renewed" },
    { emoji: "👨‍👩‍👧‍👦", name: "Family Functions", desc: "Togetherness" },
  ];

  const testimonials = [
    { name: "Nagesh", initials: "N", event: "Wedding", text: "Loved to have my wedding function here!", stars: 5 },
    { name: "Rahul Reddy", initials: "RR", event: "Family Function", text: "A function hall with good amenities and basic infrastructure. Perfect for middle class people to celebrate in their own style. Parking is enough for 10-15 cars and 30+ bikes.", stars: 5 },
    { name: "Vijay Gouni", initials: "VG", event: "Event", text: "Best function hall in Kuravi!", stars: 5 },
    { name: "Manoj Yadav", initials: "MY", event: "Function", text: "A good place for different functions and rituals.", stars: 5 },
    { name: "Madhu Katla", initials: "MK", event: "Event", text: "The best! Good food in Mahabubabad.", stars: 5 },
    { name: "Suresh Nani", initials: "SN", event: "Function", text: "Good place to do functions.", stars: 5 },
  ];

  const whyChooseUs = [
    { icon: "💰", title: "Affordable Pricing", desc: "Budget-friendly rates designed for middle-class families without compromising on quality or comfort." },
    { icon: "📍", title: "Prime Location", desc: "Conveniently located beside Kuravi Police Station on the main road, easily accessible from Mahabubabad and Warangal." },
    { icon: "🏗️", title: "Spacious Venues", desc: "Two well-maintained halls accommodating 500 to 1000+ guests with separate dining and event areas." },
    { icon: "👨‍👩‍👧‍👦", title: "Family-Run Legacy", desc: "Over a decade of trusted service by the Chakinala family, personally ensuring every event runs smoothly." },
    { icon: "🍛", title: "Authentic Catering", desc: "In-house catering with traditional Telugu and North Indian cuisine prepared by experienced local cooks." },
    { icon: "🅿️", title: "Ample Parking", desc: "Large parking area for 15+ cars and 30+ two-wheelers with security, so your guests arrive stress-free." },
  ];

  const journeyMilestones = [
    { year: "2012", title: "The Beginning", desc: "Sri Bhadraiah Chakinala founded Om Function Hall with a vision to provide an affordable, quality venue for families in Kuravi and surrounding areas." },
    { year: "2015", title: "Growing Together", desc: "Expanded to add the Grand Banquet Hall with 1000+ capacity and separate dining shed, serving the growing needs of the community." },
    { year: "2018", title: "Gardens & Amenities", desc: "Added beautiful garden spaces, bride & groom rooms, and upgraded sound systems to enhance the celebration experience." },
    { year: "2024", title: "500+ Events & Counting", desc: "Having hosted over 500 events, Om Function Hall is now Kuravi's most trusted and preferred venue for all celebrations." },
  ];

  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`, size: `${2 + Math.random() * 3}px`, opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <>
      {/* ─── Navigation ─── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#home" className="nav-logo" onClick={closeMobile}>
          <div className="nav-logo-icon">ॐ</div>
          <div className="nav-logo-text">Om Function Hall<span>& Gardens</span></div>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#venues">Venues</a>
          <a href="#gallery">Gallery</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#booking" className="nav-cta">Book Now</a>
        </div>
        <button className={`mobile-toggle ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <a href="#home" onClick={closeMobile}>Home</a>
        <a href="#about" onClick={closeMobile}>About</a>
        <a href="#venues" onClick={closeMobile}>Venues</a>
        <a href="#gallery" onClick={closeMobile}>Gallery</a>
        <a href="#services" onClick={closeMobile}>Services</a>
        <a href="#pricing" onClick={closeMobile}>Pricing</a>
        <a href="#contact" onClick={closeMobile}>Contact</a>
        <a href="#booking" onClick={closeMobile} style={{ color: "var(--gold)" }}>Book Now</a>
      </div>

      {/* ─── Hero ─── */}
      <section className="hero" id="home">
        <div className="hero-bg-pattern" />
        <div className="hero-ornament hero-ornament-1" />
        <div className="hero-ornament hero-ornament-2" />
        <div className="hero-ornament hero-ornament-3" />
        <div className="hero-particles">
          {particles.map((p, i) => (
            <div key={i} className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, width: p.size, height: p.size, opacity: p.opacity }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            Kuravi's Trusted Event Venue Since 2012
          </div>
          <h1>
            <span className="gold">Om Function Hall</span>
            <span className="cursive">& Gardens</span>
          </h1>
          <p className="hero-sub">
            Where every celebration becomes a cherished memory. Two beautiful banquet halls with all
            essential amenities for weddings, receptions, and family gatherings in the heart of Kuravi.
          </p>
          <div className="hero-buttons">
            <a href="#booking" className="btn btn-gold">Book Your Date</a>
            <a href={`tel:${PHONE}`} className="btn btn-outline">Call Now</a>
            <a href="#about" className="btn btn-outline-gold">Our Story</a>
          </div>
          <div className="hero-stats">
            <AnimatedStat num="500" suffix="+" label="Events Hosted" />
            <AnimatedStat num="1500" suffix="+" label="Total Capacity" />
            <AnimatedStat num="2" suffix="" label="Banquet Halls" />
            <AnimatedStat num="12" suffix="+" label="Years Legacy" />
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ─── About / Our Story ─── */}
      <section className="section section-cream" id="about">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Our Story</div>
          <h2 className="section-title">A Legacy of Celebrations</h2>
          <p className="section-desc">
            More than just a venue — we're a family that takes pride in making your celebrations special.
          </p>
        </div>

        <div className="about-content">
          <div className="about-story animate-on-scroll">
            <div className="about-image-area">
              <div className="about-image-placeholder">
                <img src={FOUNDER_IMAGE} alt="Sri Bhadraiah Chakinala - Founder" className="about-founder-img" />
                <div className="about-image-label">Est. 2012</div>
              </div>
              <div className="about-experience-badge">
                <div className="about-exp-num">12+</div>
                <div className="about-exp-text">Years of<br/>Trust</div>
              </div>
            </div>
            <div className="about-text-area">
              <h3 className="about-heading">Founded by Sri Bhadraiah Chakinala</h3>
              <div className="about-divider"></div>
              <p className="about-para">
                In 2012, Sri Bhadraiah Chakinala had a simple but powerful vision — to create an event venue
                in Kuravi where families could celebrate their most important moments without worrying about
                affordability. Coming from a middle-class background himself, he understood the need for a
                spacious, well-equipped venue that doesn't burn a hole in people's pockets.
              </p>
              <p className="about-para">
                What started as a single hall has grown into Kuravi's most trusted celebration destination
                with two banquet halls, beautiful gardens, and a reputation built on personal care and
                community trust. Today, the Chakinala family continues to personally oversee every event,
                ensuring that each family's celebration receives the attention and care it deserves.
              </p>
              <div className="about-values">
                <div className="about-value">
                  <span className="about-value-icon">🙏</span>
                  <div>
                    <strong>Family Values</strong>
                    <p>Every event is treated as our own family celebration</p>
                  </div>
                </div>
                <div className="about-value">
                  <span className="about-value-icon">💎</span>
                  <div>
                    <strong>Honest Pricing</strong>
                    <p>Transparent, affordable rates with no hidden charges</p>
                  </div>
                </div>
                <div className="about-value">
                  <span className="about-value-icon">🤝</span>
                  <div>
                    <strong>Personal Touch</strong>
                    <p>Owner-managed with hands-on involvement in every event</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="journey-section">
          <h3 className="journey-title animate-on-scroll">Our Journey</h3>
          <div className="journey-timeline">
            {journeyMilestones.map((m, i) => (
              <div key={i} className="journey-item animate-on-scroll" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="journey-year">{m.year}</div>
                <div className="journey-dot" />
                <div className="journey-card">
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="section section-dark" id="why-us">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Why Families Trust Us</div>
          <h2 className="section-title">Why Choose Om Function Hall</h2>
          <p className="section-desc">
            Trusted by 500+ families across Mahabubabad district for their most precious celebrations.
          </p>
        </div>
        <div className="why-grid">
          {whyChooseUs.map((item, i) => (
            <div key={i} className="why-card animate-on-scroll" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="why-icon">{item.icon}</div>
              <h3 className="why-title">{item.title}</h3>
              <p className="why-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Venues ─── */}
      <section className="section section-cream" id="venues">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Our Spaces</div>
          <h2 className="section-title">Two Spacious Banquet Halls</h2>
          <p className="section-desc">Choose the perfect venue size for your celebration. Both halls come with essential amenities and dedicated preparation rooms.</p>
        </div>
        <div className="venues-grid">
          {venues.map((v, i) => (
            <div key={i} className="venue-card animate-on-scroll" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="venue-img" style={{ background: v.bg }}>
                <div className="venue-icon">{v.emoji}</div>
                <div className="venue-badge">{v.badge}</div>
              </div>
              <div className="venue-body">
                <h3 className="venue-name">{v.name}</h3>
                <p className="venue-desc">{v.desc}</p>
                <div className="venue-features">
                  {v.features.map((f, j) => <span key={j} className="venue-feature">{f}</span>)}
                </div>
                <div className="venue-capacity">Capacity: {v.capacity} guests</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Image Gallery Carousel ─── */}
      <section className="section section-dark" id="gallery">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Photo Gallery</div>
          <h2 className="section-title">Explore Our Venue</h2>
          <p className="section-desc">Take a visual tour of our beautiful halls, decorations, and past celebrations.</p>
        </div>
        <div className="carousel-wrapper animate-on-scroll">
          <ImageCarousel images={GALLERY_IMAGES} autoPlayInterval={5000} />
        </div>
      </section>

      {/* ─── Events We Host (Tabbed) ─── */}
      <section className="section section-warm">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Celebrations</div>
          <h2 className="section-title">Events We Host</h2>
          <p className="section-desc">From traditional Telugu weddings to family gatherings, we make every celebration special and memorable.</p>
        </div>
        <div className="events-flow">
          {events.map((ev, i) => (
            <div key={i} className="event-pill animate-on-scroll" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="event-emoji">{ev.emoji}</div>
              <div className="event-info">
                <h4>{ev.name}</h4>
                <p>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Services ─── */}
      <section className="section section-cream" id="services">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">What We Offer</div>
          <h2 className="section-title">Our Services</h2>
          <p className="section-desc">Everything you need for a successful celebration under one roof.</p>
        </div>
        <div className="services-grid services-grid-light">
          {services.map((s, i) => (
            <div key={i} className="service-card service-card-light animate-on-scroll" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="service-icon">{s.icon}</span>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="decoration-note animate-on-scroll">
          <p>* Decoration services available at additional charges. Contact us for custom decoration packages.</p>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="section section-warm" id="pricing">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Affordable Pricing</div>
          <h2 className="section-title">Transparent & Budget-Friendly</h2>
          <p className="section-desc">Quality venue at reasonable prices for middle-class families. Contact us for exact quotes based on your requirements.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card animate-on-scroll">
            <div className="price-name">Celebration Hall</div>
            <div className="price-subtitle">500+ Guests Capacity</div>
            <div className="price-tag">Contact<span> for quote</span></div>
            <ul className="price-features">
              <li><span className="check">✓</span> Combined Hall for 500+ guests</li>
              <li><span className="check">✓</span> Bride & Groom Rooms</li>
              <li><span className="check">✓</span> Basic Sound System</li>
              <li><span className="check">✓</span> Seating Arrangements</li>
              <li><span className="check">✓</span> Parking Space</li>
              <li><span className="check">✓</span> Electricity & Lighting</li>
            </ul>
            <a href="#booking" className="btn btn-outline" style={{ color: "var(--text)", borderColor: "var(--cream-dark)", width: "100%", justifyContent: "center" }}>Get Quote</a>
          </div>
          <div className="price-card popular animate-on-scroll" style={{ animationDelay: "0.15s" }}>
            <div className="price-popular-badge">Best Value</div>
            <div className="price-name">Grand Banquet Hall</div>
            <div className="price-subtitle">1000+ Guests Capacity</div>
            <div className="price-tag">Contact<span> for quote</span></div>
            <ul className="price-features">
              <li><span className="check">✓</span> Separate Dining & Event Sheds</li>
              <li><span className="check">✓</span> 1000+ Guest Capacity</li>
              <li><span className="check">✓</span> Bride & Groom Rooms</li>
              <li><span className="check">✓</span> Sound System</li>
              <li><span className="check">✓</span> Stage Area</li>
              <li><span className="check">✓</span> Complete Seating</li>
              <li><span className="check">✓</span> Large Parking Area</li>
            </ul>
            <a href="#booking" className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>Book Now</a>
          </div>
        </div>
        <div className="pricing-note animate-on-scroll">
          <h4>Additional Services (Extra Charges)</h4>
          <div className="extra-services">
            <span>🎊 Decoration</span>
            <span>🍽️ Catering</span>
            <span>📸 Photography</span>
            <span>🎵 DJ Services</span>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="section section-dark" id="testimonials">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Google Reviews</div>
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-desc">Real reviews from families who celebrated their special moments with us.</p>
        </div>
        <div className="testimonials-track">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card animate-on-scroll" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="testimonial-stars">{"★".repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-event">{t.event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="google-reviews-badge animate-on-scroll">
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
            See all reviews on Google →
          </a>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="cta-banner">
        <div className="cta-banner-content animate-on-scroll">
          <h2>Ready to Celebrate Your Special Day?</h2>
          <p>Book Om Function Hall today and let us help you create memories that last a lifetime.</p>
          <div className="cta-banner-buttons">
            <a href="#booking" className="btn btn-gold">Check Availability</a>
            <a href={`tel:${PHONE}`} className="btn btn-outline">Call {PHONE}</a>
          </div>
        </div>
      </section>

      {/* ─── Booking & Contact ─── */}
      <section className="section section-cream" id="booking">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Reserve Your Date</div>
          <h2 className="section-title">Check Availability & Book</h2>
          <p className="section-desc">Fill in your details and we'll confirm availability instantly via WhatsApp or call.</p>
        </div>
        <div className="booking-section">
          <form className="booking-form animate-on-scroll" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input type="text" name="name" className="form-input" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input type="tel" name="phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input type="email" name="email" className="form-input" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select name="event" className="form-select" value={formData.event} onChange={handleChange}>
                  <option value="">Select event</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Reception">Reception</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Pooja">Pooja / Religious</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Family Function">Family Function</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Expected Guests</label>
              <select name="guests" className="form-select" value={formData.guests} onChange={handleChange}>
                <option value="">Select range</option>
                <option value="100-300">100 – 300</option>
                <option value="300-500">300 – 500</option>
                <option value="500-800">500 – 800</option>
                <option value="800-1000">800 – 1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Special Requirements</label>
              <textarea name="message" className="form-textarea" placeholder="Tell us about your event, decoration needs, catering requirements..." value={formData.message} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: "100%", justifyContent: "center", fontSize: "1rem" }}>
              Send Enquiry via WhatsApp
            </button>
          </form>

          <div className="booking-info animate-on-scroll" id="contact">
            <h3>Get in Touch</h3>
            <p style={{ color: "var(--text-light)", fontSize: "0.9rem", lineHeight: "1.8", marginBottom: "2rem" }}>
              Have questions? Reach out to us directly. We're happy to help you plan the perfect event within your budget.
            </p>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h4>Location</h4>
                <p>{ADDRESS}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h4>Call Us</h4>
                <p><a href={`tel:${PHONE}`} style={{ color: "var(--gold-dark)", textDecoration: "none", fontWeight: 600 }}>{PHONE}</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <h4>Email</h4>
                <p><a href={`mailto:${EMAIL}`} style={{ color: "var(--gold-dark)", textDecoration: "none", fontWeight: 600 }}>{EMAIL}</a></p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-text">
                <h4>Working Hours</h4>
                <p>Open Daily: 6:00 AM – 11:00 PM<br />Bookings: 9:00 AM – 8:00 PM</p>
              </div>
            </div>

            <div className="quick-actions">
              <a href={`https://wa.me/${WHATSAPP}?text=Hello! I want to enquire about booking Om Function Hall.`} target="_blank" rel="noopener noreferrer" className="action-btn action-call">WhatsApp</a>
              <a href={`tel:${PHONE}`} className="action-btn action-phone">Call Now</a>
              <a href={`mailto:${EMAIL}`} className="action-btn action-email">Email</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Map ─── */}
      <section className="section section-warm" id="location">
        <div className="section-header animate-on-scroll">
          <div className="section-tag">Find Us</div>
          <h2 className="section-title">Our Location</h2>
          <p className="section-desc">Conveniently located on the main road in Kuravi, easily accessible from Mahabubabad (11 km) and Warangal (70 km).</p>
        </div>
        <div className="map-container animate-on-scroll">
          <div className="map-overlay">
            <h4>Om Function Hall & Gardens</h4>
            <p>{ADDRESS}</p>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">Get Directions →</a>
          </div>
          <iframe className="map-iframe" src={GOOGLE_MAPS_EMBED}
            title="Om Function Hall And Gardens - Kuravi, Telangana" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <div className="footer-logo-icon">ॐ</div>
              <h3>Om Function Hall & Gardens</h3>
            </div>
            <p>
              Kuravi's trusted and affordable event venue since 2012. Founded by Sri Bhadraiah Chakinala,
              we've been helping families celebrate their special moments for over a decade. Spacious halls,
              essential amenities, and budget-friendly pricing.
            </p>
            <div className="footer-social">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" title="WhatsApp">💬</a>
              <a href={`tel:${PHONE}`} title="Call Us">📞</a>
              <a href={`mailto:${EMAIL}`} title="Email Us">✉️</a>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" title="Google Maps">📍</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#venues">Our Venues</a>
            <a href="#gallery">Gallery</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#booking">Book Now</a>
          </div>
          <div className="footer-col">
            <h4>Events</h4>
            <a href="#booking">Weddings</a>
            <a href="#booking">Receptions</a>
            <a href="#booking">Engagements</a>
            <a href="#booking">Birthday Parties</a>
            <a href="#booking">Family Functions</a>
            <a href="#booking">Religious Events</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href={`tel:${PHONE}`}>{PHONE}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="#location">Kuravi, Telangana</a>
            <a href="#location">PIN: 506105</a>
            <a href="#booking" style={{ color: "var(--gold)", fontWeight: 600, marginTop: "0.5rem" }}>Check Availability →</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Om Function Hall And Gardens, Kuravi. All rights reserved.</p>
          <p>Developed by Shreenath Chakinala</p>
        </div>
      </footer>

      {/* ─── Floating Action Buttons ─── */}
      <div className="floating-cta">
        <a href={`https://wa.me/${WHATSAPP}?text=Hi! I'd like to know about availability at Om Function Hall.`} target="_blank" rel="noopener noreferrer" className="float-btn float-whatsapp" title="Chat on WhatsApp" aria-label="WhatsApp">
          💬
        </a>
        <a href={`tel:${PHONE}`} className="float-btn float-phone" title="Call Us" aria-label="Call">
          📞
        </a>
      </div>

      {/* ─── Success Modal ─── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎉</div>
            <h3>Enquiry Sent!</h3>
            <p>Your booking request has been sent via WhatsApp. Our team will get back to you within 1 hour. Thank you for choosing Om Function Hall!</p>
            <button className="btn btn-gold" onClick={() => setShowModal(false)}>Great, Thanks!</button>
          </div>
        </div>
      )}
    </>
  );
}
