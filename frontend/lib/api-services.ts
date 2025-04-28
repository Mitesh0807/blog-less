import { API_URL } from "@/lib/api";
import { Post as AppPost } from "@/app/api";

export type Post = AppPost;

export async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_URL}/posts/featured`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getRecommendedPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_URL}/posts/recommended`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    return [];
  }
}
