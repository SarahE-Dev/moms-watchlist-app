export async function testTMDBConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/test-tmdb")
    const data = await response.json()
    return data
  } catch (error) {
    return { success: false, message: `Connection failed: ${error}` }
  }
}
