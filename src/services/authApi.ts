export type AuthResponse = {
  ok: boolean;
  token?: string;
  user?: { id: string; email: string; createdAt: Date };
  message?: string;
};

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });
  
  const data = await res.json();
  if(!res.ok) throw new Error(data.message ?? 'Failed to login with Google');
  return data;
}