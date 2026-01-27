const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

const TMDB_API_KEY = "64177e0896fa33c7f99478d380721759"; // Using the key found in your source code
const FIRESTORE_COLLECTION = "system";
const FIRESTORE_DOC = "notifications";

/**
 * Scheduled Function: Checks for new trailers every 24 hours.
 * Note: For testing, you can trigger this manually via HTTP or the Firebase Console.
 */
exports.checkNewTrailers = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
    try {
        console.log("Checking for new trailers...");

        // 1. Fetch Upcoming Movies from TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        const movies = response.data.results;

        if (!movies || movies.length === 0) {
            console.log("No upcoming movies found.");
            return null;
        }

        // 2. Get the last notified movie ID from Firestore to avoid duplicates
        const db = admin.firestore();
        const docRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC);
        const docSnap = await docRef.get();
        let lastNotifiedId = null;

        if (docSnap.exists) {
            lastNotifiedId = docSnap.data().lastNotifiedId;
        }

        // 3. Find the first "new" movie (simplified logic: just pick the top one if different)
        // In a real app, you might iterate and send multiple, but we'll send 1 per day for "Daily Pick"
        const topMovie = movies[0];

        if (topMovie.id === lastNotifiedId) {
            console.log("Already notified for this movie:", topMovie.title);
            return null;
        }

        // 4. Determine Topic (Hollywood/Bollywood)
        // TMDB uses 'original_language'
        let topic = "hollywood_trailers"; // default
        if (topMovie.original_language === "hi") {
            topic = "bollywood_trailers";
        } else if (topMovie.original_language === "ja") {
            topic = "anime_trailers";
        }
        // Add logic for other languages if needed

        // 5. Construct Payload
        const message = {
            notification: {
                title: `New Trailer: ${topMovie.title} 🎬`,
                body: ` The upcoming movie "${topMovie.title}" has a new update! Check it out.`,
                image: `https://image.tmdb.org/t/p/w500${topMovie.poster_path}`
            },
            topic: topic
        };

        // 6. Send to FCM
        await admin.messaging().send(message);
        console.log(`Successfully sent message to topic: ${topic}`, message);

        // Also send to 'all_trailers' for general users
        const generalMessage = { ...message, topic: "all_trailers" };
        await admin.messaging().send(generalMessage);

        // 7. Update State
        await docRef.set({
            lastNotifiedId: topMovie.id,
            lastNotifiedTitle: topMovie.title,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return null;
    } catch (error) {
        console.error("Error checking trailers:", error);
        return null;
    }
});
