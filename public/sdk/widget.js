(function() {
  const OFFRI_DOMAIN = window.location.origin; // In production, this would be https://offrion.com

  const injectStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .offrion-widget-container {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 100%;
        margin: 0 auto;
      }
      .offrion-deal-card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 20px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
      }
      .offrion-deal-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.06);
        border-color: rgba(0,0,0,0.15);
      }
      .offrion-deal-image {
        width: 64px;
        height: 64px;
        border-radius: 14px;
        background: #f0f0f0;
        object-fit: cover;
        flex-shrink: 0;
      }
      .offrion-deal-info {
        flex: 1;
        min-width: 0;
      }
      .offrion-deal-category {
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #00A63E; /* Offrion Primary */
        margin-bottom: 4px;
      }
      .offrion-deal-title {
        font-size: 14px;
        font-weight: 700;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #1a1a1a;
      }
      .offrion-deal-merchant {
        font-size: 11px;
        color: #666;
        margin-top: 2px;
      }
      .offrion-deal-action {
        text-align: right;
        flex-shrink: 0;
      }
      .offrion-deal-price {
        font-size: 15px;
        font-weight: 800;
        color: #000;
      }
      .offrion-deal-old-price {
        font-size: 10px;
        color: #999;
        text-decoration: line-through;
        margin-bottom: 2px;
      }
      .offrion-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #00A63E;
        color: white;
        padding: 4px 10px;
        font-size: 9px;
        font-weight: 800;
        border-bottom-left-radius: 10px;
      }
    `;
    document.head.appendChild(style);
  };

  const createDealCard = (deal) => {
    const card = document.createElement('a');
    card.className = 'offrion-deal-card';
    card.href = `${OFFRI_DOMAIN}/deals/${deal._id}?ref=sdk`;
    card.target = '_blank';
    
    const discountLabel = deal.originalPrice > deal.discountedPrice 
      ? `-${Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)}%` 
      : null;

    card.innerHTML = `
      ${discountLabel ? `<div class="offrion-badge">${discountLabel}</div>` : ''}
      <img src="${deal.images?.[0] || 'https://via.placeholder.com/100'}" class="offrion-deal-image" alt="${deal.title}">
      <div class="offrion-deal-info">
        <div class="offrion-deal-category">${deal.categoryId?.name || 'Deal'}</div>
        <h4 class="offrion-deal-title">${deal.title}</h4>
        <div class="offrion-deal-merchant">${deal.merchantId?.name || 'Global Retailer'}</div>
      </div>
      <div class="offrion-deal-action">
        <div class="offrion-deal-old-price">AED ${deal.originalPrice}</div>
        <div class="offrion-deal-price">AED ${deal.discountedPrice}</div>
      </div>
    `;
    return card;
  };

  const init = async () => {
    const target = document.getElementById('offrion-deals-widget');
    if (!target) return;

    injectStyles();

    const apiKey = target.getAttribute('data-api-key');
    const lat = target.getAttribute('data-lat');
    const lng = target.getAttribute('data-lng');
    const radius = target.getAttribute('data-radius') || '10000';
    const limit = target.getAttribute('data-limit') || '3';

    if (!apiKey) {
      target.innerHTML = '<div style="color: red; font-size: 12px;">Offrion Error: data-api-key is required</div>';
      return;
    }

    target.innerHTML = '<div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">Loading rewards...</div>';

    try {
      let url = `${OFFRI_DOMAIN}/api/deals?limit=${limit}`;
      if (lat && lng) url += `&lat=${lat}&lng=${lng}&radius=${radius}`;

      const response = await fetch(url, {
        headers: { 'x-api-key': apiKey }
      });

      if (!response.ok) throw new Error('Failed to fetch deals');
      const data = await response.json();
      const deals = data.deals || [];

      target.innerHTML = '';
      const container = document.createElement('div');
      container.className = 'offrion-widget-container';

      if (deals.length === 0) {
        target.innerHTML = '<div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">No deals found in this area.</div>';
        return;
      }

      deals.forEach(deal => {
        container.appendChild(createDealCard(deal));
      });

      target.appendChild(container);
    } catch (err) {
      console.error('Offrion SDK Error:', err);
      target.innerHTML = '<div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">Unable to load rewards.</div>';
    }
  };

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
