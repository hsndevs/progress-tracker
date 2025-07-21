// Import Firebase modules
import { initializeApp } from 'firebase/app';
import {
	get,
	getDatabase,
	push,
	ref,
	remove,
	set
} from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCOm7TfHNcR86StySj6ndHHJdC3C0WcNaE",
	authDomain: "progress-tracker-4807a.firebaseapp.com",
	databaseURL: "https://progress-tracker-4807a-default-rtdb.firebaseio.com",
	projectId: "progress-tracker-4807a",
	storageBucket: "progress-tracker-4807a.firebasestorage.app",
	messagingSenderId: "413510205582",
	appId: "1:413510205582:web:5170b355b35cba4d8309df",
	measurementId: "G-LG5ENCB3WN"
};

// Initialize Firebase
let app, database;

// Check if Firebase config is properly set
if (firebaseConfig.apiKey === "your-api-key-here") {
	console.warn("⚠️ Firebase configuration not set. Running in mock mode with localStorage.");
	window.mockMode = true;
} else {
	try {
		app = initializeApp(firebaseConfig);
		database = getDatabase(app);
		console.log("✅ Firebase Realtime Database initialized successfully!");
		window.mockMode = false;
	} catch (error) {
		console.error("❌ Error initializing Firebase:", error);
		console.warn("🔄 Falling back to mock mode with localStorage");
		window.mockMode = true;
	}
}

// Global variables
let progressTable;
let allData = [];

// Utility function to clean up modal backdrops
function cleanupModalBackdrops() {
	const backdrops = document.querySelectorAll('.modal-backdrop');
	backdrops.forEach(backdrop => backdrop.remove());
	document.body.classList.remove('modal-open');
	document.body.style.removeProperty('overflow');
	document.body.style.removeProperty('padding-right');
}

// Document ready
document.addEventListener('DOMContentLoaded', function () {
	initializeApplication();
});

function initializeApplication() {
	const currentPage = window.location.pathname.split('/').pop();

	if (currentPage === 'index.html' || currentPage === '') {
		initializeInputForm();
	} else if (currentPage === 'report.html') {
		initializeReportPage();
	}
}

// Input Form Functions
function initializeInputForm() {
	const form = document.getElementById('progressForm');

	// Form submission
	form.addEventListener('submit', async function (e) {
		e.preventDefault();
		await saveProgressEntry();
	});

	// Set default start date to today
	document.getElementById('startDate').value = new Date().toISOString().split('T')[0];

	// Add event listener to success modal for backdrop cleanup
	const successModal = document.getElementById('successModal');
	if (successModal) {
		successModal.addEventListener('hidden.bs.modal', cleanupModalBackdrops);
	}
}

// Function to check for duplicates based on phone or email
async function checkForDuplicates(phone, email) {
	try {
		if (window.mockMode) {
			const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
			return storedData.some(entry => entry.phone === phone || entry.email === email);
		} else {
			try {
				const progressRef = ref(database, 'progress_entries');
				const snapshot = await get(progressRef);

				if (snapshot.exists()) {
					const data = snapshot.val();
					return Object.values(data).some(entry => entry.phone === phone || entry.email === email);
				}
				return false;
			} catch (firebaseError) {
				console.error('❌ Firebase error during duplicate check, falling back to localStorage:', firebaseError);
				window.mockMode = true;
				const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
				return storedData.some(entry => entry.phone === phone || entry.email === email);
			}
		}
	} catch (error) {
		console.error('Error checking for duplicates:', error);
		return false;
	}
}

// Function to check for duplicates during editing (excludes current entry)
async function checkForDuplicateEdit(phone, email, currentId) {
	try {
		if (window.mockMode) {
			const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
			return storedData.some(entry =>
				entry.id !== currentId && (entry.phone === phone || entry.email === email)
			);
		} else {
			try {
				const progressRef = ref(database, 'progress_entries');
				const snapshot = await get(progressRef);

				if (snapshot.exists()) {
					const data = snapshot.val();
					return Object.entries(data).some(([id, entry]) =>
						id !== currentId && (entry.phone === phone || entry.email === email)
					);
				}
				return false;
			} catch (firebaseError) {
				console.error('❌ Firebase error during duplicate check, falling back to localStorage:', firebaseError);
				window.mockMode = true;
				const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
				return storedData.some(entry =>
					entry.id !== currentId && (entry.phone === phone || entry.email === email)
				);
			}
		}
	} catch (error) {
		console.error('Error checking for duplicates during edit:', error);
		return false;
	}
}

async function saveProgressEntry() {
	const loadingSpinner = document.getElementById('loadingSpinner');
	loadingSpinner.classList.remove('d-none');

	try {
		const formData = {
			assignee: document.getElementById('assignee').value,
			phone: document.getElementById('phone').value,
			email: document.getElementById('email').value,
			startDate: document.getElementById('startDate').value,
			dueDate: document.getElementById('dueDate').value,
			// Islamic Activities
			quranStudy: document.getElementById('quranStudy').value,
			hadithStudy: document.getElementById('hadithStudy').value,
			islamicLiterature: document.getElementById('islamicLiterature').value,
			congregationalPrayer: document.getElementById('congregationalPrayer').value,
			dawahTarget: document.getElementById('dawahTarget').value,
			workerTarget: document.getElementById('workerTarget').value,
			rukonTarget: document.getElementById('rukonTarget').value,
			workerContact: document.getElementById('workerContact').value,
			bookDistribution: document.getElementById('bookDistribution').value,
			familyMeeting: document.getElementById('familyMeeting').value,
			timeDonation: document.getElementById('timeDonation').value,
			reportKeeping: document.getElementById('reportKeeping').value,
			selfCriticism: document.getElementById('selfCriticism').value,
			donationDate: document.getElementById('donationDate').value,
			socialWork: document.getElementById('socialWork').value,
			description: document.getElementById('description').value,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		// Check for duplicates based on phone or email
		const isDuplicate = await checkForDuplicates(formData.phone, formData.email);
		if (isDuplicate) {
			alert('⚠️ একই ফোন নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি এন্ট্রি রয়েছে!\n(An entry with this phone number or email already exists!)');
			return;
		}

		if (window.mockMode) {
			// Mock mode - store in localStorage
			const existingData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
			formData.id = Date.now().toString();
			existingData.push(formData);
			localStorage.setItem('progressEntries', JSON.stringify(existingData));
			console.log('📝 Data saved to localStorage (Mock mode)');
		} else {
			try {
				// Firebase Realtime Database mode
				const progressRef = ref(database, 'progress_entries');
				const newEntryRef = push(progressRef);
				await set(newEntryRef, formData);
				console.log('📝 Data saved to Firebase Realtime Database');
			} catch (firebaseError) {
				console.error('❌ Firebase error, falling back to localStorage:', firebaseError);
				window.mockMode = true;
				const existingData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
				formData.id = Date.now().toString();
				existingData.push(formData);
				localStorage.setItem('progressEntries', JSON.stringify(existingData));
				console.log('📝 Data saved to localStorage (Fallback mode)');
			}
		}

		// Show success modal
		let successModal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
		if (!successModal) {
			successModal = new bootstrap.Modal(document.getElementById('successModal'));
		}

		const modeIndicator = document.getElementById('modeIndicator');
		if (modeIndicator) {
			if (window.mockMode) {
				modeIndicator.textContent = '💾 Data saved locally (localStorage mode)';
				modeIndicator.className = 'mt-2 small text-info';
			} else {
				modeIndicator.textContent = '☁️ Data saved to Firebase cloud database';
				modeIndicator.className = 'mt-2 small text-success';
			}
		}

		successModal.show();

		// Auto-hide modal after 3 seconds
		setTimeout(() => {
			successModal.hide();
			setTimeout(cleanupModalBackdrops, 300);
		}, 3000);

		// Reset form
		document.getElementById('progressForm').reset();
		document.getElementById('startDate').value = new Date().toISOString().split('T')[0];

	} catch (error) {
		console.error('Error saving progress entry:', error);
		alert('Error saving progress entry. Please try again.');
	} finally {
		loadingSpinner.classList.add('d-none');
	}
}

// Report Page Functions
function initializeReportPage() {
	initializeDataTable();
	loadProgressData();

	// Refresh button
	document.getElementById('refreshData').addEventListener('click', function () {
		loadProgressData();
	});

	// Edit modal events
	document.getElementById('saveEdit').addEventListener('click', saveEditedEntry);

	// Add event listener to edit modal for backdrop cleanup
	const editModal = document.getElementById('editModal');
	if (editModal) {
		editModal.addEventListener('hidden.bs.modal', cleanupModalBackdrops);
	}
}

function initializeDataTable() {
	// Check if DataTable is already initialized
	if ($.fn.DataTable.isDataTable('#progressTable')) {
		$('#progressTable').DataTable().destroy();
		$('#progressTable tbody').empty();
	}

	progressTable = $('#progressTable').DataTable({
		responsive: true,
		pageLength: 25,
		order: [[8, 'desc']], // Order by start date descending (shifted from 6 to 8)
		columnDefs: [
			{ targets: [12], orderable: false }, // Actions column (shifted from 10 to 12)
			{ targets: [11], visible: false } // Description column hidden by default (shifted from 9 to 11)
		],
		language: {
			search: "Search entries:",
			lengthMenu: "Show _MENU_ entries per page",
			info: "Showing _START_ to _END_ of _TOTAL_ entries",
			paginate: {
				first: "First",
				last: "Last",
				next: "Next",
				previous: "Previous"
			}
		}
	});
}

async function loadProgressData() {
	const loadingSpinner = document.getElementById('loadingSpinner');
	loadingSpinner.classList.remove('d-none');

	try {
		if (window.mockMode) {
			const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
			allData = storedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			console.log('📊 Data loaded from localStorage (Mock mode):', allData.length, 'entries');
		} else {
			try {
				const progressRef = ref(database, 'progress_entries');
				const snapshot = await get(progressRef);

				allData = [];
				if (snapshot.exists()) {
					const data = snapshot.val();
					Object.keys(data).forEach(key => {
						allData.push({ id: key, ...data[key] });
					});
					allData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				}
				console.log('📊 Data loaded from Firebase Realtime Database:', allData.length, 'entries');
			} catch (firebaseError) {
				console.error('❌ Firebase error, falling back to localStorage:', firebaseError);
				window.mockMode = true;
				const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
				allData = storedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				console.log('📊 Data loaded from localStorage (Fallback mode):', allData.length, 'entries');
			}
		}

		populateDataTable();
		updateStatistics();

	} catch (error) {
		console.error('Error loading data:', error);
		alert('Error loading data. Please try again.');
	} finally {
		loadingSpinner.classList.add('d-none');
	}
}

function populateDataTable() {
	// Check if progressTable exists and is initialized
	if (!progressTable || !$.fn.DataTable.isDataTable('#progressTable')) {
		console.warn('DataTable not initialized, reinitializing...');
		initializeDataTable();
	}

	progressTable.clear();

	allData.forEach(entry => {
		const daysRemaining = calculateDaysRemaining(entry.dueDate);
		const rowData = [
			entry.assignee || 'N/A',
			entry.phone || 'N/A',
			entry.email || 'N/A',
			entry.quranStudy || '-',
			entry.hadithStudy || '-',
			entry.islamicLiterature || '-',
			entry.congregationalPrayer || '-',
			entry.dawahTarget || '-',
			formatDate(entry.startDate),
			formatDate(entry.dueDate),
			daysRemaining,
			entry.description || '',
			createActionButtons(entry.id)
		];

		progressTable.row.add(rowData);
	});

	progressTable.draw();
}

function createActionButtons(id) {
	return `
        <button class="btn action-btn btn-edit" onclick="editEntry('${id}')" title="Edit">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn action-btn btn-delete" onclick="deleteEntry('${id}')" title="Delete">
            <i class="fas fa-trash"></i>
        </button>
    `;
}

function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString();
}

function calculateDaysRemaining(dueDate) {
	const today = new Date();
	const due = new Date(dueDate);
	const timeDiff = due.getTime() - today.getTime();
	const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (daysDiff < 0) {
		return `<span class="text-danger">Overdue by ${Math.abs(daysDiff)} days</span>`;
	} else if (daysDiff === 0) {
		return `<span class="text-warning">Due Today</span>`;
	} else if (daysDiff <= 3) {
		return `<span class="text-warning">${daysDiff} days</span>`;
	} else {
		return `<span class="text-success">${daysDiff} days</span>`;
	}
}

function updateStatistics() {
	const totalTasks = allData.length;
	const quranStudyCount = allData.filter(entry => entry.quranStudy && entry.quranStudy.trim() !== '').length;
	const prayerCount = allData.filter(entry => entry.congregationalPrayer && entry.congregationalPrayer.trim() !== '').length;

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
	const thisWeekEntries = allData.filter(entry => {
		const entryDate = new Date(entry.createdAt);
		return entryDate >= oneWeekAgo;
	}).length;

	document.getElementById('totalTasks').textContent = totalTasks;
	document.getElementById('completedTasks').textContent = quranStudyCount;
	document.getElementById('inProgressTasks').textContent = prayerCount;
	document.getElementById('overdueTasks').textContent = thisWeekEntries;
}

// Global functions for button actions
window.editEntry = function (id) {
	const entry = allData.find(item => item.id === id);
	if (!entry) return;

	// Populate edit form
	document.getElementById('editId').value = id;
	document.getElementById('editAssignee').value = entry.assignee || '';
	document.getElementById('editPhone').value = entry.phone || '';
	document.getElementById('editEmail').value = entry.email || '';
	document.getElementById('editStartDate').value = entry.startDate || '';
	document.getElementById('editDueDate').value = entry.dueDate || '';
	document.getElementById('editDescription').value = entry.description || '';

	// Show modal
	let editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
	if (!editModal) {
		editModal = new bootstrap.Modal(document.getElementById('editModal'));
	}
	editModal.show();
};

async function saveEditedEntry() {
	const loadingSpinner = document.getElementById('loadingSpinner');
	loadingSpinner.classList.remove('d-none');

	try {
		const id = document.getElementById('editId').value;
		const newPhone = document.getElementById('editPhone').value;
		const newEmail = document.getElementById('editEmail').value;

		// Get current entry to compare phone/email
		const currentEntry = allData.find(item => item.id === id);

		// Check for duplicates only if phone or email has changed
		if (currentEntry && (currentEntry.phone !== newPhone || currentEntry.email !== newEmail)) {
			const isDuplicate = await checkForDuplicateEdit(newPhone, newEmail, id);
			if (isDuplicate) {
				alert('⚠️ একই ফোন নম্বর বা ইমেইল দিয়ে ইতিমধ্যে অন্য একটি এন্ট্রি রয়েছে!\n(Another entry with this phone number or email already exists!)');
				loadingSpinner.classList.add('d-none');
				return;
			}
		}

		const updatedData = {
			assignee: document.getElementById('editAssignee').value,
			phone: newPhone,
			email: newEmail,
			startDate: document.getElementById('editStartDate').value,
			dueDate: document.getElementById('editDueDate').value,
			description: document.getElementById('editDescription').value,
			updatedAt: new Date().toISOString()
		};

		if (window.mockMode) {
			const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
			const index = storedData.findIndex(item => item.id === id);
			if (index !== -1) {
				storedData[index] = { ...storedData[index], ...updatedData };
				localStorage.setItem('progressEntries', JSON.stringify(storedData));
			}
		} else {
			try {
				const entryRef = ref(database, `progress_entries/${id}`);
				await set(entryRef, { ...allData.find(item => item.id === id), ...updatedData });
				console.log('✏️ Entry updated in Firebase Realtime Database');
			} catch (firebaseError) {
				console.error('❌ Firebase error, falling back to localStorage:', firebaseError);
				window.mockMode = true;
				const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
				const index = storedData.findIndex(item => item.id === id);
				if (index !== -1) {
					storedData[index] = { ...storedData[index], ...updatedData };
					localStorage.setItem('progressEntries', JSON.stringify(storedData));
				}
				console.log('✏️ Entry updated in localStorage (Fallback mode)');
			}
		}

		// Hide modal
		const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
		if (editModal) {
			editModal.hide();
			setTimeout(cleanupModalBackdrops, 300);
		}

		// Reload data
		await loadProgressData();

	} catch (error) {
		console.error('Error updating entry:', error);
		alert('Error updating entry. Please try again.');
	} finally {
		loadingSpinner.classList.add('d-none');
	}
}

window.deleteEntry = async function (id) {
	if (!confirm('Are you sure you want to delete this entry?')) {
		return;
	}

	const loadingSpinner = document.getElementById('loadingSpinner');
	loadingSpinner.classList.remove('d-none');

	try {
		if (window.mockMode) {
			const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
			const filteredData = storedData.filter(item => item.id !== id);
			localStorage.setItem('progressEntries', JSON.stringify(filteredData));
			console.log('🗑️ Entry deleted from localStorage');
		} else {
			try {
				const entryRef = ref(database, `progress_entries/${id}`);
				await remove(entryRef);
				console.log('🗑️ Entry deleted from Firebase Realtime Database');
			} catch (firebaseError) {
				console.error('❌ Firebase error, falling back to localStorage:', firebaseError);
				window.mockMode = true;
				const storedData = JSON.parse(localStorage.getItem('progressEntries') || '[]');
				const filteredData = storedData.filter(item => item.id !== id);
				localStorage.setItem('progressEntries', JSON.stringify(filteredData));
				console.log('🗑️ Entry deleted from localStorage (Fallback mode)');
			}
		}
		await loadProgressData();
	} catch (error) {
		console.error('Error deleting entry:', error);
		alert('Error deleting entry. Please try again.');
	} finally {
		loadingSpinner.classList.add('d-none');
	}
};
