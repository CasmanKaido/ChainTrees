export function AvatarUpload({ onUpload }) {
    return `
        <div class="avatar-upload">
            <label class="avatar-label" for="avatar-input">
                <div class="avatar-preview" id="avatar-preview">
                    <!-- Preview image will be injected here -->
                </div>
                <span class="avatar-btn">Change Avatar</span>
                <input type="file" id="avatar-input" accept="image/*" style="display:none" />
            </label>
        </div>
    `;
}

// Initialize AvatarUpload behavior
window.initAvatarUpload = function (containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const input = container.querySelector('#avatar-input');
    const preview = container.querySelector('#avatar-preview');

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (event) {
            preview.innerHTML = `<img src="${event.target.result}" alt="Avatar" class="avatar-img" />`;
            if (typeof callback === 'function') {
                callback(file);
            }
        };
        reader.readAsDataURL(file);
    });
};
