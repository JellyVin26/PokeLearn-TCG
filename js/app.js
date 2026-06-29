document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Hamburger Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // --- 2. Carousel Logic (Homepage) ---
  const carouselSlide = document.getElementById('news-carousel');
  if (carouselSlide) {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    let counter = 0;
    const size = 100; // 100%

    nextBtn.addEventListener('click', () => {
      if (counter >= carouselItems.length - 1) counter = -1;
      counter++;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + '%)';
    });

    prevBtn.addEventListener('click', () => {
      if (counter <= 0) counter = carouselItems.length;
      counter--;
      carouselSlide.style.transform = 'translateX(' + (-size * counter) + '%)';
    });
  }

  // --- 3. Guide Slider (Beginner Guides) ---
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    const prevBtn = document.getElementById('guide-prev');
    const nextBtn = document.getElementById('guide-next');
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
    };

    nextBtn.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    });
  }

  // --- 4. FAQ Accordion (About) ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const q = item.querySelector('.faq-q');
      q.addEventListener('click', () => {
        // Toggle current
        item.classList.toggle('active');
        q.classList.toggle('active');
        
        // Optional: close others
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-q').classList.remove('active');
          }
        });
      });
    });
  }

  // --- 5. Chart.js & Search (Prices) ---
  const searchInput = document.getElementById('card-search');
  const searchResults = document.getElementById('search-results');
  const cardDetailsSection = document.getElementById('card-details-section');
  const cardTitle = document.getElementById('selected-card-title');
  const cardSet = document.getElementById('selected-card-set');
  const statMarket = document.getElementById('stat-market');
  const statLow = document.getElementById('stat-low');
  const statHigh = document.getElementById('stat-high');
  const ctx = document.getElementById('priceChart');
  let priceChart;

  if (searchInput && ctx) {
    // Mock database of cards
    const cardDB = [
      { id: 1, name: 'Charizard - Base Set (Unlimited) #4', set: 'Base Set', market: '$310.50', low: '$150.00', high: '$950.00' },
      { id: 2, name: 'Pikachu - Base Set #58', set: 'Base Set', market: '$5.20', low: '$1.00', high: '$20.00' },
      { id: 3, name: 'Mewtwo VSTAR - Crown Zenith #GG44', set: 'Crown Zenith', market: '$45.00', low: '$38.00', high: '$60.00' },
      { id: 4, name: 'Lugia V - Silver Tempest #186', set: 'Silver Tempest', market: '$140.00', low: '$110.00', high: '$180.00' },
      { id: 5, name: 'Umbreon VMAX (Alternate Art) - Evolving Skies #215', set: 'Evolving Skies', market: '$600.00', low: '$450.00', high: '$800.00' },
      { id: 6, name: 'Gengar VMAX (Alternate Art) - Fusion Strike #271', set: 'Fusion Strike', market: '$250.00', low: '$190.00', high: '$320.00' }
    ];

    // Handle typing in search
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      searchResults.innerHTML = '';
      if (query.length > 1) {
        const filtered = cardDB.filter(c => c.name.toLowerCase().includes(query) || c.set.toLowerCase().includes(query));
        if (filtered.length > 0) {
          searchResults.style.display = 'block';
          filtered.forEach(card => {
            const li = document.createElement('li');
            li.textContent = card.name;
            li.addEventListener('click', () => selectCard(card));
            searchResults.appendChild(li);
          });
        } else {
          searchResults.style.display = 'none';
        }
      } else {
        searchResults.style.display = 'none';
      }
    });

    const selectCard = (card) => {
      searchInput.value = card.name;
      searchResults.style.display = 'none';
      cardDetailsSection.style.display = 'block';
      
      // Update DOM with card details
      cardTitle.textContent = card.name;
      cardTitle.style.background = 'transparent';
      cardTitle.style.color = 'var(--color-primary)';
      
      cardSet.textContent = card.set;
      
      const badges = document.querySelectorAll('.badge');
      badges.forEach(b => {
        b.style.background = 'var(--color-secondary)';
        b.style.color = '#fff';
      });

      statMarket.textContent = card.market;
      statLow.textContent = card.low;
      statHigh.textContent = card.high;

      const statValues = document.querySelectorAll('.stat-value');
      statValues.forEach(v => {
        v.style.background = 'transparent';
        v.style.color = '#333';
        v.style.fontWeight = 'bold';
        v.style.fontSize = '24px';
      });

      document.querySelector('.chart-title-placeholder').style.background = 'transparent';
      document.querySelector('.chart-title-placeholder').style.color = 'var(--color-primary)';

      renderChart('1M'); // Default tab
    };

    const renderChart = (range) => {
      // Mock data based on range
      let labels, data;
      if (range === '1W') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [300, 305, 302, 310, 308, 315, 320];
      } else if (range === '1M') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [280, 290, 310, 320];
      } else if (range === '3M') {
        labels = ['Month 1', 'Month 2', 'Month 3'];
        data = [250, 280, 320];
      } else if (range === '1Y') {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = [150, 180, 200, 190, 210, 240, 260, 250, 270, 290, 310, 320];
      }

      if (priceChart) {
        priceChart.destroy();
      }

      priceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Market Price (USD)',
            data: data,
            borderColor: '#3D7DCA',
            backgroundColor: 'rgba(61, 125, 202, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: false }
          }
        }
      });
    };

    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderChart(e.target.dataset.range);
      });
    });
  }
});
