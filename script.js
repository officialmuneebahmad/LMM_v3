document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1;
    const itemsPerPage = 9;
    const laptopList = document.getElementById("laptop-list");
    const inputs = ['search', 'company', 'price', 'processor', 'generation', 'ram', 'storage', 'screen', 'graphics'];
    const filters = {};
    inputs.forEach(id => filters[id] = document.getElementById(id));
  
    let laptops = [];
  
    // Render laptops per page
    function renderLaptops(data) {
      laptopList.innerHTML = '';
  
      const start = (currentPage - 1) * itemsPerPage;
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
          <div class="flex flex-row justify-between items-end">
            <ul class="text-sm space-y-1 mt-4">
            <li><strong>Processor:</strong> ${laptop.processor}</li>
            <li><strong>Generation:</strong> ${laptop.generation}</li>
            <li><strong>RAM:</strong> ${laptop.ram}</li>
            <li><strong>Storage:</strong> ${laptop.storage}</li>
            <li><strong>Screen:</strong> ${laptop.screen}</li>
            <li><strong>Graphics:</strong> ${laptop.graphics}</li>
            </ul>
            <a href="https://wa.link/laptopmartmultan" target="_blank" class="group mt-4 text-[#252054] bg-[#fafafa] inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-blue-600 hover:text-[#fafafa] transition">
            <svg class="group-hover:fill-[#fafafa]" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#252054"><path d="M480-440v-360q0-17 11.5-28.5T520-840h280q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560H600L480-440Zm80-200h200v-120H560v120Zm0 0v-120 120Zm238 520q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>
            Call Now
            </a>
        </div>
        `;
        laptopList.appendChild(item);
      });
  
      renderPagination(data.length);
    }
  
    // Render pagination
    function renderPagination(totalItems) {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
  
      if (totalPages <= 1) return;
  
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `px-3 py-1 rounded border mx-1 ${i === currentPage ? 'bg-gray-100 text-gray-700' : 'bg-primary text-[#fafafa]'} hover:cursor-pointer`;
        button.textContent = i;
        button.addEventListener('click', () => {
          currentPage = i;
          filterLaptops();
        });
        pagination.appendChild(button);
      }
    }
  
    // Filter laptops based on input
    function filterLaptops() {
      const filtered = laptops.filter(laptop => {
        return (
          (!filters.search.value || laptop.name.toLowerCase().includes(filters.search.value.toLowerCase())) &&
          (!filters.company.value || laptop.company === filters.company.value) &&
          (!filters.price.value || laptop.price <= parseFloat(filters.price.value)) &&
          (!filters.processor.value || laptop.processor.toLowerCase().includes(filters.processor.value.toLowerCase())) &&
          (!filters.generation.value || laptop.generation.toLowerCase().includes(filters.generation.value.toLowerCase())) &&
          (!filters.ram.value || laptop.ram.toLowerCase().includes(filters.ram.value.toLowerCase())) &&
          (!filters.storage.value || laptop.storage.toLowerCase().includes(filters.storage.value.toLowerCase())) &&
          (!filters.screen.value || laptop.screen.toLowerCase().includes(filters.screen.value.toLowerCase())) &&
          (!filters.graphics.value || laptop.graphics.toLowerCase().includes(filters.graphics.value.toLowerCase()))
        );
      });
  
      const totalFilteredPages = Math.ceil(filtered.length / itemsPerPage);
      if (currentPage > totalFilteredPages) currentPage = 1; // reset if currentPage is out of range
  
      renderLaptops(filtered);
    }
  
    // Fetch laptops.json
    fetch('laptops.json')
      .then(response => response.json())
      .then(data => {
        laptops = data;
        renderLaptops(laptops);
  
        // Add event listeners for filters
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
      })
      .catch(error => {
        laptopList.innerHTML = '<p class="text-red-500">Failed to load laptops. Please try again later.</p>';
        console.error("Error loading laptops.json:", error);
      });
  });
  