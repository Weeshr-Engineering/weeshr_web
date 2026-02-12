// lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/market/categories`, {
    next: { revalidate: 60 }, // revalidate every 60s
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const json = await res.json();
  return json.data || [];
}

// Fetch vendors by category ID
export async function fetchVendorsByCategory(categoryId: string) {
  const res = await fetch(
    `${API_BASE_URL}/market/vendors/category/${categoryId}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch vendors: ${res.status}`);
  }

  const json = await res.json();
  return json.data?.data || [];
}

// Fetch all vendors with pagination
export async function fetchAllVendors(page: number = 1) {
  const res = await fetch(
    `${API_BASE_URL}/market/vendors?page=${page}&per_page=8&sortOrder=desc`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch vendors: ${res.status}`);
  }

  const json = await res.json();
  return {
    vendors: json.data?.data || [],
    pagination: {
      currentPage: json.data?.currentPage || 1,
      totalPages: json.data?.totalPages || 1,
      totalItems: json.data?.totalItems || 0,
      perPage: json.data?.perPage || 2,
    },
  };
}

// Fetch products by vendor ID with pagination
export async function fetchProductsByVendor(
  vendorId: string,
  page: number = 1,
  perPage: number = 100,
) {
  const res = await fetch(
    `${API_BASE_URL}/market/products/?vendorId=${vendorId}&page=${page}&per_page=${perPage}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const json = await res.json();
  return {
    products: json.data?.data || [],
    pagination: {
      currentPage: json.data?.currentPage || 1,
      totalPages: json.data?.totalPages || 1,
      totalItems: json.data?.totalItems || 0,
      perPage: json.data?.perPage || perPage,
    },
  };
}

// Fetch single vendor by ID
export async function fetchVendorById(vendorId: string) {
  const res = await fetch(`${API_BASE_URL}/market/vendor/${vendorId}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch vendor: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

// Fetch single vendor by Slug (weeshrName)
export async function fetchVendorBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/market/vendor/name/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch vendor: ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}
