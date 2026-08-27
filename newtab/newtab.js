// ==========================================
// RED//CORE - MAIN JAVASCRIPT
// ==========================================


// ---------- CLOCK ----------

function updateClock() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");

    const minutes = String(now.getMinutes()).padStart(2, "0");

    const seconds = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${hours}:${minutes}:${seconds}`;
}


// ---------- DATE ----------

function updateDate() {

    const now = new Date();

    const options = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    const formattedDate =
        new Intl.DateTimeFormat("en-GB", options)
            .format(now)
            .toUpperCase();

    document.getElementById("date").textContent =
        formattedDate.replaceAll(",", " //");
}


// ---------- INITIALIZE ----------

updateClock();
updateDate();


// ---------- UPDATE EVERY SECOND ----------

setInterval(updateClock, 1000);

// ==========================================
// GOOGLE SEARCH
// ==========================================

const searchForm = document.getElementById("search-form");

const searchInput = document.getElementById("search-input");


searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    const googleURL =
        "https://www.google.com/search?q=" +
        encodeURIComponent(query);

    window.location.href = googleURL;

});

// ==========================================
// WEATHER SYSTEM
// ==========================================


// Weather code → icon + description
function getWeatherInfo(code) {

    const weather = {

        0: {
            icon: "☀",
            description: "CLEAR SKY"
        },

        1: {
            icon: "🌤",
            description: "MAINLY CLEAR"
        },

        2: {
            icon: "⛅",
            description: "PARTLY CLOUDY"
        },

        3: {
            icon: "☁",
            description: "OVERCAST"
        },

        45: {
            icon: "🌫",
            description: "FOG"
        },

        48: {
            icon: "🌫",
            description: "RIME FOG"
        },

        51: {
            icon: "🌦",
            description: "LIGHT DRIZZLE"
        },

        53: {
            icon: "🌦",
            description: "DRIZZLE"
        },

        55: {
            icon: "🌧",
            description: "HEAVY DRIZZLE"
        },

        61: {
            icon: "🌧",
            description: "LIGHT RAIN"
        },

        63: {
            icon: "🌧",
            description: "RAIN"
        },

        65: {
            icon: "🌧",
            description: "HEAVY RAIN"
        },

        71: {
            icon: "❄",
            description: "LIGHT SNOW"
        },

        73: {
            icon: "❄",
            description: "SNOW"
        },

        75: {
            icon: "❄",
            description: "HEAVY SNOW"
        },

        80: {
            icon: "🌦",
            description: "RAIN SHOWERS"
        },

        81: {
            icon: "🌦",
            description: "RAIN SHOWERS"
        },

        82: {
            icon: "🌧",
            description: "HEAVY SHOWERS"
        },

        95: {
            icon: "⛈",
            description: "THUNDERSTORM"
        },

        96: {
            icon: "⛈",
            description: "THUNDERSTORM + HAIL"
        },

        99: {
            icon: "⛈",
            description: "SEVERE STORM"
        }

    };


    return weather[code] || {
        icon: "☁",
        description: "UNKNOWN"
    };
}


// ==========================================
// GET WEATHER
// ==========================================

async function getWeather(latitude, longitude) {

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&timezone=auto`;


        const response = await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Weather request failed: ${response.status}`
            );

        }


        const data = await response.json();


        updateWeatherUI(data);


    } catch (error) {

    console.error(
        "[RED//CORE] Weather error:",
        error
    );

    document.getElementById(
        "weather-status"
    ).textContent = "WEATHER ERROR";

    document.getElementById(
        "location"
    ).textContent =
        "LOCATION // API CONNECTION FAILED";

}
    }



// ==========================================
// UPDATE UI
// ==========================================

function updateWeatherUI(data) {

    const current = data.current;


    const temperature =
        Math.round(current.temperature_2m);


    const humidity =
        current.relative_humidity_2m;


    const wind =
        Math.round(current.wind_speed_10m);


    const weatherInfo =
        getWeatherInfo(current.weather_code);


    document.getElementById(
        "temperature"
    ).textContent =
        `${temperature}°C`;


    document.getElementById(
        "weather-status"
    ).textContent =
        weatherInfo.description;


    document.getElementById(
        "weather-icon"
    ).textContent =
        weatherInfo.icon;


    document.getElementById(
        "humidity"
    ).textContent =
        `${humidity}%`;


    document.getElementById(
        "wind"
    ).textContent =
        `${wind} km/h`;

}


// ==========================================
// LOCATION
// ==========================================

function requestWeatherLocation() {

    const locationElement =
        document.getElementById("location");


    if (!navigator.geolocation) {

        locationElement.textContent =
            "LOCATION // NOT SUPPORTED";

        return;

    }


    locationElement.textContent =
        "LOCATION // REQUESTING ACCESS...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            locationElement.textContent =
                `COORDINATES // ${latitude.toFixed(2)}° / ${longitude.toFixed(2)}°`;


            getWeather(
                latitude,
                longitude
            );

        },


error => {

    console.error(
        "[RED//CORE] Location error:",
        error
    );


    let message =
        "LOCATION // UNKNOWN";


    switch (error.code) {

        case error.PERMISSION_DENIED:

            message =
                "LOCATION // ACCESS DENIED";

            break;


        case error.POSITION_UNAVAILABLE:

            message =
                "LOCATION // UNAVAILABLE";

            break;


        case error.TIMEOUT:

            message =
                "LOCATION // TIMEOUT";

            break;

    }


    locationElement.textContent =
        message;


    document.getElementById(
        "weather-status"
    ).textContent =
        "LOCATION REQUIRED";

}

    );

}


// ==========================================
// START WEATHER
// ==========================================

requestWeatherLocation();

// ==========================================
// RED//CORE NOTES SYSTEM
// ==========================================

let editingNoteId = null;


// ==========================================
// ELEMENTS
// ==========================================

const noteModal = document.getElementById("note-modal");
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const notesContent = document.getElementById("notes-content");

const newNoteButton =
    document.getElementById("new-note-button");

const closeNoteModal =
    document.getElementById("close-note-modal");

const cancelNote =
    document.getElementById("cancel-note");

const saveNoteButton =
    document.getElementById("save-note");


// ==========================================
// CHECK ELEMENTS
// ==========================================

console.log("RED//CORE Notes System");

console.log("Note modal:", noteModal);
console.log("New note button:", newNoteButton);
console.log("Save button:", saveNoteButton);


// ==========================================
// OPEN MODAL
// ==========================================

function openNoteModal(note = null) {

    if (!noteModal) {
        console.error("Note modal not found.");
        return;
    }


    noteModal.classList.add("active");


    if (note) {

        // Editing existing note

        editingNoteId = note.id;

        noteTitle.value = note.title || "";

        noteBody.value = note.body || "";

    } else {

        // Creating new note

        editingNoteId = null;

        noteTitle.value = "";

        noteBody.value = "";

    }


    setTimeout(() => {
        noteTitle.focus();
    }, 100);

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeNoteEditor() {

    noteModal.classList.remove("active");

    editingNoteId = null;

    noteTitle.value = "";

    noteBody.value = "";

}


// ==========================================
// GET NOTES
// ==========================================

async function getNotes() {

    try {

        const result =
            await chrome.storage.local.get("redcore_notes");

        return result.redcore_notes || [];

    } catch (error) {

        console.error(
            "Could not read notes:",
            error
        );

        return [];

    }

}


// ==========================================
// STORE NOTES
// ==========================================

async function storeNotes(notes) {

    try {

        await chrome.storage.local.set({
            redcore_notes: notes
        });

        console.log(
            "Notes saved successfully:",
            notes
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save notes:",
            error
        );

        return false;

    }

}


// ==========================================
// SAVE CURRENT NOTE
// ==========================================

async function saveCurrentNote() {

    console.log("SAVE NOTE clicked");


    const title =
        noteTitle.value.trim();

    const body =
        noteBody.value.trim();


    // Don't save completely empty notes

    if (!title && !body) {

        alert("Please enter a title or note.");

        return;

    }


    const notes =
        await getNotes();


    // ======================================
    // EDIT EXISTING NOTE
    // ======================================

    if (editingNoteId !== null) {

        const note =
            notes.find(
                item =>
                    item.id === editingNoteId
            );


        if (note) {

            note.title =
                title || "UNTITLED";

            note.body =
                body;

            note.updatedAt =
                Date.now();

        }

    }


    // ======================================
    // CREATE NEW NOTE
    // ======================================

    else {

        const newNote = {

            id:
                Date.now().toString(),

            title:
                title || "UNTITLED",

            body:
                body,

            createdAt:
                Date.now(),

            updatedAt:
                Date.now()

        };


        notes.unshift(newNote);

    }


    // ======================================
    // SAVE TO CHROME STORAGE
    // ======================================

    const saved =
        await storeNotes(notes);


    if (!saved) {

        alert(
            "Could not save note. Check Chrome permissions."
        );

        return;

    }


    // ======================================
    // UPDATE UI
    // ======================================

    closeNoteEditor();

    renderNotes();

}


// ==========================================
// DELETE NOTE
// ==========================================

async function deleteNote(id) {

    const confirmed =
        confirm("DELETE THIS NOTE?");


    if (!confirmed) {
        return;
    }


    const notes =
        await getNotes();


    const filteredNotes =
        notes.filter(
            note =>
                note.id !== id
        );


    await storeNotes(filteredNotes);


    renderNotes();

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatNoteTime(timestamp) {

    const date =
        new Date(timestamp);


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// RENDER NOTES
// ==========================================

async function renderNotes() {

    if (!notesContent) {

        console.error(
            "notes-content element not found."
        );

        return;

    }


    const notes =
        await getNotes();


    notesContent.innerHTML = "";


    // ======================================
    // NO NOTES
    // ======================================

    if (notes.length === 0) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-state";


        empty.innerHTML = `

            <div class="empty-icon">
                +
            </div>

            <p>
                NO NOTES FOUND
            </p>

            <span>
                Create your first note
            </span>

        `;


        notesContent.appendChild(empty);

        return;

    }


    // ======================================
    // DISPLAY NOTES
    // ======================================

    notes.forEach(note => {

        const noteElement =
            document.createElement("div");


        noteElement.className =
            "note-item";


        const title =
            document.createElement("div");

        title.className =
            "note-item-title";

        title.textContent =
            note.title;


        const preview =
            document.createElement("div");

        preview.className =
            "note-item-preview";

        preview.textContent =
            note.body;


        const time =
            document.createElement("div");

        time.className =
            "note-item-time";

        time.textContent =
            `UPDATED // ${formatNoteTime(note.updatedAt)}`;


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-note";

        deleteButton.textContent =
            "×";

        deleteButton.title =
            "Delete note";


        // ==================================
        // EDIT NOTE
        // ==================================

        noteElement.addEventListener(
            "click",
            () => {

                openNoteModal(note);

            }
        );


        // ==================================
        // DELETE NOTE
        // ==================================

        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteNote(note.id);

            }
        );


        noteElement.appendChild(title);

        noteElement.appendChild(preview);

        noteElement.appendChild(time);

        noteElement.appendChild(deleteButton);


        notesContent.appendChild(
            noteElement
        );

    });

}


// ==========================================
// BUTTON EVENTS
// ==========================================

newNoteButton.addEventListener(
    "click",
    () => {

        console.log("NEW NOTE clicked");

        openNoteModal();

    }
);


saveNoteButton.addEventListener(
    "click",
    () => {

        console.log("SAVE button clicked");

        saveCurrentNote();

    }
);


closeNoteModal.addEventListener(
    "click",
    closeNoteEditor
);


cancelNote.addEventListener(
    "click",
    closeNoteEditor
);


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            noteModal.classList.contains("active")
        ) {

            closeNoteEditor();

        }

    }
);


// ==========================================
// INITIALIZE NOTES
// ==========================================

renderNotes();

