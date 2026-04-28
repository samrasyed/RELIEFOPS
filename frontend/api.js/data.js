export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY;

    const response = await fetch("/api/data");
    const data = await response.json();

    res.status(200).json(data);
}
