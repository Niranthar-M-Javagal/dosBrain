import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoteDetail = () => {
    const { id } = useParams(); // Grabs the ID from the URL
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem('token');
                // Adjust this URL to match your backend (e.g., /notes/:id)
                const res = await axios.get(`http://localhost:5000/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNote(res.data);
            } catch (err) {
                console.error("Error fetching note:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    if (loading) return <div className="p-10 text-white">Loading note...</div>;
    if (!note) return <div className="p-10 text-white">Note not found.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <button 
                onClick={() => navigate(-1)} 
                className="mb-6 text-blue-400 hover:underline"
            >
                ← Back to Dashboard
            </button>
            
            <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl border border-gray-700">
                <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
                <div className="text-gray-400 text-sm mb-6 pb-4 border-b border-gray-700">
                    Created on: {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                </p>
            </div>
        </div>
    );
};

export default NoteDetail;