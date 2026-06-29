// Type declaration for Chart.js (loaded via CDN)
declare var Chart: any;

interface PokemonCard {
  name: string;
  number?: string;
  set?: {
    name: string;
  };
  rarity?: string;
  images?: {
    large: string;
  };
  tcgplayer?: {
    prices?: {
      holofoil?: { market?: number; low?: number; high?: number };
      reverseHolofoil?: { market?: number; low?: number; high?: number };
      normal?: { market?: number; low?: number; high?: number };
    };
  };
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Navigation Menu ---
  const mobileMenuIcon = document.querySelector('.hamburger') as HTMLElement | null;
  const navigationMenu = document.querySelector('.nav-links') as HTMLElement | null;
  
  if (mobileMenuIcon && navigationMenu) {
    mobileMenuIcon.addEventListener('click', () => {
      navigationMenu.classList.toggle('show');
    });
  }

  // --- 2. Carousel Logic (Homepage) ---
  const carouselSlide = document.getElementById('news-carousel') as HTMLElement | null;
  if (carouselSlide) {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn.prev') as HTMLElement | null;
    const nextBtn = document.querySelector('.carousel-btn.next') as HTMLElement | null;
    
    let counter = 0;
    const size = 100; // 100%

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (counter >= carouselItems.length - 1) counter = -1;
        counter++;
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + '%)';
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (counter <= 0) counter = carouselItems.length;
        counter--;
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + '%)';
      });
    }
  }

  // --- 3. Guide Slider (Beginner Guides) ---
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    const prevBtn = document.getElementById('guide-prev') as HTMLElement | null;
    const nextBtn = document.getElementById('guide-next') as HTMLElement | null;
    let currentSlide = 0;

    const showSlide = (index: number) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          showSlide(currentSlide);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
          currentSlide--;
          showSlide(currentSlide);
        }
      });
    }
  }

  // --- 4. FAQ Accordion (About) ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const q = item.querySelector('.faq-q') as HTMLElement | null;
      if (q) {
        q.addEventListener('click', () => {
          // Toggle current
          item.classList.toggle('active');
          q.classList.toggle('active');
          
          // Optional: close others
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherQ = otherItem.querySelector('.faq-q');
              if (otherQ) {
                otherQ.classList.remove('active');
              }
            }
          });
        });
      }
    });
  }

  // --- 5. Chart.js & Search (Prices) ---
  const searchInput = document.getElementById('card-search') as HTMLInputElement | null;
  const searchResults = document.getElementById('search-results') as HTMLElement | null;
  const cardDetailsSection = document.getElementById('card-details-section') as HTMLElement | null;
  const cardTitle = document.getElementById('selected-card-title') as HTMLElement | null;
  const cardSet = document.getElementById('selected-card-set') as HTMLElement | null;
  const statMarket = document.getElementById('stat-market') as HTMLElement | null;
  const statLow = document.getElementById('stat-low') as HTMLElement | null;
  const statHigh = document.getElementById('stat-high') as HTMLElement | null;
  const ctx = document.getElementById('priceChart') as HTMLCanvasElement | null;
  let priceChart: any = null;

  if (searchInput && ctx && searchResults) {
    let cardDB: PokemonCard[] = [];

    // Show a loading message in the input
    searchInput.placeholder = 'Loading 151 Set cards... Please wait.';
    searchInput.disabled = true;

    // Fetch the 151 Set (sv3pt5) from the API
    fetch('https://api.pokemontcg.io/v2/cards?q=set.id:sv3pt5&pageSize=250')
      .then(response => response.json())
      .then(data => {
        if(data && data.data) {
          cardDB = data.data;
          searchInput.placeholder = 'Search 151 set (e.g., Charizard)...';
          searchInput.disabled = false;
        }
      })
      .catch(err => {
        console.error('Failed to fetch cards:', err);
        searchInput.placeholder = 'Error loading cards.';
      });

    // Handle typing in search
    searchInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const query = target.value.toLowerCase();
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

    const selectCard = (card: PokemonCard) => {
      searchInput.value = card.name;
      searchResults.style.display = 'none';
      if (cardDetailsSection) cardDetailsSection.style.display = 'block';
      
      // Update DOM with card details
      if (cardTitle) {
        cardTitle.textContent = card.name;
        cardTitle.style.background = 'transparent';
        cardTitle.style.color = 'var(--color-primary)';
      }
      
      if (cardSet) {
        cardSet.textContent = card.set ? card.set.name : 'Pokémon 151';
      }
      
      const badges = document.querySelectorAll('.badge') as NodeListOf<HTMLElement>;
      if (badges.length > 0) {
        badges[0].textContent = card.set ? card.set.name : 'Pokémon 151';
        if (badges.length > 1) {
          badges[1].textContent = card.rarity || 'Common';
        }
        badges.forEach(b => {
          b.style.background = 'var(--color-secondary)';
          b.style.color = '#fff';
        });
      }

      // Update the Image
      const cardImg = document.getElementById('selected-card-img') as HTMLImageElement | null;
      if (cardImg && card.images && card.images.large) {
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

      if (statMarket) statMarket.textContent = marketPrice;
      if (statLow) statLow.textContent = lowPrice;
      if (statHigh) statHigh.textContent = highPrice;

      const statValues = document.querySelectorAll('.stat-value') as NodeListOf<HTMLElement>;
      statValues.forEach(v => {
        v.style.background = 'transparent';
        v.style.color = '#333';
        v.style.fontWeight = 'bold';
        v.style.fontSize = '24px';
      });

      const chartTitle = document.querySelector('.chart-title-placeholder') as HTMLElement | null;
      if (chartTitle) {
        chartTitle.style.background = 'transparent';
        chartTitle.style.color = 'var(--color-primary)';
      }

      // Mock chart data render (ideally this would use historical data, but the API only provides current data)
      renderChart('1M', marketPrice !== 'N/A' ? parseFloat(marketPrice.replace('$','')) : 10); 
    };

    const renderChart = (range: string, basePrice: number = 100) => {
      // Generate mock historical data based on the real basePrice
      let labels: string[] = [];
      let data: number[] = [];
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
      if (data.length > 0) {
        data[data.length - 1] = basePrice;
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
      btn.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        tabBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
        
        // We get the current market price from the DOM to keep scaling
        let currentPriceText = statMarket ? statMarket.textContent?.replace('$', '') || '100' : '100';
        let currentPrice = parseFloat(currentPriceText);
        if (isNaN(currentPrice)) currentPrice = 100;

        renderChart(target.dataset.range || '1M', currentPrice);
      });
    });
  }
});
