document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation Menu ---
  const mobileMenuIcon = document.querySelector('.hamburger');
  const navigationMenu = document.querySelector('.nav-links');
  
  if (mobileMenuIcon) {
    mobileMenuIcon.addEventListener('click', () => {
      navigationMenu.classList.toggle('show');
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

    const updateButtons = () => {
      if (currentSlide === slides.length - 1) {
        nextBtn.textContent = 'Finish';
      } else {
        nextBtn.textContent = 'Next Step';
      }
    };

    const showSlide = (index) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
      updateButtons();
    };

    nextBtn.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      } else {
        window.location.href = 'index.html'; // Go home when finished
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
      }
    });
    
    // Initialize buttons state on load
    updateButtons();
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
    // Use mock data instead of calling the API for now
    let cardDB = [
      {
        name: 'Charizard ex',
        number: '199',
        set: { name: 'Pokémon 151' },
        rarity: 'Special Illustration Rare',
        images: { large: 'https://images.pokemontcg.io/sv3pt5/199_hires.png' },
        tcgplayer: { prices: { holofoil: { market: 115.50, low: 95.00, high: 140.00 } } }
      },
      {
        name: 'Blastoise ex',
        number: '200',
        set: { name: 'Pokémon 151' },
        rarity: 'Special Illustration Rare',
        images: { large: 'https://images.pokemontcg.io/sv3pt5/200_hires.png' },
        tcgplayer: { prices: { holofoil: { market: 45.20, low: 40.00, high: 55.00 } } }
      },
      {
        name: 'Venusaur ex',
        number: '198',
        set: { name: 'Pokémon 151' },
        rarity: 'Special Illustration Rare',
        images: { large: 'https://images.pokemontcg.io/sv3pt5/198_hires.png' },
        tcgplayer: { prices: { holofoil: { market: 42.10, low: 38.00, high: 50.00 } } }
      },
      {
        name: 'Pikachu',
        number: '173',
        set: { name: 'Pokémon 151' },
        rarity: 'Illustration Rare',
        images: { large: 'https://images.pokemontcg.io/sv3pt5/173_hires.png' },
        tcgplayer: { prices: { normal: { market: 18.50, low: 15.00, high: 25.00 } } }
      },
      {
        name: 'Alakazam ex',
        number: '201',
        set: { name: 'Pokémon 151' },
        rarity: 'Special Illustration Rare',
        images: { large: 'https://images.pokemontcg.io/sv3pt5/201_hires.png' },
        tcgplayer: { prices: { holofoil: { market: 32.40, low: 28.00, high: 40.00 } } }
      }
    ];

    searchInput.placeholder = 'Search (e.g., Charizard)...';
    searchInput.disabled = false;

    // Handle typing in search
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      searchResults.innerHTML = '';
      if (query.length > 1) {
        const filtered = cardDB.filter(c => c.name.toLowerCase().includes(query));
        if (filtered.length > 0) {
          searchResults.style.display = 'block';
          // Limit to 10 results to prevent massive lists
          filtered.slice(0, 10).forEach(card => {
            const li = document.createElement('li');
            li.textContent = card.name + (card.number ? ` (#${card.number})` : '');
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
      
      cardSet.textContent = card.set ? card.set.name : 'Pokémon 151';
      
      const badges = document.querySelectorAll('.badge');
      badges[0].textContent = card.set ? card.set.name : 'Pokémon 151';
      
      if(badges.length > 1) {
        badges[1].textContent = card.rarity || 'Common';
      }

      badges.forEach(b => {
        b.style.background = 'var(--color-secondary)';
        b.style.color = '#fff';
      });

      // Update the Image
      const cardImg = document.getElementById('selected-card-img');
      if (card.images && card.images.large) {
        cardImg.src = card.images.large;
        cardImg.style.background = 'transparent'; // Remove placeholder gray
      }

      // Safe price extraction (handling missing data)
      let marketPrice = 'N/A';
      let lowPrice = 'N/A';
      let highPrice = 'N/A';

      if (card.tcgplayer && card.tcgplayer.prices) {
        // Try holofoil first, then reverseHolofoil, then normal
        const prices = card.tcgplayer.prices.holofoil || card.tcgplayer.prices.normal || card.tcgplayer.prices.reverseHolofoil;
        if (prices) {
          marketPrice = prices.market ? `$${prices.market.toFixed(2)}` : 'N/A';
          lowPrice = prices.low ? `$${prices.low.toFixed(2)}` : 'N/A';
          highPrice = prices.high ? `$${prices.high.toFixed(2)}` : 'N/A';
        }
      }

      statMarket.textContent = marketPrice;
      statLow.textContent = lowPrice;
      statHigh.textContent = highPrice;

      const statValues = document.querySelectorAll('.stat-value');
      statValues.forEach(v => {
        v.style.background = 'transparent';
        v.style.color = '#333';
        v.style.fontWeight = 'bold';
        v.style.fontSize = '24px';
      });

      document.querySelector('.chart-title-placeholder').style.background = 'transparent';
      document.querySelector('.chart-title-placeholder').style.color = 'var(--color-primary)';

      // Mock chart data render (ideally this would use historical data, but the API only provides current data)
      renderChart('1M', marketPrice !== 'N/A' ? parseFloat(marketPrice.replace('$','')) : 10); 
    };

    const renderChart = (range, basePrice = 100) => {
      // Generate mock historical data based on the real basePrice
      let labels, data;
      if (range === '1W') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = Array.from({length: 7}, () => basePrice * (0.95 + Math.random() * 0.1));
      } else if (range === '1M') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = Array.from({length: 4}, () => basePrice * (0.90 + Math.random() * 0.2));
      } else if (range === '3M') {
        labels = ['Month 1', 'Month 2', 'Month 3'];
        data = Array.from({length: 3}, () => basePrice * (0.85 + Math.random() * 0.3));
      } else if (range === '1Y') {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = Array.from({length: 12}, () => basePrice * (0.7 + Math.random() * 0.6));
      }
      
      // The last data point should end roughly around the current basePrice
      data[data.length - 1] = basePrice;

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
        // We get the current market price from the DOM to keep scaling
        let currentPriceText = statMarket.textContent.replace('$', '');
        let currentPrice = parseFloat(currentPriceText);
        if (isNaN(currentPrice)) currentPrice = 100;

        renderChart(e.target.dataset.range, currentPrice);
      });
    });
  }
});
