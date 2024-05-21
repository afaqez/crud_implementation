window.onload = function () {
  importUsers();
};

dom = document;
form = dom.getElementById("addUserForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  addUser();
});
userCount = 10;

function addUser() {
  const name = dom.getElementById("name").value;
  const email = dom.getElementById("email").value;
  const phone = dom.getElementById("phone").value;
  const city = dom.getElementById("city").value;
  const id = generateID();
  let users = JSON.parse(localStorage.getItem("users")) || [];

  address = {};
  const newUser = {
    id: id,
    name: name,
    email: email,
    phone: phone,
    address: { city },
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  $("#addUserModal").modal("hide");
  displayUsers();
  form.reset();
  console.log("Success");
}

function importUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.length > 0) {
    displayUsers();
    return;
  }

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => {
      users.push(...data);
      localStorage.setItem("users", JSON.stringify(users));
      displayUsers();
    });
}

function displayUsers(filteredUsers = null) {
  const userTable = dom.getElementById("userTable");
  userTable.innerHTML = "";

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach((user) => {
    const row = dom.createElement("tr");
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.address.city}</td>
        <button onclick="viewUser(${user.id})" class="btn btn-link btn-sm">View</button>
        <button onclick="editUser(${user.id})" class="btn btn-link btn-sm">Edit</button>
        <button onclick="deleteUser(${user.id})" class="btn btn-link btn-sm">Delete</button>`;
    userTable.appendChild(row);
  });
}

let viewUserModal = dom.getElementById("viewUserModal");

function viewUser(userId) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.id === userId);

  viewUserModal.querySelector("#viewName").value = user.name;
  viewUserModal.querySelector("#viewEmail").value = user.email;
  viewUserModal.querySelector("#viewPhone").value = user.phone;
  viewUserModal.querySelector("#viewCity").value = user.address.city;

  $("#viewUserModal").modal("show");
}

let editUserModal = dom.getElementById("editUserModal");

function editUser(userId) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.id === userId);

  editUserModal.querySelector("#editName").value = user.name;
  editUserModal.querySelector("#editEmail").value = user.email;
  editUserModal.querySelector("#editPhone").value = user.phone;
  editUserModal.querySelector("#editCity").value = user.address.city;

  $("#editUserModal").modal("show");

  let saveButton = dom.getElementById("saveChanges");
  saveButton.removeEventListener("click", saveChanges);

  saveButton.addEventListener("click", function saveChanges() {
    user.name = editUserModal.querySelector("#editName").value;
    user.email = editUserModal.querySelector("#editEmail").value;
    user.phone = editUserModal.querySelector("#editPhone").value;
    user.address.city = editUserModal.querySelector("#editCity").value;

    localStorage.setItem("users", JSON.stringify(users));

    displayUsers();

    $("#editUserModal").modal("hide");
  });
}

function deleteUser(userId) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((u) => u.id !== userId);

  localStorage.setItem("users", JSON.stringify(users));

  displayUsers();

  console.log(`User with ID ${userId} has been deleted`);
}

function searchUsers() {
  const searchValue = dom.getElementById("search").value.toLowerCase();
  console.log("Search Value: ", searchValue);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  console.log("All Users: ", users);
  let filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue)
  );
  console.log("Filtered Users: ", filteredUsers);
  userTable.innerHTML = "";
  filteredUsers.forEach((user) => {
    const row = dom.createElement("tr");
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.address.city}</td>
        <button onclick="viewUser(${user.id})" class="btn btn-link btn-sm">View</button>
        <button onclick="editUser(${user.id})" class="btn btn-link btn-sm">Edit</button>
        <button onclick="deleteUser(${user.id})" class="btn btn-link btn-sm">Delete</button>`;
    userTable.appendChild(row);
  });
}

function generateID() {
  return (userCount += 1);
}
