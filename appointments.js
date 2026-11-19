// ========================================
// APPOINTMENT REQUEST SYSTEM
// Schurr High School Counseling Portal
// ========================================

// 1. GET HTML ELEMENTS
const modal = document.getElementById("appointmentModal");
const closeButton = document.getElementById("closeModal");
const counselorDisplay = document.getElementById("selectedCounselor");
const appointmentForm = document.getElementById("appointmentForm");
const formMessage = document.getElementById("formMessage");

// Keep track of the selected counselor
let selectedCounselor = "";

// Storage key for appointment requests
const STORAGE_KEY = "counselingAppointmentRequests";


// ========================================
// 2. OPEN APPOINTMENT POPUP
// ========================================

document.querySelectorAll(".book-button").forEach(button => {

    button.addEventListener("click", function () {

        selectedCounselor = this.dataset.counselor;

        counselorDisplay.textContent = selectedCounselor;

        // Clear any previous confirmation message
        formMessage.textContent = "";

        // Open popup
        modal.classList.add("active");

        // Prevent background scrolling
        document.body.style.overflow = "hidden";

    });

});


// ========================================
// 3. CLOSE APPOINTMENT POPUP
// ========================================

function closeAppointmentModal() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


// Close with X button
closeButton.addEventListener("click", closeAppointmentModal);


// Close by clicking outside popup
modal.addEventListener("click", function (event) {

    if (event.target === modal) {
        closeAppointmentModal();
    }

});


// Close with Escape key
document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        modal.classList.contains("active")
    ) {
        closeAppointmentModal();
    }

});


// ========================================
// 4. GET EXISTING REQUESTS
// ========================================

function getAppointmentRequests() {

    const savedRequests = localStorage.getItem(STORAGE_KEY);

    if (!savedRequests) {
        return [];
    }

    try {
        return JSON.parse(savedRequests);
    } catch (error) {
        console.error("Could not read appointment requests:", error);
        return [];
    }

}


// ========================================
// 5. SUBMIT APPOINTMENT REQUEST
// ========================================

appointmentForm.addEventListener("submit", function (event) {

    // Prevent page from refreshing
    event.preventDefault();

    // Collect form information
    const studentName = document.getElementById("studentName").value.trim();
    const studentID = document.getElementById("studentID").value.trim();
    const grade = document.getElementById("grade").value;
    const topic = document.getElementById("topic").value;
    const message = document.getElementById("reason").value.trim();

    // Make sure required fields are completed
    if (
        !studentName ||
        !studentID ||
        !grade ||
        !topic ||
        !selectedCounselor
    ) {

        formMessage.textContent =
            "Please complete all required fields.";

        return;

    }


    // Create appointment request
    const newRequest = {

        requestId: crypto.randomUUID(),

        studentName: studentName,
        studentID: studentID,
        grade: grade,

        counselor: selectedCounselor,

        topic: topic,
        message: message,

        submittedAt: new Date().toISOString(),

        status: "Pending"

    };


    // Get previous requests
    const requests = getAppointmentRequests();


    // Add the new request
    requests.push(newRequest);


    // Save requests to browser storage
    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(requests)
        );

    } catch (error) {

        console.error("Could not save request:", error);

        formMessage.textContent =
            "We couldn't save your request. Please try again.";

        return;

    }


    // ========================================
    // 6. SHOW CONFIRMATION
    // ========================================

    formMessage.textContent =
        "Your appointment request has been submitted successfully! Your counselor will review it.";

    formMessage.style.color = "#07551e";


    // Clear the form
    appointmentForm.reset();


    // Close popup after a short delay
    setTimeout(function () {

        closeAppointmentModal();

        formMessage.textContent = "";

    }, 3000);

});