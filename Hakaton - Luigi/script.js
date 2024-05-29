document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const postForm = document.getElementById("postForm");
    const logoutLink = document.getElementById("logoutLink");
    const postsSection = document.getElementById("posts");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("regUsername").value;
            const password = document.getElementById("regPassword").value;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = users.some(user => user.username === username);
            
            if (userExists) {
                alert("Usuário já existe!");
            } else {
                users.push({ username, password });
                localStorage.setItem("users", JSON.stringify(users));
                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const validUser = users.find(user => user.username === username && user.password === password);

            if (validUser) {
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("currentUser", username);
                window.location.href = "blog.html";
            } else {
                alert("Usuário ou senha incorretos!");
            }
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    if (postForm) {
        if (localStorage.getItem("loggedIn") !== "true") {
            postForm.classList.add("hidden");
        } else {
            postForm.classList.remove("hidden");
            postForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const title = document.getElementById("title").value;
                const content = document.getElementById("content").value;
                const imageFile = document.getElementById("image").files[0];
                const currentUser = localStorage.getItem("currentUser");
                const date = new Date();

                const reader = new FileReader();
                reader.onloadend = () => {
                    const posts = JSON.parse(localStorage.getItem("posts")) || [];
                    const postId = Date.now().toString(); // Gerar um ID único para a postagem
                    posts.push({
                        id: postId,
                        title,
                        content,
                        image: reader.result,
                        user: currentUser,
                        timestamp: date.toLocaleString()
                    });
                    localStorage.setItem("posts", JSON.stringify(posts));
                    displayPosts();
                };
                if (imageFile) {
                    reader.readAsDataURL(imageFile);
                } else {
                    const posts = JSON.parse(localStorage.getItem("posts")) || [];
                    const postId = Date.now().toString(); // Gerar um ID único para a postagem
                    posts.push({
                        id: postId,
                        title,
                        content,
                        image: "",
                        user: currentUser,
                        timestamp: date.toLocaleString()
                    });
                    localStorage.setItem("posts", JSON.stringify(posts));
                    displayPosts();
                }

                postForm.reset();
            });
        }
    }

    // Delegação de eventos para exclusão de postagem
    postsSection.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
            const postId = e.target.parentElement.dataset.id;
            let posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts = posts.filter(post => post.id !== postId);
            localStorage.setItem("posts", JSON.stringify(posts));
            displayPosts();
        }
    });
    

    function displayPosts() {
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        postsSection.innerHTML = posts
            .map(
                (post) => `
                    <div class="post" data-id="${post.id}">
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                        ${
                            post.image
                                ? `<img src="${post.image}" alt="${post.title}">`
                                : ""
                        }
                        <br>
                        <small>Postado por: ${post.user}</small><br>
                        <small>Data e Hora: ${post.timestamp}</small>
                        ${
                            localStorage.getItem("currentUser") === post.user
                                ? `<button class="delete">Excluir</button>`
                                : ""
                        }
                    </div>`
            )
            .join("");
    }

    // Initial call to display posts
    displayPosts();
});