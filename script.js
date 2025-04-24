document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const itemsPerPage = 9;
  const laptopList = document.getElementById("laptop-list");
  const inputs = ['search', 'company', 'price', 'processor', 'generation', 'model', 'ram', 'storage', 'screen', 'graphics'];
  const filters = {};
  const laptopsCache = {}; // To store loaded JSON files
  const totalItems = 500; // Replace this with the real count if you have it
  const itemsPerFile = 90; // 9 laptops/page * 10 pages/file

  inputs.forEach(id => filters[id] = document.getElementById(id));

  let laptops = [];

  function getFileIndexFromPage(page) {
    return Math.ceil(page / (itemsPerFile / itemsPerPage));
  }

  async function loadLaptopsJSON(page) {
    const fileIndex = getFileIndexFromPage(page);
    if (laptopsCache[fileIndex]) {
      laptops = laptopsCache[fileIndex];
      filterLaptops();
    } else {
      try {
        const response = await fetch(`laptops${fileIndex}.json`);
        const data = await response.json();
        laptopsCache[fileIndex] = data; // Cache it
        laptops = data;
        filterLaptops();
      } catch (err) {
        laptopList.innerHTML = '<p class="text-red-500">Failed to load laptops. Please try again later.</p>';
        console.error(`Error loading laptops${fileIndex}.json:`, err);
      }
    }
  }

  function renderLaptops(data) {
    laptopList.innerHTML = '';
    const start = ((currentPage - 1) % (itemsPerFile / itemsPerPage)) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedLaptops = data.slice(start, end);

    if (paginatedLaptops.length === 0) {
      laptopList.innerHTML = '<p class="col-span-3 text-center text-gray-500">No laptops found.</p>';
      return;
    }

    paginatedLaptops.forEach(laptop => {
      const item = document.createElement('div');
      item.className = 'border rounded-lg p-4 shadow hover:shadow-lg transition hover:border-2';
      item.innerHTML = `
        <h2 class="text-lg font-bold">${laptop.name}</h2>
        <p class="text-sm">${laptop.company}</p>
        <p class="text-primary font-semibold">Rs.${laptop.price}/-</p>
        <div class="flex flex-col flex-nowrap justify-between items-start gap-2">
          <ul class="text-sm space-y-1 mt-4">
          <li><strong>Processor:</strong> ${laptop.processor}</li>
          <li><strong>Generation:</strong> ${laptop.generation}</li>
          <li><strong>Model:</strong> ${laptop.model}</li>
          <li><strong>RAM:</strong> ${laptop.ram}</li>
          <li><strong>Storage:</strong> ${laptop.storage}</li>
          <li><strong>Screen:</strong> ${laptop.screen}</li>
          <li><strong>Graphics:</strong> ${laptop.graphics}</li>
          </ul>
            <a href="https://wa.link/laptopmartmultan" target="_blank" class="w-full group text-[#252054] bg-[#fafafa] flex flex-row flex-nowrap justify-center items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-blue-600 hover:text-[#fafafa] transition">
            <svg class="group-hover:fill-[#fafafa]" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#252054"><path d="..."/></svg>
            Call Now
            </a>
      </div>`;
      laptopList.appendChild(item);
    });

    renderPagination(totalItems);
  }

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const pagesToShow = getPagination(currentPage, totalPages);

    pagesToShow.forEach(page => {
      const button = document.createElement('button');

      if (page === '...') {
        button.textContent = '...';
        button.disabled = true;
        button.className = 'px-3 py-1 mx-1 text-gray-400 cursor-default';
      } else {
        button.className = `px-3 py-1 rounded border mx-1 ${
          page === currentPage ? 'bg-gray-100 text-gray-700' : 'bg-primary text-[#fafafa]'
        } hover:cursor-pointer`;
        button.textContent = page;
        button.addEventListener('click', () => {
          currentPage = page;
          loadLaptopsJSON(page);
        });
      }

      pagination.appendChild(button);
    });
  }

  // get pagination
  function getPagination(current, total) {
    const pages = [];
  
    // Always include the first page
    pages.push(1);
  
    // Add ellipsis if current - 1 is more than 2
    if (current - 1 > 2) {
      pages.push('...');
    }
  
    // Include previous page if it's not first or out of range
    if (current - 1 > 1) {
      pages.push(current - 1);
    }
  
    // Always include current page (if not first or last)
    if (current !== 1 && current !== total) {
      pages.push(current);
    }
  
    // Include next page if it's not last or out of range
    if (current + 1 < total) {
      pages.push(current + 1);
    }
  
    // Add ellipsis if current + 1 is less than total - 1
    if (current + 1 < total - 1) {
      pages.push('...');
    }
  
    // Always include the last page (if more than 1)
    if (total > 1) {
      pages.push(total);
    }
  
    return pages;
  }
  
  function filterLaptops() {
    const filtered = laptops.filter(laptop => {
      return (
        (!filters.search.value || laptop.name.toLowerCase().includes(filters.search.value.toLowerCase())) &&
        (!filters.company.value || laptop.company === filters.company.value) &&
        (!filters.price.value || laptop.price <= parseFloat(filters.price.value)) &&
        (!filters.processor.value || laptop.processor.toLowerCase().includes(filters.processor.value.toLowerCase())) &&
        (!filters.generation.value || laptop.generation.toLowerCase().includes(filters.generation.value.toLowerCase())) &&
        (!filters.model.value || laptop.model.toLowerCase().includes(filters.model.value.toLowerCase())) &&
        (!filters.ram.value || laptop.ram.toLowerCase().includes(filters.ram.value.toLowerCase())) &&
        (!filters.storage.value || laptop.storage.toLowerCase().includes(filters.storage.value.toLowerCase())) &&
        (!filters.screen.value || laptop.screen.toLowerCase().includes(filters.screen.value.toLowerCase())) &&
        (!filters.graphics.value || laptop.graphics.toLowerCase().includes(filters.graphics.value.toLowerCase()))
      );
    });

    const totalFilteredPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalFilteredPages) currentPage = 1;

    renderLaptops(filtered);
  }

  // Load the first file by default
  loadLaptopsJSON(currentPage);

  // Event listeners
  inputs.forEach(id => {
    filters[id].addEventListener('input', () => {
      currentPage = 1;
      filterLaptops();
    });
  });

  filters.company.addEventListener('change', () => {
    currentPage = 1;
    filterLaptops();
  });
});
