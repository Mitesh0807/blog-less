"use client";

import { useRouter } from "next/navigation";

interface SortFormProps {
  action: string;
  currentSort: string;
  pageParam?: number;
  tagParam?: string;
  authorParam?: string;
  searchParam?: string;
}

export default function SortForm({
  action,
  currentSort,
  pageParam,
  tagParam,
  authorParam,
  searchParam,
}: SortFormProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();

    if (pageParam && pageParam !== 1) {
      params.set("page", pageParam.toString());
    }

    if (tagParam) {
      params.set("tag", tagParam);
    }

    if (authorParam) {
      params.set("author", authorParam);
    }

    if (searchParam) {
      params.set("search", searchParam);
    }

    params.set("sort", e.target.value);

    const queryString = params.toString();
    const url = `${action}${queryString ? `?${queryString}` : ""}`;

    router.push(url);
  };

  return (
    <div className="relative">
      <select
        name="sort"
        defaultValue={currentSort}
        onChange={handleChange}
        className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 cursor-pointer"
      >
        <option value="-createdAt">Newest first</option>
        <option value="createdAt">Oldest first</option>
        <option value="-views">Most viewed</option>
        <option value="title">A-Z</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
