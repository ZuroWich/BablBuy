document.getElementById('loginBtn').addEventListener('click', function() {
    const password = document.getElementById('password').value;
    const adminContainer = document.getElementById('adminContainer');
    const container = document.querySelector('.container');

    if (password === 'BablBuy2024!?AdminLOGIN') {
        localStorage.setItem('role', 'admin');
        adminContainer.style.display = 'block';
        container.style.display = 'none';
        initializeAdmin();
    } else if (password === 'user') {
        localStorage.setItem('role', 'user');
        adminContainer.style.display = 'block';
        container.style.display = 'none';
        initializeUser();
    } else {
        alert('Invalid password');
    }
});

let refId = 1;
let currentPage = 1;
const rowsPerPage = 10;

const refTableBody = document.getElementById('refTable').getElementsByTagName('tbody')[0];
const formContainer = document.getElementById('formContainer');
const formId = document.getElementById('formId');
const formDiscordId = document.getElementById('formDiscordId');
const formDiscount = document.getElementById('formDiscount');
const formDiscordLink = document.getElementById('formDiscordLink');
const formInvites = document.getElementById('formInvites');
const submitFormBtn = document.getElementById('submitFormBtn');
let currentAction = '';
let deleteId = null;

const refs = JSON.parse(localStorage.getItem('refs')) || [];

// Load data from local storage on page load
window.onload = function() {
    renderTable();
    refId = refs.length ? refs[refs.length - 1].id + 1 : 1;
};

// Function to initialize the admin interface
function initializeAdmin() {
    document.getElementById('addBtn').addEventListener('click', function() {
        currentAction = 'add';
        formId.style.display = 'none';
        formDiscordId.style.display = 'block';
        formDiscount.style.display = 'block';
        formDiscordLink.style.display = 'block';
        formInvites.style.display = 'none';
        clearForm();
        formContainer.style.display = 'flex';
    });

    document.getElementById('changeBtn').addEventListener('click', function() {
        currentAction = 'change';
        formId.style.display = 'block';
        formDiscordId.style.display = 'block';
        formDiscount.style.display = 'block';
        formDiscordLink.style.display = 'block';
        formInvites.style.display = 'block';
        clearForm();
        formContainer.style.display = 'flex';
    });

    document.getElementById('removeBtn').addEventListener('click', function() {
        currentAction = 'remove';
        formId.style.display = 'block';
        formDiscordId.style.display = 'none';
        formDiscount.style.display = 'none';
        formDiscordLink.style.display = 'none';
        formInvites.style.display = 'none';
        clearForm();
        formContainer.style.display = 'flex';
    });

    submitFormBtn.addEventListener('click', function() {
        const discordId = formDiscordId.value;
        const discount = formDiscount.value;
        const discordLink = formDiscordLink.value;
        const invites = formInvites.value;

        if (currentAction === 'add') {
            if (!discordId || !discount || !discordLink) {
                alert('Please fill in all fields.');
                return;
            }
            const initialInvites = 0; // Initial invites value
            const refCode = generateRefCode(discordId, discount);
            const newRef = { id: refId, discordId, discount, invites: initialInvites, code: refCode, discordLink };
            refs.push(newRef);
            saveRefs();
            refId++;
        } else if (currentAction === 'change') {
            const id = formId.value;
            if (!id) {
                alert('Please enter an ID.');
                return;
            }
            changeRef(id, discordId, discount, discordLink, invites);
        } else if (currentAction === 'remove') {
            const id = formId.value;
            if (!id) {
                alert('Please enter an ID.');
                return;
            }
            deleteId = id;
            deleteRef(deleteId);
        }

        formContainer.style.display = 'none';
        renderTable();
    });

    document.getElementById('prevPageBtn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', function() {
        if ((currentPage * rowsPerPage) < refs.length) {
            currentPage++;
            renderTable();
        }
    });

    renderTable();
}

// Function to initialize the user interface
function initializeUser() {
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('changeBtn').style.display = 'none';
    document.getElementById('removeBtn').style.display = 'none';

    document.getElementById('prevPageBtn').onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    }

    document.getElementById('nextPageBtn').onclick = function() {
        if ((currentPage * rowsPerPage) < refs.length) {
            currentPage++;
            renderTable();
        }
    }

    renderTable();
}

// Function to clear the form
function clearForm() {
    formId.value = '';
    formDiscordId.value = '';
    formDiscount.value = '';
    formDiscordLink.value = '';
    formInvites.value = '';
}

// Function to generate a referral code
function generateRefCode(discordId, discount) {
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `Babl${discordId}${discount}${randomString}`;
}

// Function to save referrals to local storage
function saveRefs() {
    localStorage.setItem('refs', JSON.stringify(refs));
}

// Function to change a referral
function changeRef(id, discordId, discount, discordLink, invites) {
    const refIndex = refs.findIndex(ref => ref.id == id);

    if (refIndex !== -1) {
        if (discordId) refs[refIndex].discordId = discordId;
        if (discount) refs[refIndex
        ].discount = discount;
        if (discordLink) refs[refIndex].discordLink = discordLink;
        if (invites) refs[refIndex].invites = invites;
        saveRefs();
    } else {
        alert('ID not found.');
    }
}

// Function to delete a referral
function deleteRef(id) {
    let idsToDelete = [];
    if (id.includes('-')) {
        let range = id.split('-').map(Number);
        for (let i = range[0]; i <= range[1]; i++) {
            idsToDelete.push(i);
        }
    } else {
        idsToDelete.push(Number(id));
    }

    for (let i = 0; i < idsToDelete.length; i++) {
        const refIndex = refs.findIndex(ref => ref.id == idsToDelete[i]);
        if (refIndex !== -1) {
            refs.splice(refIndex, 1);
        }
    }

    saveRefs();
    renderTable();
}

// Function to render the table
function renderTable() {
    refTableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageRefs = refs.slice(startIndex, endIndex);

    pageRefs.forEach(ref => {
        const newRow = refTableBody.insertRow();
        newRow.innerHTML = `
            <td>${ref.id}</td>
            <td>${ref.discordLink ? `<a href="${ref.discordLink}" target="_blank">${ref.discordId}</a>` : ref.discordId}</td>
            <td>${ref.discount}%</td>
            <td>${ref.invites}</td>
            <td>${ref.code}</td>
        `;
    });

    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = endIndex >= refs.length;
}

// Function to scroll to the first filled field after deleting multiple rows
function scrollToFilledField() {
    const inputs = document.querySelectorAll('input[type="text"], select');
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== '') {
            inputs[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
        }
    }
}
