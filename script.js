* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #07111f;
    color: #eef5ff;
}

button,
input {
    font: inherit;
}

button {
    cursor: pointer;
    border: 0;
    border-radius: 12px;
    padding: 11px 16px;
    background: #17283d;
    color: white;
}

button:hover {
    filter: brightness(1.15);
}

.hidden {
    display: none !important;
}

.full {
    width: 100%;
}

.primary {
    background: #4f8cff;
}


/* NAV */

header {
    min-height: 70px;
    padding: 0 5%;
    display: flex;
    align-items: center;
    gap: 30px;
    background: #0b1727;
    border-bottom: 1px solid #20334c;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.brand {
    font-size: 25px;
    font-weight: 800;
}

nav {
    display: flex;
    gap: 7px;
    flex: 1;
}

nav button {
    background: transparent;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 12px;
}


/* PAGES */

.page {
    max-width: 1250px;
    margin: auto;
    padding: 42px 5%;
}


/* AUTH */

.auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 20px;
}

.auth-card {
    width: min(440px, 100%);
    padding: 35px;
    border: 1px solid #263b56;
    border-radius: 25px;
    background: #0d1b2d;
    box-shadow: 0 20px 60px #0005;
}

.auth-card h1 {
    text-align: center;
    font-size: 45px;
    margin: 0;
}

.tagline {
    text-align: center;
    color: #a9bad0;
}

.tabs {
    display: flex;
    gap: 6px;
    margin: 25px 0;
}

.tabs button {
    flex: 1;
}

.tabs .active {
    background: #4f8cff;
}

input {
    width: 100%;
    padding: 13px 14px;
    margin: 6px 0;
    background: #081525;
    border: 1px solid #29415e;
    color: white;
    border-radius: 11px;
    outline: none;
}

input:focus {
    border-color: #4f8cff;
}

.message {
    min-height: 22px;
    margin-top: 12px;
    color: #ffb4b4;
}


/* HERO */

.hero {
    padding: 45px;
    border-radius: 28px;
    background: linear-gradient(
        135deg,
        #132d4a,
        #0d1c30
    );

    display: flex;
    justify-content: space-between;
    gap: 30px;
}

.hero h1 {
    font-size: 54px;
    margin: 8px 0;
}

.hero p {
    color: #a9bad0;
}

.eyebrow {
    letter-spacing: 3px;
    color: #77a9ff;
    font-weight: 800;
}

.role-row {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.stats {
    display: flex;
    gap: 22px;
    align-items: center;
}

.stats div {
    min-width: 100px;
    text-align: center;
}

.stats b {
    display: block;
    font-size: 30px;
}

.stats span {
    color: #9db0c7;
}


/* CARDS */

.cards {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(260px, 1fr));

    gap: 18px;
    margin-top: 24px;
}

.card {
    background: #0d1b2d;
    border: 1px solid #233b56;
    border-radius: 20px;
    padding: 23px;
}

.card p {
    color: #a9bad0;
    line-height: 1.5;
}


/* PROFILE */

.profile-card {
    display: flex;
    gap: 35px;
    align-items: center;
    background: #0d1b2d;
    padding: 30px;
    border-radius: 22px;
    margin: 25px 0;
}

.avatar-wrap {
    position: relative;
    width: 160px;
    text-align: center;
}

.profile-avatar {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid white;
    position: relative;
    z-index: 2;
    background: #17283d;
}

.avatar-effect {
    position: absolute;
    inset: -17px;
    border: 4px dashed #79aaff;
    border-radius: 50%;
    animation: spin 8s linear infinite;
    z-index: 1;
    pointer-events: none;
}


/* BADGES */

.badge-grid {
    display: grid;
    grid-template-columns:
        repeat(auto-fit, minmax(180px, 1fr));

    gap: 15px;
    margin-top: 25px;
}

.badge {
    padding: 20px;
    text-align: center;
    border-radius: 18px;
    background: #0d1b2d;
    border: 1px solid #29415e;
}

.badge .icon {
    font-size: 38px;
}

.locked {
    opacity: 0.35;
}


/* ANIMATION */

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}


/* MOBILE */

@media (max-width: 850px) {

    header {
        height: auto;
        flex-wrap: wrap;
        padding: 15px;
    }

    nav {
        order: 3;
        width: 100%;
        overflow: auto;
    }

    .hero {
        display: block;
    }

    .hero h1 {
        font-size: 40px;
    }

    .stats {
        margin-top: 25px;
    }

    .profile-card {
        flex-direction: column;
        align-items: flex-start;
    }
}
