const SUPABASE_URL = "https://hcloisajtyjblnaghbtrxu.supabase.co";

// COLE AQUI SUA sb_publishable_...
const SUPABASE_KEY = "COLE_SUA_PUBLISHABLE_KEY_AQUI";

const { createClient } = supabase;

const client = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ELEMENTOS
const auth = document.getElementById("auth");
const library = document.getElementById("library");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");

const logoutButton = document.getElementById("logoutButton");

const message = document.getElementById("message");
const userEmail = document.getElementById("userEmail");


// MENSAGENS
function showMessage(text) {
    message.textContent = text;
}


// CADASTRO
signupButton.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Digite seu e-mail e sua senha.");
        return;
    }

    if (password.length < 6) {
        showMessage("A senha precisa ter pelo menos 6 caracteres.");
        return;
    }

    showMessage("Criando sua conta...");

    const { data, error } = await client.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        showMessage(error.message);
        return;
    }

    if (!data.session) {
        showMessage(
            "Conta criada! Verifique seu e-mail para confirmar a conta."
        );
        return;
    }

    showLibrary(data.user);
});


// LOGIN
loginButton.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Digite seu e-mail e sua senha.");
        return;
    }

    showMessage("Entrando...");

    const { data, error } =
        await client.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        showMessage("E-mail ou senha incorretos.");
        return;
    }

    showLibrary(data.user);
});


// MOSTRAR BIBLIOTECA
function showLibrary(user) {

    auth.hidden = true;
    library.hidden = false;

    userEmail.textContent = user.email;

    showMessage("");
}


// LOGOUT
logoutButton.addEventListener("click", async () => {

    await client.auth.signOut();

    library.hidden = true;
    auth.hidden = false;

    emailInput.value = "";
    passwordInput.value = "";

    showMessage("Você saiu da conta.");
});


// VERIFICAR SE JÁ ESTÁ LOGADO
async function checkSession() {

    const {
        data: { session }
    } = await client.auth.getSession();

    if (session) {
        showLibrary(session.user);
    }
}

checkSession();
