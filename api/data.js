export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY;

    try {
        const response = await fetch(`https://api.example.com/data?key=${API_KEY}`);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}