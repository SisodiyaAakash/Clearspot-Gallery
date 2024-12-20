import React, { useState, useEffect } from "react";
import { auth, storage, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const user = auth.currentUser;
    const navigate = useNavigate();

    const userInitials = user?.displayName
        ? user.displayName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        : "NN";

    useEffect(() => {
        if (user) fetchUserImages();
    }, [user]);

    const fetchUserImages = async () => {
        if (!user) return;
        const q = query(collection(db, "images"), where("userID", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedImages = querySnapshot.docs.map((doc) => doc.data().url);
        setImages(fetchedImages);
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !user) return;

        setUploading(true);

        for (const file of files) {
            try {
                const storageRef = ref(storage, `${user.uid}/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => console.error("Upload error:", error),
                    async () => {
                        const downloadURL = await getDownloadURL(storageRef);
                        await addDoc(collection(db, "images"), {
                            userID: user.uid,
                            url: downloadURL,
                            createdAt: new Date(),
                        });
                        fetchUserImages();
                    }
                );
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }

        setUploading(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-teal-600">ClearSpot</div>

                <h1 className="text-lg font-semibold text-gray-700 hidden md:block">
                    Gallery
                </h1>

                <div className="relative">
                    <div
                        className="bg-teal-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer"
                        title={user?.displayName || "User"}
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        {userInitials}
                    </div>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg overflow-hidden w-40">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Your Gallery</h2>
                        <label className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition">
                            Upload Images
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {uploading && <p className="text-blue-500">Uploading files...</p>}

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((url, index) => (
                            <div
                                key={index}
                                className="relative group rounded-lg overflow-hidden shadow-lg"
                            >
                                <img
                                    src={url}
                                    alt={`Uploaded ${index}`}
                                    className="w-full h-40 object-cover transition-transform transform group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Gallery;
