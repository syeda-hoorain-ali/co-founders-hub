"use strict";
const getUsername = document.querySelector('#user');
const formSubmit = document.querySelector('#form');
const main_container = document.querySelector('.main_container');
const fetcher = async (url, option) => {
    const response = await fetch(url, option);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
};
const showCards = (user) => {
    const { avatar_url, login, html_url } = user;
    main_container.insertAdjacentHTML('beforeend', `
        <div class="card">
            <img src="${avatar_url}" alt="${login}"/>
            <hr/>
            <div class="card-footer">
                <div class="userInfo"> 
                <img src="${avatar_url}" alt="${login}"/>
                <p class="username">${login} </p> 
                </div>
                <a href="${html_url}" target="_blank">Github</a>
            </div>
        </div>
    `);
};
const fetchUserData = (url) => {
    fetcher(url, {}).then((userInfo) => {
        userInfo.forEach(user => {
            showCards(user);
        });
    });
};
fetchUserData("https://api.github.com/users");
//^ Searching Funcnality
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLocaleLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await fetcher(url, {});
        const matchingUsers = allUserData.filter((user) => {
            const username = user.login.toLocaleLowerCase();
            return username.includes(searchTerm);
        });
        //^ We need to clear previous data
        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `
                <p class="empty-msg">No matching users found</p>
            `);
        }
        else {
            matchingUsers.forEach(user => {
                showCards(user);
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
