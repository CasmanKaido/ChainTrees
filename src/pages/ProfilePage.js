export function ProfilePage() {
    return `
        <div class="profile-page">
            <section class="profile-header">
                <div class="avatar-wrapper" id="avatar-wrapper">
                    <!-- Avatar will be injected by AvatarUpload component -->
                </div>
                <h1 class="username" id="username-display">User</h1>
                <button class="btn btn-secondary" onclick="openEditProfile()">Edit Profile</button>
            </section>

            <section class="profile-stats">
                <div class="stat-card">
                    <h3>XP</h3>
                    <p id="xp-value">0</p>
                </div>
                <div class="stat-card">
                    <h3>Level</h3>
                    <p id="level-value">1</p>
                </div>
                <div class="stat-card">
                    <h3>Streak</h3>
                    <p id="streak-value">0</p>
                </div>
            </section>

            <section class="profile-achievements">
                <h2>Achievements</h2>
                <div class="achievements-grid" id="achievements-grid">
                    <!-- RewardBadge components will be inserted here -->
                </div>
            </section>
        </div>
    `;
}

window.openEditProfile = function () {
    alert('Profile edit modal coming soon!');
};
