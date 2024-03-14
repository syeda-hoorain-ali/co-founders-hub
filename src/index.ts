const getUsername = document.querySelector('#user') as HTMLInputElement;
const formSubmit = document.querySelector('#form') as HTMLFormElement;
const main_container = document.querySelector('.main_container') as HTMLDivElement;

interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    html_url: string;
}

const fetcher = async <T>(url: string, option?: RequestInit): Promise<T> => {
    const response = await fetch(url, option);

    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    return data;
} 

const showCards = (user: UserData) => {

    const { avatar_url, login, html_url } = user

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
    `)
}

const fetchUserData = (url: string) => {

    fetcher<UserData[]>(url, {}).then((userInfo) => {

        userInfo.forEach(user => {
            showCards(user);
        });
    })

}


fetchUserData("https://api.github.com/users");



//^ Searching Funcnality

formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUsername.value.toLocaleLowerCase();

    try {

        const url = "https://api.github.com/users";
        const allUserData = await fetcher<UserData[]>(url, {});

        const matchingUsers = allUserData.filter((user) => {
            const username = user.login.toLocaleLowerCase();
            return username.includes(searchTerm);
        })

        //^ We need to clear previous data
        main_container.innerHTML = "";

        if (matchingUsers.length === 0) {
            main_container.insertAdjacentHTML("beforeend", `
                <p class="empty-msg">No matching users found</p>
            `)

        } else {
            matchingUsers.forEach(user => {
                showCards(user)
            });
        }

    } catch (error) {
        console.log(error);
    }

})





